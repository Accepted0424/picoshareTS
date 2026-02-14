import type { GuestLinkRow } from "../lib/core";
import { escapeHtml } from "../lib/core";
import guestTemplate from "../templates/guest.html";

export type GuestLang = "en" | "zh";

const GUEST_I18N: Record<
  GuestLang,
  {
    page_title: string;
    back_home: string;
    switch_lang: string;
    guest_link: string;
    hint_prefix: string;
    max_mb: string;
    unlimited_size: string;
    uploads: string;
    unlimited_uploads: string;
    file_exp_days: string;
    default_exp: string;
    url_expires: string;
    url_never: string;
    files: string;
    drop_choose: string;
    drop_support: string;
    no_files: string;
    or_paste: string;
    paste_placeholder: string;
    note_optional: string;
    upload: string;
    upload_limit_reached: string;
    select_or_paste_first: string;
    upload_limit_exceeded: string;
    file_too_large: string;
    uploaded_files: string;
    upload_wait: string;
  }
> = {
  en: {
    page_title: "Guest Upload - PicoShare",
    back_home: "← Back to PicoShare",
    switch_lang: "中文",
    guest_link: "Guest link",
    hint_prefix: "Upload a file without signing in. Limits:",
    max_mb: "max {size} MB",
    unlimited_size: "unlimited size",
    uploads: "uploads {used}/{max}",
    unlimited_uploads: "unlimited uploads",
    file_exp_days: "file expiration {days} days",
    default_exp: "default expiration",
    url_expires: "URL expires {date}",
    url_never: "URL never expires",
    files: "Files",
    drop_choose: "Drop files here or click to choose",
    drop_support: "Supports drag and drop and batch upload",
    no_files: "No files selected",
    or_paste: "Or paste text",
    paste_placeholder: "Paste plain text and it will be uploaded as a .txt file",
    note_optional: "Note (optional)",
    upload: "Upload",
    upload_limit_reached: "Upload limit reached for this guest link.",
    select_or_paste_first: "Select a file or paste text first.",
    upload_limit_exceeded: "Upload limit exceeded. You can upload {left} more file(s).",
    file_too_large: "File \"{name}\" is too large. Max allowed is {max} MB.",
    uploaded_files: "Uploaded {count} file(s). URL(s): {urls}{suffix}",
    upload_wait: "Uploading, please wait...",
  },
  zh: {
    page_title: "访客上传 - PicoShare",
    back_home: "← 返回 PicoShare",
    switch_lang: "EN",
    guest_link: "访客链接",
    hint_prefix: "无需登录即可上传文件。限制：",
    max_mb: "最大 {size} MB",
    unlimited_size: "大小不限",
    uploads: "上传次数 {used}/{max}",
    unlimited_uploads: "上传次数不限",
    file_exp_days: "文件保留 {days} 天",
    default_exp: "默认过期策略",
    url_expires: "链接过期 {date}",
    url_never: "链接永不过期",
    files: "文件",
    drop_choose: "拖拽文件到这里，或点击选择",
    drop_support: "支持拖拽和批量上传",
    no_files: "未选择文件",
    or_paste: "或粘贴文本",
    paste_placeholder: "粘贴纯文本后将上传为 .txt 文件",
    note_optional: "备注（可选）",
    upload: "上传",
    upload_limit_reached: "该访客链接已达到上传次数上限。",
    select_or_paste_first: "请先选择文件或粘贴文本。",
    upload_limit_exceeded: "超出上传限制，你还可以上传 {left} 个文件。",
    file_too_large: "文件“{name}”过大，最大允许 {max} MB。",
    uploaded_files: "成功上传 {count} 个文件。URL：{urls}{suffix}",
    upload_wait: "正在上传，请稍候...",
  },
};

export function normalizeGuestLang(value: string | null): GuestLang {
  return value === "zh" ? "zh" : "en";
}

export function guestText(lang: GuestLang, key: keyof (typeof GUEST_I18N)["en"], vars: Record<string, string | number> = {}): string {
  const template = GUEST_I18N[lang][key];
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}


function renderGuestTemplate(replacements: Record<string, string>): string {
  let output = guestTemplate;
  for (const [token, value] of Object.entries(replacements)) {
    output = output.replaceAll(token, value);
  }
  return output;
}

export function guestUploadPage(link: GuestLinkRow, message: string | null, isError: boolean, lang: GuestLang): string {
  const tr = GUEST_I18N[lang];
  const title = link.label || `${tr.guest_link} ${link.id}`;
  const infoParts = [
    link.max_file_bytes ? guestText(lang, "max_mb", { size: Math.round(link.max_file_bytes / (1024 * 1024)) }) : tr.unlimited_size,
    link.max_file_uploads ? guestText(lang, "uploads", { used: link.upload_count || 0, max: link.max_file_uploads }) : tr.unlimited_uploads,
    link.max_file_lifetime_days ? guestText(lang, "file_exp_days", { days: link.max_file_lifetime_days }) : tr.default_exp,
    link.url_expires ? guestText(lang, "url_expires", { date: link.url_expires.slice(0, 10) }) : tr.url_never,
  ];
  const flash = message ? `<div class="flash ${isError ? "err" : "ok"}">${escapeHtml(message)}</div>` : "";
  const nextLang = lang === "en" ? "zh" : "en";

  return renderGuestTemplate({
    __HTML_LANG__: lang === "zh" ? "zh-CN" : "en",
    __PAGE_TITLE__: escapeHtml(tr.page_title),
    __BACK_HOME__: escapeHtml(tr.back_home),
    __NEXT_LANG__: nextLang,
    __SWITCH_LANG__: escapeHtml(tr.switch_lang),
    __TITLE__: escapeHtml(title),
    __HINT_PREFIX__: escapeHtml(tr.hint_prefix),
    __INFO_PARTS__: escapeHtml(infoParts.join(" • ")),
    __FLASH__: flash,
    __LANG__: lang,
    __FILES__: escapeHtml(tr.files),
    __DROP_CHOOSE__: escapeHtml(tr.drop_choose),
    __DROP_SUPPORT__: escapeHtml(tr.drop_support),
    __NO_FILES__: escapeHtml(tr.no_files),
    __OR_PASTE__: escapeHtml(tr.or_paste),
    __PASTE_PLACEHOLDER__: escapeHtml(tr.paste_placeholder),
    __NOTE_OPTIONAL__: escapeHtml(tr.note_optional),
    __UPLOAD__: escapeHtml(tr.upload),
    __UPLOAD_WAIT__: escapeHtml(tr.upload_wait),
    __NO_FILES_JSON__: JSON.stringify(tr.no_files),
    __LANG_JSON__: JSON.stringify(lang),
  });
}
