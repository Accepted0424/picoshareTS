export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  PS_SHARED_SECRET: string;
}

export type EntryRow = {
  id: string;
  filename: string;
  content_type: string | null;
  size: number;
  upload_time: string;
  expiration_time: string | null;
  note: string | null;
  guest_link_id: string | null;
};

export type GuestLinkRow = {
  id: string;
  label: string | null;
  created_time: string | null;
  max_file_bytes: number | null;
  max_file_lifetime_days: number | null;
  max_file_uploads: number | null;
  url_expires: string | null;
  upload_count: number | null;
};

const ID_CHARS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ID_LENGTH = 10;

export function generateID(): string {
  let result = "";
  for (let i = 0; i < ID_LENGTH; i += 1) {
    result += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
  }
  return result;
}

export function withCors(headers: HeadersInit = {}): Headers {
  const h = new Headers(headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return h;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: withCors({ "Content-Type": "application/json" }),
  });
}

export function parseExpirationDays(input: string | null): number | null {
  if (!input) return null;
  const n = Number.parseInt(input, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(n, 3650);
}

export function expirationToISO(days: number | null): string | null {
  if (!days) return null;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function boolFromSetting(value: string | null): boolean {
  return value === "1" || value === "true";
}

export function isExpired(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() <= Date.now();
}

export function parseDateFromUnknown(v: unknown): string | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
