import type { GuestLinkRow } from "../lib/core";
import { escapeHtml } from "../lib/core";

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

  return `<!doctype html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>${escapeHtml(tr.page_title)}</title>
  <style>
    body {
      margin: 0;
      font-family: "Avenir Next", "SF Pro Text", "Segoe UI", sans-serif;
      color: #2f4161;
      background:
        radial-gradient(circle at 18% 86%, rgba(68, 95, 255, 0.5), transparent 30%),
        radial-gradient(circle at 80% 30%, rgba(243, 173, 233, 0.6), transparent 30%),
        radial-gradient(circle at 55% 50%, rgba(255, 255, 255, 0.7), transparent 42%),
        linear-gradient(145deg, #f7f9ff, #eef1f8);
      min-height: 100vh;
      padding: 22px;
      box-sizing: border-box;
    }
    .wrap {
      max-width: 1140px;
      margin: 0 auto;
      padding: 16px 36px 28px;
    }
    .top-nav {
      margin: 0 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #2b5cc9;
      text-decoration: none;
      border: 1px solid rgba(43, 92, 201, 0.35);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.35);
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .back-link:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.6);
    }
    h1 { margin: 0 0 8px; font-size: 50px; letter-spacing: 0.2px; }
    .hint { color: #6f7d94; margin: 0 0 18px; line-height: 1.5; max-width: 880px; }
    .flash { margin: 0 0 14px; border: 1px solid; border-radius: 12px; padding: 10px 12px; font-size: 14px; backdrop-filter: blur(10px); }
    .ok { background: #e8f7f1; color: #1f6b53; border-color: #8dd8bf; }
    .err { background: #fdeef2; color: #942946; border-color: #f3a9bc; }
    label { display: block; margin: 10px 0 6px; font-weight: 600; color: #4e5d77; }
    input, textarea {
      width: 100%;
      border: 1px solid rgba(255,255,255,0.72);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 16px;
      box-sizing: border-box;
      background: rgba(255,255,255,0.36);
      color: #40506a;
      outline: none;
      backdrop-filter: blur(10px);
    }
    input:focus, textarea:focus {
      border-color: rgba(16, 27, 114, 0.42);
      box-shadow: 0 0 0 3px rgba(16, 27, 114, 0.12);
    }
    textarea { min-height: 150px; resize: vertical; }
    .drop-zone {
      margin-top: 6px;
      min-height: 210px;
      border: 2px dashed rgba(148, 166, 196, 0.55);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.24);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      padding: 18px;
      color: #4d6081;
    }
    .drop-zone.dragover {
      border-color: rgba(34, 130, 255, 0.95);
      background: rgba(207, 231, 255, 0.38);
      box-shadow: inset 0 0 0 2px rgba(53, 143, 255, 0.15);
    }
    .dz-primary { font-size: 18px; font-weight: 700; }
    .dz-secondary { font-size: 13px; color: #6f7d94; }
    .dz-list {
      margin-top: 6px;
      width: 100%;
      max-width: 760px;
      font-size: 13px;
      color: #3f5a9b;
      max-height: 84px;
      overflow: auto;
      text-align: left;
      border: 1px solid rgba(255,255,255,0.52);
      border-radius: 10px;
      padding: 8px 10px;
      background: rgba(255,255,255,0.35);
      white-space: pre-line;
    }
    .actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    .busy-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.42);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 95;
      backdrop-filter: blur(2px);
    }
    .busy-card {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 14px;
      padding: 12px 18px;
      color: #334766;
      font-weight: 700;
      box-shadow: 0 10px 34px rgba(28, 45, 78, 0.25);
    }
    .busy-spinner {
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 3px solid rgba(50, 142, 207, 0.25);
      border-top-color: #328ecf;
      animation: busy-spin 0.85s linear infinite;
    }
    @keyframes busy-spin {
      to { transform: rotate(360deg); }
    }
    button[type="submit"] {
      background: transparent;
      position: relative;
      padding: 8px 18px;
      display: inline-flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid rgb(40, 144, 241);
      border-radius: 25px;
      outline: none;
      overflow: hidden;
      color: rgb(40, 144, 241);
      transition: color 0.3s 0.1s ease-out, transform 0.2s ease;
      text-align: center;
      min-width: 140px;
      justify-content: center;
      z-index: 1;
    }
    button[type="submit"]::before {
      position: absolute;
      top: 0;
      left: -5em;
      right: 0;
      bottom: 0;
      margin: auto;
      content: '';
      border-radius: 50%;
      display: block;
      width: 20em;
      height: 20em;
      text-align: center;
      transition: box-shadow 0.5s ease-out;
      z-index: -1;
    }
    button[type="submit"]:hover {
      color: #fff;
      transform: translateY(-1px);
    }
    button[type="submit"]:hover::before {
      box-shadow: inset 0 0 0 10em rgb(40, 144, 241);
    }
    .hidden { display: none !important; }
    @media (max-width: 980px) {
      .wrap { padding: 8px 12px 24px; }
      h1 { font-size: 34px; }
      .drop-zone { min-height: 170px; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <div class="top-nav">
      <a class="back-link" href="/">${escapeHtml(tr.back_home)}</a>
      <a class="back-link" href="?lang=${nextLang}">${escapeHtml(tr.switch_lang)}</a>
    </div>
    <h1>${escapeHtml(title)}</h1>
    <p class="hint">${escapeHtml(tr.hint_prefix)} ${escapeHtml(infoParts.join(" • "))}.</p>
    ${flash}
    <form id="guest-form" method="post" enctype="multipart/form-data">
      <input type="hidden" name="lang" value="${lang}" />
      <label for="files">${escapeHtml(tr.files)}</label>
      <input id="files" name="files" type="file" multiple class="hidden" />
      <div id="drop-zone" class="drop-zone" role="button" tabindex="0" aria-label="${escapeHtml(tr.drop_choose)}">
        <div class="dz-primary">${escapeHtml(tr.drop_choose)}</div>
        <div class="dz-secondary">${escapeHtml(tr.drop_support)}</div>
        <div id="file-list" class="dz-list">${escapeHtml(tr.no_files)}</div>
      </div>
      <label for="pastedText">${escapeHtml(tr.or_paste)}</label>
      <textarea id="pastedText" name="pastedText" placeholder="${escapeHtml(tr.paste_placeholder)}"></textarea>
      <label for="note">${escapeHtml(tr.note_optional)}</label>
      <input id="note" name="note" type="text" maxlength="240" />
      <div class="actions"><button type="submit">${escapeHtml(tr.upload)}</button></div>
    </form>
  </main>
  <div id="guest-busy" class="busy-backdrop hidden" aria-live="polite" aria-busy="true">
    <div class="busy-card">
      <span class="busy-spinner" aria-hidden="true"></span>
      <span>${escapeHtml(tr.upload_wait)}</span>
    </div>
  </div>
  <script>
    (function() {
      var form = document.getElementById('guest-form');
      var filesInput = document.getElementById('files');
      var dropZone = document.getElementById('drop-zone');
      var fileList = document.getElementById('file-list');
      var guestBusy = document.getElementById('guest-busy');
      var selectedFiles = [];
      var uploading = false;

      function syncFileList() {
        if (!selectedFiles.length) {
          fileList.textContent = ${JSON.stringify(tr.no_files)};
          return;
        }
        fileList.textContent = selectedFiles.map(function(f, idx) {
          return (idx + 1) + '. ' + f.name;
        }).join('\\n');
      }

      filesInput.addEventListener('change', function() {
        selectedFiles = Array.from(filesInput.files || []);
        syncFileList();
      });

      dropZone.addEventListener('click', function() { filesInput.click(); });
      dropZone.addEventListener('keydown', function(evt) {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          filesInput.click();
        }
      });

      ['dragenter', 'dragover'].forEach(function(type) {
        dropZone.addEventListener(type, function(evt) {
          evt.preventDefault();
          dropZone.classList.add('dragover');
        });
      });
      ['dragleave', 'dragend'].forEach(function(type) {
        dropZone.addEventListener(type, function(evt) {
          evt.preventDefault();
          dropZone.classList.remove('dragover');
        });
      });
      dropZone.addEventListener('drop', function(evt) {
        evt.preventDefault();
        dropZone.classList.remove('dragover');
        var files = Array.from((evt.dataTransfer && evt.dataTransfer.files) || []);
        if (files.length) {
          selectedFiles = files;
          syncFileList();
        }
      });

      form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        if (uploading) return;
        uploading = true;
        guestBusy.classList.remove('hidden');
        var fd = new FormData();
        if (selectedFiles.length) {
          selectedFiles.forEach(function(f) { fd.append('files', f); });
        } else if (filesInput.files && filesInput.files.length) {
          Array.from(filesInput.files).forEach(function(f) { fd.append('files', f); });
        }
        fd.append('lang', ${JSON.stringify(lang)});
        var pastedText = document.getElementById('pastedText').value.trim();
        var note = document.getElementById('note').value.trim();
        if (pastedText) fd.append('pastedText', pastedText);
        if (note) fd.append('note', note);
        fetch(location.href, { method: 'POST', body: fd })
          .then(function(r) { return r.text(); })
          .then(function(html) {
            document.open();
            document.write(html);
            document.close();
          })
          .catch(function() {
            uploading = false;
            guestBusy.classList.add('hidden');
          });
      });
    })();
  </script>
</body>
</html>`;
}

