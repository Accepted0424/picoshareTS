import type { EntryRow, Env, GuestLinkRow } from "./core";

async function ensureSchema(env: Env): Promise<void> {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )`,
  ).run();

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS download_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id TEXT NOT NULL,
      downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip TEXT,
      user_agent TEXT
    )`,
  ).run();

  const alterStatements = [
    "ALTER TABLE guest_links ADD COLUMN label TEXT",
    "ALTER TABLE guest_links ADD COLUMN created_time DATETIME DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE guest_links ADD COLUMN upload_count INTEGER DEFAULT 0",
  ];

  for (const stmt of alterStatements) {
    try {
      await env.DB.exec(stmt);
    } catch {
      // Ignore if column already exists in deployed database.
    }
  }

  await env.DB.prepare(
    "INSERT OR IGNORE INTO settings(key, value) VALUES ('store_forever', '1')",
  ).run();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO settings(key, value) VALUES ('default_expiration_days', '30')",
  ).run();
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchemaOnce(env: Env): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema(env).catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

export async function getEntryById(env: Env, id: string): Promise<EntryRow | null> {
  return env.DB.prepare(
    "SELECT id, filename, content_type, size, upload_time, expiration_time, note, guest_link_id FROM entries WHERE id = ?",
  )
    .bind(id)
    .first<EntryRow>();
}

export async function getGuestLinkById(env: Env, id: string): Promise<GuestLinkRow | null> {
  return env.DB.prepare(
    "SELECT id, label, created_time, max_file_bytes, max_file_lifetime_days, max_file_uploads, url_expires, upload_count FROM guest_links WHERE id = ?",
  )
    .bind(id)
    .first<GuestLinkRow>();
}

export async function deleteEntryById(env: Env, id: string): Promise<void> {
  await env.BUCKET.delete(id);
  await env.DB.prepare("DELETE FROM download_events WHERE entry_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM entries WHERE id = ?").bind(id).run();
}

export async function cleanupExpiredEntries(
  env: Env,
  nowIso = new Date().toISOString(),
  limit = 100,
): Promise<number> {
  const res = await env.DB.prepare(
    `SELECT id
     FROM entries
     WHERE expiration_time IS NOT NULL
       AND expiration_time <= ?
     ORDER BY expiration_time ASC
     LIMIT ?`,
  )
    .bind(nowIso, Math.max(1, Math.min(1000, limit)))
    .all<{ id: string }>();

  const ids = res.results.map((r) => r.id);
  for (const id of ids) {
    await deleteEntryById(env, id);
  }
  return ids.length;
}

let lastExpiredCleanupAt = 0;

export async function maybeCleanupExpiredEntries(env: Env): Promise<void> {
  const now = Date.now();
  if (now - lastExpiredCleanupAt < 60_000) return;
  lastExpiredCleanupAt = now;
  try {
    await cleanupExpiredEntries(env);
  } catch {
    // Don't fail requests if cleanup fails; retry next interval.
    lastExpiredCleanupAt = 0;
  }
}
