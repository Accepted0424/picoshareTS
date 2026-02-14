import {
  boolFromSetting,
  expirationToISO,
  generateID,
  isExpired,
  json,
  parseDateFromUnknown,
  parseExpirationDays,
  withCors,
} from "./lib/core";
import type { Env } from "./lib/core";
import {
  deleteEntryById,
  ensureSchemaOnce,
  getEntryById,
  getGuestLinkById,
  maybeCleanupExpiredEntries,
} from "./lib/storage";
import { htmlPage } from "./ui/admin-page";
import { guestText, guestUploadPage, normalizeGuestLang } from "./ui/guest-page";

function unauthorized(): Response {
  return new Response("Unauthorized", { status: 401, headers: withCors() });
}

async function requireAuth(request: Request, env: Env): Promise<boolean> {
  return request.headers.get("Authorization") === env.PS_SHARED_SECRET;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    await ensureSchemaOnce(env);

    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: withCors() });
    }

    await maybeCleanupExpiredEntries(env);

    if (url.pathname.startsWith("/_preview/") && request.method === "GET") {
      const id = decodeURIComponent(url.pathname.split("/").pop() || "");
      const entry = await getEntryById(env, id);
      if (!entry) return new Response("Not Found", { status: 404, headers: withCors() });
      if (isExpired(entry.expiration_time)) {
        await deleteEntryById(env, id);
        return new Response("File expired", { status: 410, headers: withCors() });
      }

      const obj = await env.BUCKET.get(id);
      if (!obj) return new Response("Not Found", { status: 404, headers: withCors() });

      const h = withCors();
      obj.writeHttpMetadata(h);
      h.set("Content-Disposition", "inline");
      if (entry.content_type) h.set("Content-Type", entry.content_type);
      return new Response(obj.body, { headers: h });
    }

    if (url.pathname.startsWith("/-") && request.method === "GET") {
      const id = decodeURIComponent(url.pathname.slice(2).split("/")[0] || "");
      const entry = await getEntryById(env, id);
      if (!entry) return new Response("Not Found", { status: 404, headers: withCors() });
      if (isExpired(entry.expiration_time)) {
        await deleteEntryById(env, id);
        return new Response("File expired", { status: 410, headers: withCors() });
      }

      const obj = await env.BUCKET.get(id);
      if (!obj) return new Response("Not Found", { status: 404, headers: withCors() });

      await env.DB.prepare(
        "INSERT INTO download_events(entry_id, ip, user_agent) VALUES (?, ?, ?)",
      )
        .bind(id, request.headers.get("cf-connecting-ip"), request.headers.get("user-agent"))
        .run();

      const h = withCors();
      obj.writeHttpMetadata(h);
      h.set("Content-Disposition", `inline; filename="${entry.filename}"`);
      if (entry.content_type) h.set("Content-Type", entry.content_type);
      return new Response(obj.body, { headers: h });
    }

    if (url.pathname.startsWith("/guest/")) {
      const guestId = decodeURIComponent(url.pathname.split("/").pop() || "");
      const guestLang = normalizeGuestLang(url.searchParams.get("lang"));
      const link = await getGuestLinkById(env, guestId);
      if (!link) return new Response("Guest link not found", { status: 404, headers: withCors() });
      if (isExpired(link.url_expires)) {
        return new Response("Guest link expired", { status: 410, headers: withCors() });
      }

      if (request.method === "GET") {
        return new Response(guestUploadPage(link, null, false, guestLang), {
          headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
        });
      }

      if (request.method === "POST") {
        if (link.max_file_uploads && (link.upload_count || 0) >= link.max_file_uploads) {
          return new Response(guestUploadPage(link, guestText(guestLang, "upload_limit_reached"), true, guestLang), {
            status: 429,
            headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
          });
        }

        const fd = await request.formData();
        const postLang = normalizeGuestLang((fd.get("lang") as string | null) || guestLang);
        const isFileLike = (v: unknown): v is File =>
          typeof v === "object" &&
          v !== null &&
          "arrayBuffer" in v &&
          "size" in v &&
          "name" in v;
        const filesFromAll = (fd.getAll("files") as unknown[]).filter(isFileLike);
        const fallbackFile = fd.get("file");
        const files: File[] = filesFromAll.length
          ? filesFromAll
          : (isFileLike(fallbackFile) ? [fallbackFile] : []);
        const pastedText = (fd.get("pastedText") as string | null)?.trim() || "";
        const note = ((fd.get("note") as string | null) || "").trim().slice(0, 1000) || null;
        if (files.length === 0 && !pastedText) {
          return new Response(guestUploadPage(link, guestText(postLang, "select_or_paste_first"), true, postLang), {
            status: 400,
            headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
          });
        }

        const candidates: Array<{
          id: string;
          filename: string;
          contentType: string;
          bytes: ArrayBuffer | Uint8Array;
          size: number;
        }> = [];

        for (const file of files) {
          const id = generateID();
          candidates.push({
            id,
            filename: file.name || `guest-file-${id}`,
            contentType: file.type || "application/octet-stream",
            bytes: await file.arrayBuffer(),
            size: file.size,
          });
        }

        if (pastedText) {
          const id = generateID();
          const bytes = new TextEncoder().encode(pastedText);
          candidates.push({
            id,
            filename: `guest-paste-${id}.txt`,
            contentType: "text/plain",
            bytes,
            size: bytes.byteLength,
          });
        }

        if (link.max_file_uploads) {
          const left = Math.max(0, link.max_file_uploads - (link.upload_count || 0));
          if (candidates.length > left) {
            return new Response(
              guestUploadPage(link, guestText(postLang, "upload_limit_exceeded", { left }), true, postLang),
              {
                status: 429,
                headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
              },
            );
          }
        }

        for (const item of candidates) {
          if (link.max_file_bytes && item.size > link.max_file_bytes) {
            return new Response(
              guestUploadPage(
                link,
                guestText(postLang, "file_too_large", {
                  name: item.filename,
                  max: Math.round(link.max_file_bytes / (1024 * 1024)),
                }),
                true,
                postLang,
              ),
              {
                status: 413,
                headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
              },
            );
          }
        }

        const expiration = link.max_file_lifetime_days
          ? expirationToISO(link.max_file_lifetime_days)
          : null;

        for (const item of candidates) {
          await env.BUCKET.put(item.id, item.bytes, { httpMetadata: { contentType: item.contentType } });
          await env.DB.prepare(
            "INSERT INTO entries (id, filename, content_type, size, expiration_time, note, guest_link_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          )
            .bind(item.id, item.filename, item.contentType, item.size, expiration, note, guestId)
            .run();
        }
        await env.DB.prepare(
          "UPDATE guest_links SET upload_count = COALESCE(upload_count, 0) + ? WHERE id = ?",
        )
          .bind(candidates.length, guestId)
          .run();

        const refreshed = await getGuestLinkById(env, guestId);
        const uploadedUrls = candidates
          .slice(0, 3)
          .map((c) => new URL(`/-${c.id}`, request.url).toString());
        const suffix = candidates.length > 3
          ? (postLang === "zh" ? `（另 ${candidates.length - 3} 个）` : ` (+${candidates.length - 3} more)`)
          : "";
        return new Response(
          guestUploadPage(
            refreshed || link,
            guestText(postLang, "uploaded_files", {
              count: candidates.length,
              urls: uploadedUrls.join(", "),
              suffix,
            }),
            false,
            postLang,
          ),
          { headers: withCors({ "Content-Type": "text/html; charset=utf-8" }) },
        );
      }

      return new Response("Method Not Allowed", { status: 405, headers: withCors() });
    }

    if (url.pathname.startsWith("/api/")) {
      if (!(await requireAuth(request, env))) {
        return unauthorized();
      }

      if (url.pathname === "/api/entry" && request.method === "POST") {
        const fd = await request.formData();
        const file = fd.get("file") as File | null;
        const pastedText = (fd.get("pastedText") as string | null)?.trim() || "";

        if (!file && !pastedText) {
          return json({ error: "file or pastedText is required" }, 400);
        }

        const id = generateID();
        const note = ((fd.get("note") as string | null) || "").trim() || null;
        const expirationDays = parseExpirationDays((fd.get("expirationDays") as string | null) || null);
        const expiration = expirationToISO(expirationDays);

        let filename = `paste-${id}.txt`;
        let contentType = "text/plain";
        let bytes: ArrayBuffer | Uint8Array;
        let size = 0;

        if (file) {
          filename = file.name;
          contentType = file.type || "application/octet-stream";
          bytes = await file.arrayBuffer();
          size = file.size;
        } else {
          bytes = new TextEncoder().encode(pastedText);
          size = bytes.byteLength;
        }

        await env.BUCKET.put(id, bytes, { httpMetadata: { contentType } });
        await env.DB.prepare(
          "INSERT INTO entries (id, filename, content_type, size, expiration_time, note) VALUES (?, ?, ?, ?, ?, ?)",
        )
          .bind(id, filename, contentType, size, expiration, note)
          .run();

        return json({ id, filename });
      }

      if (url.pathname === "/api/entries" && request.method === "GET") {
        const res = await env.DB.prepare(
          `SELECT
             e.id,
             e.filename,
             e.content_type,
             e.size,
             e.upload_time,
             e.expiration_time,
             e.note,
             COALESCE(d.count, 0) AS download_count
           FROM entries e
           LEFT JOIN (
             SELECT entry_id, COUNT(*) AS count
             FROM download_events
             GROUP BY entry_id
           ) d ON d.entry_id = e.id
           ORDER BY e.upload_time DESC`,
        ).all();
        return json(res.results);
      }

      if (url.pathname.startsWith("/api/entry/") && !url.pathname.endsWith("/downloads") && request.method === "GET") {
        const id = decodeURIComponent(url.pathname.split("/").pop() || "");
        const entry = await getEntryById(env, id);
        if (!entry) return json({ error: "not found" }, 404);

        const count = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM download_events WHERE entry_id = ?",
        )
          .bind(id)
          .first<{ count: number }>();

        return json({ ...entry, download_count: Number(count?.count || 0) });
      }

      if (url.pathname.startsWith("/api/entry/") && url.pathname.endsWith("/downloads") && request.method === "GET") {
        const parts = url.pathname.split("/");
        const id = decodeURIComponent(parts[3] || "");
        const uniqueIps = url.searchParams.get("uniqueIps") === "1";

        const totalRes = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM download_events WHERE entry_id = ?",
        ).bind(id).first<{ count: number }>();

        if (uniqueIps) {
          const events = await env.DB.prepare(
            `SELECT
               MAX(downloaded_at) AS downloaded_at,
               ip,
               user_agent
             FROM download_events
             WHERE entry_id = ?
             GROUP BY ip
             ORDER BY downloaded_at DESC`,
          ).bind(id).all();
          return json({ total: Number(totalRes?.count || 0), events: events.results });
        }

        const events = await env.DB.prepare(
          `SELECT downloaded_at, ip, user_agent
           FROM download_events
           WHERE entry_id = ?
           ORDER BY downloaded_at DESC`,
        ).bind(id).all();
        return json({ total: Number(totalRes?.count || 0), events: events.results });
      }

      if (url.pathname.startsWith("/api/entry/") && request.method === "PUT") {
        const id = decodeURIComponent(url.pathname.split("/").pop() || "");
        const entry = await getEntryById(env, id);
        if (!entry) return json({ error: "not found" }, 404);

        const body = (await request.json()) as {
          filename?: string;
          note?: string;
          deleteAfterExpiration?: boolean;
          expirationDays?: number;
        };

        const filename = (body.filename || entry.filename).trim().slice(0, 255);
        const note = (body.note || "").trim().slice(0, 1000) || null;
        const deleteAfter = Boolean(body.deleteAfterExpiration);
        const expDays = Number(body.expirationDays || 0);
        const expiration = deleteAfter && expDays > 0 ? expirationToISO(expDays) : null;

        await env.DB.prepare(
          "UPDATE entries SET filename = ?, note = ?, expiration_time = ? WHERE id = ?",
        )
          .bind(filename || entry.filename, note, expiration, id)
          .run();

        return json({ ok: true });
      }

      if (url.pathname.startsWith("/api/entry/") && request.method === "DELETE") {
        const id = decodeURIComponent(url.pathname.split("/").pop() || "");
        await deleteEntryById(env, id);
        return json({ ok: true });
      }

      if (url.pathname === "/api/guest-links" && request.method === "GET") {
        const res = await env.DB.prepare(
          "SELECT id, label, created_time, max_file_bytes, max_file_lifetime_days, max_file_uploads, url_expires, upload_count FROM guest_links ORDER BY COALESCE(created_time, url_expires) DESC",
        ).all();
        return json(res.results);
      }

      if (url.pathname === "/api/guest-links" && request.method === "POST") {
        const body = (await request.json()) as {
          label?: string | null;
          max_file_bytes?: number | null;
          max_file_lifetime_days?: number | null;
          max_file_uploads?: number | null;
          url_expires?: string | null;
        };

        const id = generateID();
        const label = (body.label || "").trim().slice(0, 120) || null;
        const maxFileBytes = Number(body.max_file_bytes || 0) || null;
        const maxFileLife = Number(body.max_file_lifetime_days || 0) || null;
        const maxFileUploads = Number(body.max_file_uploads || 0) || null;
        const urlExpires = parseDateFromUnknown(body.url_expires);

        await env.DB.prepare(
          "INSERT INTO guest_links (id, label, max_file_bytes, max_file_lifetime_days, max_file_uploads, url_expires, created_time, upload_count) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0)",
        )
          .bind(id, label, maxFileBytes, maxFileLife, maxFileUploads, urlExpires)
          .run();

        return json({ id });
      }

      if (url.pathname.startsWith("/api/guest-links/") && request.method === "DELETE") {
        const id = decodeURIComponent(url.pathname.split("/").pop() || "");
        await env.DB.prepare("DELETE FROM guest_links WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }

      if (url.pathname === "/api/settings" && request.method === "GET") {
        const rows = await env.DB.prepare(
          "SELECT key, value FROM settings WHERE key IN ('store_forever', 'default_expiration_days')",
        ).all<{ key: string; value: string }>();

        const map = new Map<string, string>();
        for (const r of rows.results) map.set(r.key, r.value);

        return json({
          storeForever: boolFromSetting(map.get("store_forever") ?? "1"),
          defaultDays: Number(map.get("default_expiration_days") ?? "30"),
        });
      }

      if (url.pathname === "/api/settings" && request.method === "PUT") {
        const body = (await request.json()) as {
          storeForever?: boolean;
          defaultDays?: number;
        };

        const storeForever = body.storeForever ? "1" : "0";
        const defaultDays = String(Math.max(1, Math.min(3650, Number(body.defaultDays || 30))));

        await env.DB.prepare("REPLACE INTO settings(key, value) VALUES ('store_forever', ?)")
          .bind(storeForever)
          .run();
        await env.DB.prepare("REPLACE INTO settings(key, value) VALUES ('default_expiration_days', ?)")
          .bind(defaultDays)
          .run();

        return json({ ok: true });
      }

      if (url.pathname === "/api/system-info" && request.method === "GET") {
        const entryStats = await env.DB.prepare(
          "SELECT COALESCE(SUM(size), 0) AS total, COUNT(*) AS count FROM entries",
        ).first<{ total: number; count: number }>();
        const guestStats = await env.DB.prepare(
          "SELECT COUNT(*) AS count FROM guest_links",
        ).first<{ count: number }>();
        const downloadStats = await env.DB.prepare(
          "SELECT COUNT(*) AS count FROM download_events",
        ).first<{ count: number }>();

        const uploadDataBytes = Number(entryStats?.total || 0);

        return json({
          upload_data_bytes: uploadDataBytes,
          db_entry_count: Number(entryStats?.count || 0),
          db_guest_link_count: Number(guestStats?.count || 0),
          download_count: Number(downloadStats?.count || 0),
        });
      }

      return json({ error: "Not Found" }, 404);
    }

    return new Response(htmlPage(), {
      headers: withCors({ "Content-Type": "text/html; charset=utf-8" }),
    });
  },
};
