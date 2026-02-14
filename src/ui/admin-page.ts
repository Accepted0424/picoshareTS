export function htmlPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>PicoShare TS</title>
  <style>
    :root {
      --bg: #eef1f8;
      --bg-2: #f7f9ff;
      --glass: rgba(255, 255, 255, 0.45);
      --glass-strong: rgba(255, 255, 255, 0.72);
      --text: #26354d;
      --muted: #6f7d94;
      --line: rgba(255, 255, 255, 0.68);
      --shadow: 0 24px 80px rgba(66, 82, 130, 0.24);
      --primary: #101b72;
      --accent: #4ec7a7;
      --danger: #eb4b70;
      --blue: #328ecf;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Avenir Next", "SF Pro Text", "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 18% 86%, rgba(68, 95, 255, 0.5), transparent 30%),
        radial-gradient(circle at 80% 30%, rgba(243, 173, 233, 0.6), transparent 30%),
        radial-gradient(circle at 55% 50%, rgba(255, 255, 255, 0.7), transparent 42%),
        linear-gradient(145deg, var(--bg-2), var(--bg));
      min-height: 100vh;
      padding: 18px;
    }
    .shell {
      max-width: 1240px;
      margin: 0 auto;
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0 0 48px;
      min-height: calc(100vh - 36px);
      box-shadow: none;
      backdrop-filter: none;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 18px 52px;
    }
    .brand { font-size: 32px; font-weight: 600; letter-spacing: 0.5px; color: #42506a; }
    .nav { display: flex; gap: 10px; align-items: center; }
    .nav .nav-upload,
    .nav .btn.small {
      height: 40px;
      box-sizing: border-box;
    }
    .nav button:not(.btn):not(.nav-upload),
    .sys-toggle {
      border: 0;
      background: transparent;
      color: #58657d;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 24px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }
    .nav button:not(.btn):not(.nav-upload)[aria-current="page"],
    .sys-toggle.active {
      background: var(--accent);
      color: #fff;
    }
    .nav button:not(.btn):not(.nav-upload):hover,
    .sys-toggle:hover { background: rgba(78, 199, 167, 0.2); transform: translateY(-1px); }
    .nav button.nav-upload {
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s;
      padding: 0 18px;
      border-radius: 100px;
      background: #cfef00;
      border: 1px solid transparent;
      display: inline-flex;
      align-items: center;
      font-size: 15px;
      color: #111;
      gap: 4px;
      min-width: 138px;
    }
    .nav button.nav-upload:hover {
      background: #c4e201;
      transform: translateY(-1px);
    }
    .nav button.nav-upload > svg {
      width: 24px;
      height: 24px;
      margin-left: 6px;
      transition: transform 0.3s ease-in-out;
      flex-shrink: 0;
    }
    .nav button.nav-upload:hover svg {
      transform: translateX(5px);
    }
    .nav button.nav-upload:active {
      transform: scale(0.95);
    }
    .nav button.nav-upload[aria-current="page"] {
      background: #cfef00;
      color: #111;
    }
    .top-right { position: relative; }
    .system-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      min-width: 220px;
      background: var(--glass-strong);
      border: 1px solid rgba(255, 255, 255, 0.75);
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(59, 77, 115, 0.24);
      backdrop-filter: blur(14px);
      display: none;
      overflow: hidden;
      z-index: 20;
    }
    .system-menu button {
      width: 100%;
      border: 0;
      background: transparent;
      text-align: left;
      padding: 12px 14px;
      font-size: 15px;
      color: #42506a;
      cursor: pointer;
    }
    .system-menu button:hover { background: rgba(255, 255, 255, 0.68); }
    main { padding: 10px 52px; }
    main:focus { outline: none; }
    h1 { font-size: 50px; margin: 18px 0 24px; letter-spacing: 0.2px; }
    h2 { font-size: 38px; margin: 0 0 16px; }
    h3 { font-size: 24px; margin: 14px 0; }
    .muted { color: var(--muted); }
    .small { font-size: 13px; color: var(--muted); }
    .stack { display: grid; gap: 16px; max-width: 920px; }
    .stack-wide { max-width: 1140px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    label { font-size: 15px; font-weight: 600; display: inline-block; margin-bottom: 6px; color: #4e5d77; }
    input, select, textarea {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.36);
      color: #40506a;
      font-size: 16px;
      outline: none;
      backdrop-filter: blur(10px);
    }
    input:focus, select:focus, textarea:focus {
      border-color: rgba(16, 27, 114, 0.42);
      box-shadow: 0 0 0 3px rgba(16, 27, 114, 0.12);
    }
    textarea { min-height: 100px; resize: vertical; }
    .btn {
      --btn-color: rgb(40, 144, 241);
      background: transparent;
      position: relative;
      padding: 5px 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--btn-color);
      border-radius: 25px;
      outline: none;
      overflow: hidden;
      color: var(--btn-color);
      transition: color 0.3s 0.1s ease-out, transform 0.2s ease;
      text-align: center;
      gap: 6px;
      min-width: 96px;
      z-index: 1;
    }
    .btn:hover {
      color: #fff;
      border: 1px solid var(--btn-color);
      transform: translateY(-1px);
    }
    .btn::before {
      position: absolute;
      inset: 0;
      content: '';
      border-radius: inherit;
      background: var(--btn-color);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.3s ease-out;
      z-index: -1;
    }
    .btn:hover::before {
      transform: scaleX(1);
    }
    .btn span {
      margin: 10px;
    }
    .btn.small {
      font-size: 14px;
      padding: 0 12px;
      border-radius: 12px;
      min-width: 84px;
      min-height: 40px;
    }
    .btn.secondary.small {
      min-width: 42px;
      padding: 0 8px;
    }
    .btn.blue.small {
      min-width: 42px;
      padding: 0 8px;
    }
    .btn.blue {
      --btn-color: rgb(40, 144, 241);
    }
    .btn.danger {
      --btn-color: #eb4b70;
    }
    .btn.form-submit {
      min-width: 140px;
      padding: 8px 18px;
      font-size: 15px;
    }
    .btn.form-submit.tight {
      min-width: 92px;
      padding: 6px 14px;
      font-size: 14px;
    }
    .submit-row {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .drop {
      border: 2px dashed rgba(148, 166, 196, 0.55);
      background: rgba(255, 255, 255, 0.24);
      border-radius: 16px;
      padding: 24px;
      width: 100%;
      min-height: 170px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }
    .drop:hover {
      border-color: rgba(77, 143, 233, 0.72);
      background: rgba(255, 255, 255, 0.38);
    }
    .drop.dragover {
      border-color: rgba(34, 130, 255, 0.95);
      background: rgba(207, 231, 255, 0.38);
      box-shadow: inset 0 0 0 2px rgba(53, 143, 255, 0.15);
    }
    .drop-primary {
      font-size: 18px;
      font-weight: 700;
      color: #3d4f70;
    }
    .drop-secondary {
      font-size: 13px;
      color: #6f7d94;
    }
    .drop-file {
      margin-top: 2px;
      font-size: 13px;
      color: #385cc8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .upload-grid {
      display: grid;
      gap: 16px;
      max-width: 920px;
      width: 100%;
    }
    .note-box {
      border-left: 4px solid #5b72cf;
      background: rgba(190, 201, 239, 0.45);
      color: #4058b5;
      border-radius: 10px;
      padding: 18px 24px;
      max-width: 940px;
      font-size: 18px;
      line-height: 1.55;
    }
    .panel {
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.32);
      padding: 18px 22px;
      backdrop-filter: blur(14px);
    }
    .settings-form {
      max-width: 620px;
      display: grid;
      gap: 14px;
      padding: 20px 22px;
    }
    .settings-form h3 {
      margin: 0 0 6px;
    }
    .check-row,
    .toggle-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
    }
    .check-row input[type="checkbox"],
    .toggle-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin: 0;
      border-radius: 4px;
    }
    .check-row label,
    .toggle-row label {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #46597c;
      cursor: pointer;
    }
    .days-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
    }
    .days-row input {
      width: 120px;
      text-align: center;
    }
    .days-row span {
      color: #60728f;
      font-size: 15px;
      font-weight: 600;
    }
    .days-row.disabled {
      opacity: 0.55;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
      background: rgba(255, 255, 255, 0.2);
    }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(10px);
    }
    table.files-table { min-width: 860px; }
    th, td {
      text-align: left;
      border-bottom: 1px solid rgba(145, 158, 185, 0.25);
      padding: 12px 10px;
      vertical-align: middle;
    }
    th { color: #43536f; font-weight: 700; font-size: 14px; }
    td.actions { white-space: nowrap; text-align: right; }
    .actions .btn { margin-left: 8px; }
    .file-cell {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
      display: inline-block;
    }
    .file-icon {
      width: 24px;
      height: 24px;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.2px;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(36, 58, 92, 0.18);
    }
    .file-icon.type-image { background: linear-gradient(145deg, #4b9eff, #2e7bd8); }
    .file-icon.type-pdf { background: linear-gradient(145deg, #ff6b6b, #d74444); }
    .file-icon.type-text { background: linear-gradient(145deg, #5cc8a3, #34a37f); }
    .file-icon.type-video { background: linear-gradient(145deg, #7b7dff, #5f63d9); }
    .file-icon.type-audio { background: linear-gradient(145deg, #9d79ff, #7656d8); }
    .file-icon.type-archive { background: linear-gradient(145deg, #f7b059, #d08a35); }
    .file-icon.type-code { background: linear-gradient(145deg, #6070f0, #4c5ace); }
    .file-icon.type-other { background: linear-gradient(145deg, #92a1b8, #71839f); }
    .file-preview {
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.78);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 18px 36px rgba(20, 30, 53, 0.28);
      backdrop-filter: blur(14px);
      pointer-events: none;
      z-index: 80;
    }
    .file-preview-title {
      padding: 8px 10px;
      font-size: 12px;
      color: #516079;
      border-bottom: 1px solid rgba(141, 157, 185, 0.25);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(255, 255, 255, 0.72);
    }
    .file-preview img {
      width: 100%;
      height: 190px;
      display: block;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.85);
    }
    .flash {
      margin: 0 52px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid;
      font-size: 14px;
      position: sticky;
      top: 10px;
      z-index: 30;
      backdrop-filter: blur(10px);
    }
    .flash.ok { background: #e7f8f2; border-color: #82d9be; color: #236a53; }
    .flash.err { background: #fdeef2; border-color: #f3a9bc; color: #8d2a45; }
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
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(19, 21, 26, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 40;
      padding: 16px;
    }
    .modal {
      width: min(560px, 100%);
      background: rgba(255, 255, 255, 0.85);
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.75);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
      padding: 18px;
      backdrop-filter: blur(12px);
    }
    .modal h2 {
      margin: 0 0 8px;
      font-size: 32px;
    }
    .modal p {
      margin: 0 0 16px;
      font-size: 16px;
      color: #525f70;
    }
    .modal .row { justify-content: flex-end; }
    .bar {
      width: min(860px, 100%);
      border-radius: 999px;
      overflow: hidden;
      height: 16px;
      background: #ddd;
    }
    .bar > span { display: block; height: 100%; background: linear-gradient(90deg, #37c1a1, #4ac7c5); }
    #login {
      max-width: 420px;
      margin: 17vh auto 0;
      background: linear-gradient(175deg, rgba(244, 220, 249, 0.55), rgba(213, 226, 255, 0.5));
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 18px;
      padding: 26px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(22px) saturate(130%);
    }
    #login h1 { font-size: 46px; margin: 0 0 8px; text-align: center; }
    #login .auth-sub { margin: 0 0 18px; text-align: center; color: #75829a; font-size: 14px; }
    #login .btn { justify-content: center; border-radius: 12px; min-width: 180px; }
    .hidden { display: none !important; }
    @media (max-width: 980px) {
      body { padding: 10px; }
      .shell { min-height: calc(100vh - 20px); }
      .topbar, main { padding-left: 18px; padding-right: 18px; }
      .flash { margin-left: 18px; margin-right: 18px; }
      .brand { font-size: 28px; }
      .nav button, .sys-toggle { font-size: 15px; padding: 7px 10px; }
      h1 { font-size: 40px; }
      h2 { font-size: 34px; }
      h3 { font-size: 24px; }
      label, input, select, textarea, .btn, table { font-size: 14px; }
      .row { gap: 8px; }
      .drop { width: 100%; }
      .actions .btn { margin-left: 0; }
      .drop-primary { font-size: 16px; }
      td.actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      table.files-table { min-width: 700px; }
      .file-name { max-width: 180px; }
    }
  </style>
</head>
<body>
  <section id="login" aria-labelledby="login-title">
    <h1 id="login-title">Welcome Back</h1>
    <p id="login-subtitle" class="auth-sub">Sign in to your account to continue</p>
    <div class="stack">
      <div>
        <label id="pw-label" for="pw">Passphrase</label>
        <input id="pw" type="password" autocomplete="current-password" placeholder="Enter your passphrase" />
      </div>
      <button class="btn form-submit" id="login-btn" type="button">Sign In</button>
      <p id="login-help" class="small">Authentication uses the shared secret configured on the worker.</p>
    </div>
  </section>

  <div id="app" class="shell hidden">
    <header class="topbar">
      <div class="row" style="gap: 26px;">
        <div class="brand">PicoShare</div>
        <nav class="nav" aria-label="Primary">
          <button type="button" class="nav-upload" data-view="upload" aria-current="page">
            <span id="nav-upload-text">Upload</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 74 74"
              height="34"
              width="34"
              aria-hidden="true"
            >
              <circle stroke-width="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
              <path
                fill="black"
                d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
              ></path>
            </svg>
          </button>
          <button id="nav-files-btn" type="button" class="btn blue small" data-view="files">Files</button>
          <button id="nav-guest-btn" type="button" class="btn blue small" data-view="guestLinks">Guest Links</button>
        </nav>
      </div>
      <div class="top-right">
        <div class="row" style="gap:8px;">
          <button id="lang-toggle" type="button" class="btn blue small">中文</button>
          <button id="system-toggle" class="sys-toggle" type="button" aria-haspopup="menu" aria-expanded="false">
            System ▾
          </button>
        </div>
        <div id="system-menu" class="system-menu" role="menu" aria-label="System pages">
          <button id="menu-system-info" type="button" data-view="systemInfo" role="menuitem">System Information</button>
          <button id="menu-settings" type="button" data-view="settings" role="menuitem">Settings</button>
          <button type="button" id="logout-btn" role="menuitem">Logout</button>
        </div>
      </div>
    </header>

    <div id="flash" class="flash hidden" role="status" aria-live="polite"></div>
    <div id="confirm-backdrop" class="modal-backdrop hidden" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Confirm action</h2>
        <p id="confirm-text">Are you sure?</p>
        <div class="row">
          <button id="confirm-cancel" type="button" class="btn secondary">Cancel</button>
          <button id="confirm-ok" type="button" class="btn danger">Delete</button>
        </div>
      </section>
    </div>
    <div id="file-preview" class="file-preview hidden" aria-hidden="true">
      <div id="file-preview-title" class="file-preview-title"></div>
      <img id="file-preview-image" alt="Image preview" />
    </div>
    <div id="busy-backdrop" class="busy-backdrop hidden" aria-live="polite" aria-busy="true">
      <div class="busy-card">
        <span class="busy-spinner" aria-hidden="true"></span>
        <span id="busy-text">Uploading, please wait...</span>
      </div>
    </div>
    <main id="main" tabindex="-1"></main>
  </div>

  <script>
    (function() {
      var state = {
        pw: localStorage.getItem('ps_pw') || '',
        view: 'upload',
        selectedId: null,
        files: [],
        guestLinks: [],
        settings: { storeForever: true, defaultDays: 30 },
        downloadsUniqueOnly: false,
        lang: localStorage.getItem('ps_lang') === 'zh' ? 'zh' : 'en',
      };

      var I18N = {
        en: {
          login_title: 'Welcome Back',
          login_subtitle: 'Sign in to your account to continue',
          passphrase: 'Passphrase',
          passphrase_placeholder: 'Enter your passphrase',
          sign_in: 'Sign In',
          login_help: 'Authentication uses the shared secret configured on the worker.',
          nav_upload: 'Upload',
          nav_files: 'Files',
          nav_guest_links: 'Guest Links',
          system: 'System',
          system_info: 'System Information',
          settings: 'Settings',
          logout: 'Logout',
          lang_switch: '中文',
          confirm_action: 'Confirm action',
          are_you_sure: 'Are you sure?',
          cancel: 'Cancel',
          delete: 'Delete',
          please_enter_passphrase: 'Please enter the passphrase.',
          auth_failed: 'Authentication failed. Check shared secret.',
          logged_out: 'Logged out.',
          upload: 'Upload',
          drop_choose: 'Drop files here or click to choose',
          supports_drag: 'Supports drag and drop upload',
          no_file_selected: 'No file selected',
          or_paste_here: 'Or paste something here',
          paste_placeholder: 'Paste text content to upload as .txt',
          expiration: 'Expiration',
          day_1: '1 day',
          day_7: '7 days',
          day_30: '30 days',
          day_90: '90 days',
          never: 'Never',
          note_optional: 'Note (optional)',
          note_placeholder: 'For Joe at ExampleCo',
          note_only_you: 'Note is only visible to you',
          upload_success: 'Upload succeeded.',
          select_or_paste_first: 'Select a file or paste text first.',
          files: 'Files',
          filename: 'Filename',
          note: 'Note',
          size: 'Size',
          uploaded: 'Uploaded',
          expires: 'Expires',
          downloads: 'Downloads',
          actions: 'Actions',
          view_file_info: 'View file information',
          edit_file: 'Edit file',
          copy_short_link: 'Copy short link',
          delete_file: 'Delete file',
          delete_file_confirm: 'Delete this file?',
          file_deleted: 'File deleted.',
          link_copied: 'Link copied.',
          clipboard_denied: 'Clipboard permission denied.',
          file_information: 'File Information',
          links: 'Links',
          full_link: 'Full Link',
          short_link: 'Shortlink',
          copy: 'Copy',
          back_to_files: 'Back to files',
          full_link_copied: 'Full link copied.',
          short_link_copied: 'Short link copied.',
          edit_file_title: 'Edit File',
          delete_after_expiration: 'Delete after expiration',
          save: 'Save',
          file_updated: 'File updated.',
          guest_links: 'Guest Links',
          guest_desc_1: 'Guest links allow other users to upload files to this PicoShare server without signing in.',
          guest_desc_2: 'Share a guest link if you want an easy way for someone to share a file with you.',
          create_new_guest_link: 'Create new guest link',
          label: 'Label',
          url_expiration: 'URL expiration',
          file_exp_days: 'File expiration (days)',
          max_upload_size_mb: 'Max upload size (MB)',
          max_uploads: 'Max uploads',
          create_new: 'Create new',
          created: 'Created',
          max_upload_size: 'Max Upload Size',
          copy_guest_link: 'Copy guest link',
          delete_guest_link: 'Delete guest link',
          guest_link_created: 'Guest link created.',
          guest_link_deleted: 'Guest link deleted.',
          guest_link_copied: 'Guest link copied.',
          delete_guest_confirm: 'Delete this guest link?',
          default_value: 'Default',
          unlimited: 'Unlimited',
          days_unit: 'days',
          system_information: 'System Information',
          picoshare_usage: 'PicoShare Usage',
          upload_data: 'Upload data',
          guest_links_count: 'Guest links',
          total_downloads: 'Total downloads',
          version: 'Version',
          built_at: 'Built at',
          default_file_expiration: 'Default File Expiration',
          store_files_forever: 'Store files forever',
          days: 'Days',
          settings_saved: 'Settings saved.',
          downloads_title: 'Downloads',
          unique_ips_only: 'Unique IPs only',
          download: 'Download',
          time: 'Time',
          downloader_ip: 'Downloader IP',
          browser: 'Browser',
          platform: 'Platform',
          close: 'Close',
          no_downloads_yet: 'No downloads yet',
          history: 'History',
          session_expired: 'Session expired. Please sign in again.',
          uploading_wait: 'Uploading, please wait...',
          selected_prefix: 'Selected',
          none: 'None',
          uploaded_by: 'Uploaded by',
          you: 'You',
          unknown_file: 'Unknown file',
          not_available: 'N/A',
        },
        zh: {
          login_title: '欢迎回来',
          login_subtitle: '登录后继续使用',
          passphrase: '访问口令',
          passphrase_placeholder: '请输入访问口令',
          sign_in: '登录',
          login_help: '认证使用 Worker 配置的共享密钥。',
          nav_upload: '上传',
          nav_files: '文件',
          nav_guest_links: '访客链接',
          system: '系统',
          system_info: '系统信息',
          settings: '设置',
          logout: '退出登录',
          lang_switch: 'EN',
          confirm_action: '确认操作',
          are_you_sure: '确定继续吗？',
          cancel: '取消',
          delete: '删除',
          please_enter_passphrase: '请输入访问口令。',
          auth_failed: '认证失败，请检查共享密钥。',
          logged_out: '已退出登录。',
          upload: '上传',
          drop_choose: '拖拽文件到这里，或点击选择',
          supports_drag: '支持拖拽上传',
          no_file_selected: '未选择文件',
          or_paste_here: '或者在这里粘贴内容',
          paste_placeholder: '粘贴文本后将保存为 .txt 文件',
          expiration: '过期时间',
          day_1: '1 天',
          day_7: '7 天',
          day_30: '30 天',
          day_90: '90 天',
          never: '永不过期',
          note_optional: '备注（可选）',
          note_placeholder: '例如：给某同事',
          note_only_you: '备注仅自己可见',
          upload_success: '上传成功。',
          select_or_paste_first: '请先选择文件或粘贴内容。',
          files: '文件',
          filename: '文件名',
          note: '备注',
          size: '大小',
          uploaded: '上传时间',
          expires: '过期时间',
          downloads: '下载次数',
          actions: '操作',
          view_file_info: '查看文件信息',
          edit_file: '编辑文件',
          copy_short_link: '复制短链接',
          delete_file: '删除文件',
          delete_file_confirm: '确认删除这个文件吗？',
          file_deleted: '文件已删除。',
          link_copied: '链接已复制。',
          clipboard_denied: '无法访问剪贴板权限。',
          file_information: '文件信息',
          links: '链接',
          full_link: '完整链接',
          short_link: '短链接',
          copy: '复制',
          back_to_files: '返回文件列表',
          full_link_copied: '完整链接已复制。',
          short_link_copied: '短链接已复制。',
          edit_file_title: '编辑文件',
          delete_after_expiration: '到期后自动删除',
          save: '保存',
          file_updated: '文件已更新。',
          guest_links: '访客链接',
          guest_desc_1: '访客链接允许他人在不登录的情况下上传文件到当前 PicoShare 服务。',
          guest_desc_2: '你可以分享访客链接，让他人更方便地向你发送文件。',
          create_new_guest_link: '创建新访客链接',
          label: '标签',
          url_expiration: '链接过期时间',
          file_exp_days: '文件保留天数',
          max_upload_size_mb: '最大上传大小 (MB)',
          max_uploads: '最多上传次数',
          create_new: '创建',
          created: '创建时间',
          max_upload_size: '最大上传大小',
          copy_guest_link: '复制访客链接',
          delete_guest_link: '删除访客链接',
          guest_link_created: '访客链接已创建。',
          guest_link_deleted: '访客链接已删除。',
          guest_link_copied: '访客链接已复制。',
          delete_guest_confirm: '确认删除这个访客链接吗？',
          default_value: '默认',
          unlimited: '不限',
          days_unit: '天',
          system_information: '系统信息',
          picoshare_usage: 'PicoShare 使用情况',
          upload_data: '上传数据',
          guest_links_count: '访客链接数量',
          total_downloads: '总下载次数',
          version: '版本',
          built_at: '构建时间',
          default_file_expiration: '默认文件过期策略',
          store_files_forever: '永久保存文件',
          days: '天',
          settings_saved: '设置已保存。',
          downloads_title: '下载记录',
          unique_ips_only: '仅显示唯一 IP',
          download: '序号',
          time: '时间',
          downloader_ip: '下载 IP',
          browser: '浏览器',
          platform: '平台',
          close: '关闭',
          no_downloads_yet: '暂无下载记录',
          history: '历史',
          session_expired: '会话已过期，请重新登录。',
          uploading_wait: '正在上传，请稍候...',
          selected_prefix: '已选择',
          none: '无',
          uploaded_by: '上传者',
          you: '你',
          unknown_file: '未知文件',
          not_available: '不可用',
        },
      };

      function t(key) {
        var langPack = I18N[state.lang] || I18N.en;
        return langPack[key] || I18N.en[key] || key;
      }

      var loginEl = document.getElementById('login');
      var appEl = document.getElementById('app');
      var mainEl = document.getElementById('main');
      var flashEl = document.getElementById('flash');
      var flashTimer = null;
      var pwEl = document.getElementById('pw');
      var loginBtn = document.getElementById('login-btn');
      var systemToggle = document.getElementById('system-toggle');
      var systemMenu = document.getElementById('system-menu');
      var confirmBackdrop = document.getElementById('confirm-backdrop');
      var confirmText = document.getElementById('confirm-text');
      var confirmOk = document.getElementById('confirm-ok');
      var confirmCancel = document.getElementById('confirm-cancel');
      var filePreview = document.getElementById('file-preview');
      var filePreviewTitle = document.getElementById('file-preview-title');
      var filePreviewImage = document.getElementById('file-preview-image');
      var busyBackdrop = document.getElementById('busy-backdrop');
      var busyText = document.getElementById('busy-text');
      var langToggle = document.getElementById('lang-toggle');

      function applyStaticTranslations() {
        document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
        document.getElementById('login-title').textContent = t('login_title');
        document.getElementById('login-subtitle').textContent = t('login_subtitle');
        document.getElementById('pw-label').textContent = t('passphrase');
        pwEl.setAttribute('placeholder', t('passphrase_placeholder'));
        loginBtn.textContent = t('sign_in');
        document.getElementById('login-help').textContent = t('login_help');
        document.getElementById('nav-upload-text').textContent = t('nav_upload');
        document.getElementById('nav-files-btn').textContent = t('nav_files');
        document.getElementById('nav-guest-btn').textContent = t('nav_guest_links');
        systemToggle.textContent = t('system') + ' ▾';
        document.getElementById('menu-system-info').textContent = t('system_info');
        document.getElementById('menu-settings').textContent = t('settings');
        document.getElementById('logout-btn').textContent = t('logout');
        document.getElementById('confirm-title').textContent = t('confirm_action');
        document.getElementById('confirm-text').textContent = t('are_you_sure');
        confirmCancel.textContent = t('cancel');
        if (confirmOk.textContent === 'Delete' || confirmOk.textContent === '删除') {
          confirmOk.textContent = t('delete');
        }
        langToggle.textContent = t('lang_switch');
      }

      function switchLang() {
        state.lang = state.lang === 'en' ? 'zh' : 'en';
        localStorage.setItem('ps_lang', state.lang);
        applyStaticTranslations();
        render();
      }

      function setBusy(isBusy, text) {
        busyText.textContent = text || t('uploading_wait');
        if (isBusy) busyBackdrop.classList.remove('hidden');
        else busyBackdrop.classList.add('hidden');
      }

      function setFlash(text, isError) {
        if (flashTimer) {
          clearTimeout(flashTimer);
          flashTimer = null;
        }
        if (!text) {
          flashEl.className = 'flash hidden';
          flashEl.textContent = '';
          return;
        }
        flashEl.className = 'flash ' + (isError ? 'err' : 'ok');
        flashEl.textContent = text;
        flashTimer = setTimeout(function() {
          flashEl.className = 'flash hidden';
          flashEl.textContent = '';
        }, isError ? 6000 : 3500);
      }

      function confirmAction(message, dangerText) {
        return new Promise(function(resolve) {
          confirmText.textContent = message;
          confirmOk.textContent = dangerText || t('confirm_action');
          confirmBackdrop.classList.remove('hidden');
          confirmOk.focus();

          function cleanup(value) {
            confirmBackdrop.classList.add('hidden');
            confirmOk.removeEventListener('click', onOk);
            confirmCancel.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKeydown);
            resolve(value);
          }

          function onOk() { cleanup(true); }
          function onCancel() { cleanup(false); }
          function onKeydown(evt) {
            if (evt.key === 'Escape') cleanup(false);
          }

          confirmOk.addEventListener('click', onOk);
          confirmCancel.addEventListener('click', onCancel);
          document.addEventListener('keydown', onKeydown);
        });
      }

      function formatSize(bytes) {
        var n = Number(bytes || 0);
        if (!Number.isFinite(n) || n <= 0) return '0 B';
        var units = ['B', 'kB', 'MB', 'GB', 'TB'];
        var i = 0;
        while (n >= 1024 && i < units.length - 1) {
          n /= 1024;
          i += 1;
        }
        return n.toFixed(i === 0 ? 0 : 2) + ' ' + units[i];
      }

      function formatDate(iso) {
        if (!iso) return t('never');
        var d = new Date(iso);
        if (Number.isNaN(d.getTime())) return t('never');
        return d.toISOString().slice(0, 10);
      }

      function formatDateTime(iso) {
        if (!iso) return '-';
        var d = new Date(iso);
        if (Number.isNaN(d.getTime())) return String(iso);
        var p = function(v) { return String(v).padStart(2, '0'); };
        var offset = -d.getTimezoneOffset();
        var sign = offset >= 0 ? '+' : '-';
        var oh = p(Math.floor(Math.abs(offset) / 60));
        var om = p(Math.abs(offset) % 60);
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
          ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) +
          ' ' + sign + oh + om;
      }

      function parseUa(uaRaw) {
        var ua = String(uaRaw || '').toLowerCase();
        var browser = 'Unknown';
        var platform = '';
        if (ua.includes('edg/')) browser = 'Edge';
        else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Chrome';
        else if (ua.includes('firefox/')) browser = 'Firefox';
        else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
        else if (ua.includes('wget/')) browser = 'Wget';
        else if (ua.includes('curl/')) browser = 'curl';

        if (ua.includes('android')) platform = 'Android';
        else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) platform = 'iOS';
        else if (ua.includes('windows')) platform = 'Windows';
        else if (ua.includes('mac os') || ua.includes('macintosh')) platform = 'macOS';
        else if (ua.includes('linux')) platform = 'Linux';

        return { browser: browser, platform: platform };
      }

      function fileExtension(filename) {
        var idx = filename.lastIndexOf('.');
        if (idx <= 0 || idx === filename.length - 1) return '';
        return filename.slice(idx + 1).toLowerCase();
      }

      function fileTypeInfo(file) {
        var ct = String(file.content_type || '').toLowerCase();
        var ext = fileExtension(String(file.filename || ''));

        if (ct.indexOf('image/') === 0 || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext)) {
          return { icon: 'IMG', typeClass: 'type-image', label: 'Image' };
        }
        if (ct === 'application/pdf' || ext === 'pdf') {
          return { icon: 'PDF', typeClass: 'type-pdf', label: 'PDF' };
        }
        if (ct.indexOf('text/') === 0 || ['txt', 'md', 'log', 'csv'].includes(ext)) {
          return { icon: 'TXT', typeClass: 'type-text', label: 'Text' };
        }
        if (ct.indexOf('video/') === 0 || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
          return { icon: 'VID', typeClass: 'type-video', label: 'Video' };
        }
        if (ct.indexOf('audio/') === 0 || ['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext)) {
          return { icon: 'AUD', typeClass: 'type-audio', label: 'Audio' };
        }
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
          return { icon: 'ZIP', typeClass: 'type-archive', label: 'Archive' };
        }
        if (['js', 'ts', 'tsx', 'jsx', 'json', 'yaml', 'yml', 'html', 'css', 'sh'].includes(ext)) {
          return { icon: 'CODE', typeClass: 'type-code', label: 'Code' };
        }
        return { icon: 'FILE', typeClass: 'type-other', label: 'File' };
      }

      function isImageFile(file) {
        return fileTypeInfo(file).typeClass === 'type-image';
      }

      function movePreview(evt) {
        var x = evt.clientX + 18;
        var y = evt.clientY + 18;
        var w = 300;
        var h = 230;
        if (x + w > window.innerWidth - 8) x = Math.max(8, evt.clientX - w - 18);
        if (y + h > window.innerHeight - 8) y = Math.max(8, evt.clientY - h - 18);
        filePreview.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      }

      function hidePreview() {
        filePreview.classList.add('hidden');
        filePreviewImage.removeAttribute('src');
      }

      function showPreview(file, evt) {
        if (!isImageFile(file)) return;
        filePreviewTitle.textContent = file.filename;
        filePreviewImage.src = '/_preview/' + encodeURIComponent(file.id);
        filePreview.classList.remove('hidden');
        movePreview(evt);
      }

      function authHeaders(extra) {
        var h = Object.assign({}, extra || {});
        h.Authorization = state.pw;
        return h;
      }

      async function api(path, options) {
        var res = await fetch(path, Object.assign({}, options || {}, {
          headers: authHeaders((options && options.headers) || {}),
        }));
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          var txt = await res.text();
          throw new Error(txt || ('Request failed: ' + res.status));
        }
        var ct = res.headers.get('content-type') || '';
        if (ct.indexOf('application/json') >= 0) return res.json();
        return res.text();
      }

      function el(tag, attrs, children) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function(k) {
          var v = attrs[k];
          if (k === 'class') node.className = v;
          else if (k === 'text') node.textContent = v;
          else if (k === 'html') node.innerHTML = v;
          else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
          else if (v !== undefined && v !== null) node.setAttribute(k, String(v));
        });
        (children || []).forEach(function(child) {
          if (typeof child === 'string') node.appendChild(document.createTextNode(child));
          else if (child) node.appendChild(child);
        });
        return node;
      }

      function updateActiveNav() {
        document.querySelectorAll('.nav [data-view]').forEach(function(btn) {
          if (btn.getAttribute('data-view') === state.view) btn.setAttribute('aria-current', 'page');
          else btn.removeAttribute('aria-current');
        });
      }

      function closeSystemMenu() {
        systemMenu.style.display = 'none';
        systemToggle.classList.remove('active');
        systemToggle.setAttribute('aria-expanded', 'false');
      }

      function openSystemMenu() {
        systemMenu.style.display = 'block';
        systemToggle.classList.add('active');
        systemToggle.setAttribute('aria-expanded', 'true');
      }

      async function login() {
        state.pw = (pwEl.value || state.pw || '').trim();
        if (!state.pw) {
          setFlash(t('please_enter_passphrase'), true);
          return;
        }
        try {
          await api('/api/entries');
          localStorage.setItem('ps_pw', state.pw);
          setFlash('', false);
          loginEl.classList.add('hidden');
          appEl.classList.remove('hidden');
          await loadInitialData();
          await render();
        } catch (err) {
          setFlash(t('auth_failed'), true);
        }
      }

      function logout() {
        localStorage.removeItem('ps_pw');
        state.pw = '';
        state.selectedId = null;
        state.view = 'upload';
        closeSystemMenu();
        appEl.classList.add('hidden');
        loginEl.classList.remove('hidden');
        setFlash(t('logged_out'), false);
      }

      async function loadInitialData() {
        var loaded = await Promise.all([api('/api/entries'), api('/api/guest-links'), api('/api/settings')]);
        state.files = loaded[0];
        state.guestLinks = loaded[1];
        state.settings = {
          storeForever: !!loaded[2].storeForever,
          defaultDays: Number(loaded[2].defaultDays || 30),
        };
      }

      async function refreshFiles() {
        state.files = await api('/api/entries');
      }

      async function refreshGuestLinks() {
        state.guestLinks = await api('/api/guest-links');
      }

      function createUploadView() {
        var form = el('form', { class: 'upload-grid' });

        var fileInput = el('input', { type: 'file', id: 'upload-file', 'aria-label': 'Choose file', class: 'hidden' });
        var dropFileName = el('div', { class: 'drop-file', text: t('no_file_selected') });
        var drop = el('button', { type: 'button', class: 'drop', onclick: function() { fileInput.click(); } }, [
          el('div', { class: 'drop-primary', text: t('drop_choose') }),
          el('div', { class: 'drop-secondary', text: t('supports_drag') }),
          dropFileName,
        ]);
        var selectedFile = null;

        function setSelectedFile(file) {
          selectedFile = file || null;
          dropFileName.textContent = selectedFile ? (t('selected_prefix') + ': ' + selectedFile.name) : t('no_file_selected');
        }

        fileInput.addEventListener('change', function() {
          setSelectedFile(fileInput.files && fileInput.files[0] ? fileInput.files[0] : null);
        });

        ['dragenter', 'dragover'].forEach(function(type) {
          drop.addEventListener(type, function(evt) {
            evt.preventDefault();
            drop.classList.add('dragover');
          });
        });
        ['dragleave', 'dragend'].forEach(function(type) {
          drop.addEventListener(type, function(evt) {
            evt.preventDefault();
            drop.classList.remove('dragover');
          });
        });
        drop.addEventListener('drop', function(evt) {
          evt.preventDefault();
          drop.classList.remove('dragover');
          var files = evt.dataTransfer && evt.dataTransfer.files;
          if (files && files.length > 0) {
            setSelectedFile(files[0]);
          }
        });

        var pasteLabel = el('label', { for: 'paste', text: t('or_paste_here') });
        var paste = el('textarea', { id: 'paste', placeholder: t('paste_placeholder') });

        var expLabel = el('label', { for: 'exp-select', text: t('expiration') });
        var expSelect = el('select', { id: 'exp-select' }, [
          el('option', { value: '0', text: t('never') }),
          el('option', { value: '1', text: t('day_1') }),
          el('option', { value: '7', text: t('day_7') }),
          el('option', { value: '30', text: t('day_30') }),
          el('option', { value: '90', text: t('day_90') }),
        ]);
        if (!state.settings.storeForever) {
          expSelect.value = String(Math.max(1, state.settings.defaultDays || 30));
        }

        var noteLabel = el('label', { for: 'note', text: t('note_optional') });
        var note = el('input', { id: 'note', type: 'text', placeholder: t('note_placeholder') });
        var hint = el('div', { class: 'small', text: t('note_only_you') });

        form.appendChild(el('h1', { text: t('upload') }));
        form.appendChild(drop);
        form.appendChild(fileInput);
        form.appendChild(el('div', {}, [pasteLabel, paste]));
        form.appendChild(el('div', {}, [expLabel, expSelect]));
        form.appendChild(el('div', {}, [noteLabel, note, hint]));
        form.appendChild(
          el('div', { class: 'submit-row' }, [
            el('button', { class: 'btn neon form-submit', type: 'submit', text: t('upload') }),
          ]),
        );
        var isUploading = false;

        form.addEventListener('submit', async function(evt) {
          evt.preventDefault();
          if (isUploading) return;
          var hasFile = selectedFile || (fileInput.files && fileInput.files[0]);
          var pastedText = paste.value.trim();
          if (!hasFile && !pastedText) {
            setFlash(t('select_or_paste_first'), true);
            return;
          }

          isUploading = true;
          setBusy(true, t('uploading_wait'));
          var fd = new FormData();
          if (hasFile) fd.append('file', hasFile);
          if (pastedText) fd.append('pastedText', pastedText);
          fd.append('note', note.value.trim());
          fd.append('expirationDays', expSelect.value);

          try {
            await api('/api/entry', { method: 'POST', body: fd });
            setFlash(t('upload_success'), false);
            setSelectedFile(null);
            fileInput.value = '';
            paste.value = '';
            note.value = '';
            await refreshFiles();
            state.view = 'files';
            await render();
          } catch (err) {
            setFlash(String(err.message || err), true);
          } finally {
            isUploading = false;
            setBusy(false);
          }
        });

        return form;
      }

      function createFilesView() {
        var root = el('section', { class: 'stack stack-wide' });
        root.appendChild(el('h1', { text: t('files') }));

        var tableWrap = el('div', { class: 'table-wrap' });
        var table = el('table', { class: 'files-table' });
        var thead = el('thead');
        var headRow = el('tr');
        [t('filename'), t('note'), t('size'), t('uploaded'), t('expires'), t('downloads'), t('actions')].forEach(function(title) {
          headRow.appendChild(el('th', { scope: 'col', text: title }));
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        var tbody = el('tbody');
        state.files.forEach(function(file) {
          var tr = el('tr');
          tr.addEventListener('mouseenter', function(evt) { showPreview(file, evt); });
          tr.addEventListener('mousemove', function(evt) { if (!filePreview.classList.contains('hidden')) movePreview(evt); });
          tr.addEventListener('mouseleave', hidePreview);

          var typeInfo = fileTypeInfo(file);
          var filenameCell = el('td');
          filenameCell.appendChild(
            el('span', { class: 'file-cell' }, [
              el('span', {
                class: 'file-icon ' + typeInfo.typeClass,
                text: typeInfo.icon,
                title: typeInfo.label,
                'aria-label': typeInfo.label + ' file',
              }),
              el('span', { class: 'file-name', text: file.filename }),
            ]),
          );

          tr.appendChild(filenameCell);
          tr.appendChild(el('td', { text: file.note || '' }));
          tr.appendChild(el('td', { text: formatSize(file.size) }));
          tr.appendChild(el('td', { text: formatDate(file.upload_time) }));
          tr.appendChild(el('td', { text: formatDate(file.expiration_time) }));
          tr.appendChild(
            el('td', {}, [
              el('button', {
                type: 'button',
                class: 'btn blue small',
                text: String(file.download_count || 0),
                'aria-label': t('history'),
                onclick: function() {
                  state.selectedId = file.id;
                  state.downloadsUniqueOnly = false;
                  state.view = 'downloads';
                  render();
                },
              }),
            ]),
          );

          var actions = el('td', { class: 'actions' });
          actions.appendChild(el('button', {
            type: 'button', class: 'btn blue small', text: 'i', 'aria-label': t('view_file_info'), onclick: function() {
              state.selectedId = file.id;
              state.view = 'fileInfo';
              render();
            }
          }));
          actions.appendChild(el('button', {
            type: 'button', class: 'btn secondary small', text: '✎', 'aria-label': t('edit_file'), onclick: function() {
              state.selectedId = file.id;
              state.view = 'fileEdit';
              render();
            }
          }));
          actions.appendChild(el('button', {
            type: 'button', class: 'btn blue small', text: '⧉', 'aria-label': t('copy_short_link'), onclick: async function() {
              try {
                await navigator.clipboard.writeText(location.origin + '/-' + file.id);
                setFlash(t('link_copied'), false);
              } catch {
                setFlash(t('clipboard_denied'), true);
              }
            }
          }));
          actions.appendChild(el('button', {
            type: 'button', class: 'btn danger small', text: t('delete'), 'aria-label': t('delete_file'), onclick: async function() {
              if (!(await confirmAction(t('delete_file_confirm'), t('delete')))) return;
              try {
                await api('/api/entry/' + encodeURIComponent(file.id), { method: 'DELETE' });
                await refreshFiles();
                setFlash(t('file_deleted'), false);
                render();
              } catch (err) {
                setFlash(String(err.message || err), true);
              }
            }
          }));
          tr.appendChild(actions);
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableWrap.appendChild(table);
        root.appendChild(tableWrap);
        return root;
      }

      async function createFileInfoView() {
        var id = state.selectedId;
        var data = await api('/api/entry/' + encodeURIComponent(id));
        var root = el('section', { class: 'stack' });
        root.appendChild(el('h1', { text: t('file_information') }));
        function kv(label, value) {
          var block = el('div');
          block.appendChild(el('strong', { text: label }));
          block.appendChild(el('br'));
          block.appendChild(document.createTextNode(value));
          return block;
        }

        var fullLink = location.origin + '/-' + data.id + '/' + data.filename;
        var shortLink = location.origin + '/-' + data.id;

        var linksPanel = el('div', { class: 'panel stack' }, [
          el('h3', { text: t('links') }),
          el('div', { class: 'row' }, [
            el('a', { href: fullLink, target: '_blank', rel: 'noreferrer', text: fullLink }),
            el('button', { type: 'button', class: 'btn blue small', text: t('copy'), onclick: function() { navigator.clipboard.writeText(fullLink); setFlash(t('full_link_copied'), false); } })
          ]),
          el('div', { class: 'small', text: t('full_link') }),
          el('div', { class: 'row' }, [
            el('a', { href: shortLink, target: '_blank', rel: 'noreferrer', text: shortLink }),
            el('button', { type: 'button', class: 'btn blue small', text: t('copy'), onclick: function() { navigator.clipboard.writeText(shortLink); setFlash(t('short_link_copied'), false); } })
          ]),
          el('div', { class: 'small', text: t('short_link') }),
        ]);

        root.appendChild(linksPanel);

        var info = el('div', { class: 'stack' });
        info.appendChild(kv(t('filename'), data.filename));
        info.appendChild(kv(t('size'), formatSize(data.size)));
        info.appendChild(kv(t('expires'), formatDate(data.expiration_time)));
        var downloadsWrap = el('div');
        downloadsWrap.appendChild(el('strong', { text: t('downloads') }));
        downloadsWrap.appendChild(el('br'));
        var dlRow = el('span', { class: 'row' }, [
          document.createTextNode(String(data.download_count || 0)),
          el('button', {
            type: 'button',
            class: 'btn blue small',
            text: t('history'),
            onclick: function() {
              state.selectedId = data.id;
              state.downloadsUniqueOnly = false;
              state.view = 'downloads';
              render();
            },
          }),
        ]);
        downloadsWrap.appendChild(dlRow);
        info.appendChild(downloadsWrap);
        info.appendChild(kv(t('note'), data.note || t('none')));
        info.appendChild(kv(t('uploaded_by'), t('you')));
        root.appendChild(info);

        root.appendChild(el('div', { class: 'submit-row' }, [
          el('button', {
            type: 'button', class: 'btn form-submit tight', text: t('back_to_files'), onclick: function() {
              state.view = 'files';
              render();
            }
          }),
        ]));

        return root;
      }

      async function createDownloadsView() {
        var id = state.selectedId;
        var file = state.files.find(function(f) { return f.id === id; });
        if (!file) file = await api('/api/entry/' + encodeURIComponent(id));
        var res = await api('/api/entry/' + encodeURIComponent(id) + '/downloads?uniqueIps=' + (state.downloadsUniqueOnly ? '1' : '0'));
        var rows = res.events || [];

        var root = el('section', { class: 'stack stack-wide' });
        root.appendChild(el('h1', { text: t('downloads_title') }));
        root.appendChild(el('h3', { text: file.filename || t('unknown_file') }));

        var uniqueToggle = el('input', { id: 'downloads-unique', type: 'checkbox' });
        if (state.downloadsUniqueOnly) uniqueToggle.checked = true;
        uniqueToggle.addEventListener('change', function() {
          state.downloadsUniqueOnly = uniqueToggle.checked;
          render();
        });
        root.appendChild(el('div', { class: 'check-row' }, [
          uniqueToggle,
          el('label', { for: 'downloads-unique', text: t('unique_ips_only') }),
        ]));

        var tableWrap = el('div', { class: 'table-wrap' });
        var table = el('table', { class: 'files-table' });
        var thead = el('thead');
        var hr = el('tr');
        [t('download'), t('time'), t('downloader_ip'), t('browser'), t('platform')].forEach(function(h) {
          hr.appendChild(el('th', { scope: 'col', text: h }));
        });
        thead.appendChild(hr);
        table.appendChild(thead);
        var tbody = el('tbody');
        var total = Number(res.total || rows.length);
        rows.forEach(function(r, idx) {
          var ua = parseUa(r.user_agent);
          var tr = el('tr');
          tr.appendChild(el('td', { text: String(Math.max(1, total - idx)) }));
          tr.appendChild(el('td', { text: formatDateTime(r.downloaded_at) }));
          tr.appendChild(el('td', { text: r.ip || '-' }));
          tr.appendChild(el('td', { text: ua.browser || '-' }));
          tr.appendChild(el('td', { text: ua.platform || '' }));
          tbody.appendChild(tr);
        });
        if (rows.length === 0) {
          var empty = el('tr');
          empty.appendChild(el('td', { text: t('no_downloads_yet'), colspan: '5' }));
          tbody.appendChild(empty);
        }
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        root.appendChild(tableWrap);
        root.appendChild(el('div', { class: 'submit-row' }, [
          el('button', {
            type: 'button',
            class: 'btn form-submit tight',
            text: t('close'),
            onclick: function() {
              state.view = 'files';
              render();
            },
          }),
        ]));
        return root;
      }

      async function createFileEditView() {
        var id = state.selectedId;
        var data = await api('/api/entry/' + encodeURIComponent(id));
        var root = el('section', { class: 'stack' });
        root.appendChild(el('h1', { text: t('edit_file_title') }));

        var form = el('form', { class: 'stack' });
        var filename = el('input', { id: 'edit-filename', type: 'text', value: data.filename });
        var deleteAfter = el('input', { id: 'edit-delete-after', type: 'checkbox' });
        var exp = el('select', { id: 'edit-exp' }, [
          el('option', { value: '0', text: t('never') }),
          el('option', { value: '1', text: t('day_1') }),
          el('option', { value: '7', text: t('day_7') }),
          el('option', { value: '30', text: t('day_30') }),
          el('option', { value: '90', text: t('day_90') }),
        ]);
        if (data.expiration_time) {
          var daysLeft = Math.max(1, Math.ceil((new Date(data.expiration_time).getTime() - Date.now()) / (24 * 3600 * 1000)));
          exp.value = String(daysLeft > 90 ? 90 : daysLeft);
          deleteAfter.checked = true;
        }

        var note = el('input', { id: 'edit-note', type: 'text', value: data.note || '' });

        form.appendChild(el('div', {}, [el('label', { for: 'edit-filename', text: t('filename') }), filename]));
        form.appendChild(el('div', {}, [el('label', { for: 'edit-exp', text: t('expiration') })]));
        form.appendChild(el('div', { class: 'check-row' }, [
          deleteAfter,
          el('label', { for: 'edit-delete-after', text: t('delete_after_expiration') })
        ]));
        form.appendChild(exp);
        form.appendChild(el('div', {}, [el('label', { for: 'edit-note', text: t('note') }), note, el('div', { class: 'small', text: t('note_only_you') })]));

        var actions = el('div', { class: 'row', style: 'justify-content: space-between;' });
        actions.appendChild(el('button', {
          type: 'button', class: 'btn danger', text: t('delete'), onclick: async function() {
            if (!(await confirmAction(t('delete_file_confirm'), t('delete')))) return;
            await api('/api/entry/' + encodeURIComponent(id), { method: 'DELETE' });
            await refreshFiles();
            setFlash(t('file_deleted'), false);
            state.view = 'files';
            render();
          }
        }));

        var right = el('div', { class: 'row' });
        right.appendChild(el('button', {
          type: 'button', class: 'btn form-submit', text: t('cancel'), onclick: function() {
            state.view = 'files';
            render();
          }
        }));
        right.appendChild(el('button', { type: 'submit', class: 'btn form-submit', text: t('save') }));
        actions.appendChild(right);

        form.appendChild(actions);
        form.addEventListener('submit', async function(evt) {
          evt.preventDefault();
          var payload = {
            filename: filename.value.trim(),
            note: note.value.trim(),
            deleteAfterExpiration: deleteAfter.checked,
            expirationDays: deleteAfter.checked ? Number(exp.value || 0) : 0,
          };
          await api('/api/entry/' + encodeURIComponent(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          await refreshFiles();
          setFlash(t('file_updated'), false);
          state.view = 'files';
          render();
        });

        root.appendChild(form);
        return root;
      }

      function createGuestLinksView() {
        var root = el('section', { class: 'stack' });
        root.appendChild(el('h1', { text: t('guest_links') }));
        root.appendChild(el('div', { class: 'note-box' }, [
          t('guest_desc_1'),
          el('br'),
          el('br'),
          t('guest_desc_2')
        ]));

        var form = el('form', { class: 'panel stack' });
        form.appendChild(el('h3', { text: t('create_new_guest_link') }));
        var label = el('input', { id: 'gl-label', type: 'text', placeholder: t('note_optional') });
        var urlExpires = el('input', { id: 'gl-url-exp', type: 'date' });
        var fileLife = el('input', { id: 'gl-file-life', type: 'number', min: '1', placeholder: t('file_exp_days') });
        var maxSizeMb = el('input', { id: 'gl-max-size', type: 'number', min: '1', placeholder: t('max_upload_size_mb') });
        var maxUploads = el('input', { id: 'gl-max-up', type: 'number', min: '1', placeholder: t('max_uploads') });

        [
          [t('label'), label],
          [t('url_expiration'), urlExpires],
          [t('file_exp_days'), fileLife],
          [t('max_upload_size_mb'), maxSizeMb],
          [t('max_uploads'), maxUploads],
        ].forEach(function(tuple) {
          var wrap = el('div');
          wrap.appendChild(el('label', { text: tuple[0] }));
          wrap.appendChild(tuple[1]);
          form.appendChild(wrap);
        });

        form.appendChild(
          el('div', { class: 'submit-row' }, [
            el('button', { type: 'submit', class: 'btn form-submit', text: t('create_new') }),
          ]),
        );
        form.addEventListener('submit', async function(evt) {
          evt.preventDefault();
          var payload = {
            label: label.value.trim() || null,
            url_expires: urlExpires.value ? new Date(urlExpires.value + 'T00:00:00.000Z').toISOString() : null,
            max_file_lifetime_days: fileLife.value ? Number(fileLife.value) : null,
            max_file_bytes: maxSizeMb.value ? Number(maxSizeMb.value) * 1024 * 1024 : null,
            max_file_uploads: maxUploads.value ? Number(maxUploads.value) : null,
          };
          await api('/api/guest-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          await refreshGuestLinks();
          setFlash(t('guest_link_created'), false);
          render();
        });
        root.appendChild(form);

        var table = el('table');
        var thead = el('thead');
        var hr = el('tr');
        [t('label'), t('created'), t('url_expiration'), t('file_exp_days'), t('max_upload_size'), t('max_uploads'), t('actions')].forEach(function(h) {
          hr.appendChild(el('th', { scope: 'col', text: h }));
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = el('tbody');
        state.guestLinks.forEach(function(gl) {
          var tr = el('tr');
          tr.appendChild(el('td', { text: gl.label || gl.id }));
          tr.appendChild(el('td', { text: formatDate(gl.created_time) }));
          tr.appendChild(el('td', { text: formatDate(gl.url_expires) }));
          tr.appendChild(el('td', { text: gl.max_file_lifetime_days ? (gl.max_file_lifetime_days + ' ' + t('days_unit')) : t('default_value') }));
          tr.appendChild(el('td', { text: gl.max_file_bytes ? formatSize(gl.max_file_bytes) : t('unlimited') }));
          tr.appendChild(el('td', { text: String(gl.upload_count || 0) + (gl.max_file_uploads ? (' / ' + gl.max_file_uploads) : '') }));
          var actions = el('td', { class: 'actions' });
          actions.appendChild(el('button', {
            type: 'button',
            class: 'btn blue small',
            text: t('copy'),
            'aria-label': t('copy_guest_link'),
            onclick: function() {
              navigator.clipboard.writeText(location.origin + '/guest/' + gl.id);
              setFlash(t('guest_link_copied'), false);
            }
          }));
          actions.appendChild(el('button', {
            type: 'button',
            class: 'btn danger small',
            text: t('delete'),
            'aria-label': t('delete_guest_link'),
            onclick: async function() {
              if (!(await confirmAction(t('delete_guest_confirm'), t('delete')))) return;
              await api('/api/guest-links/' + encodeURIComponent(gl.id), { method: 'DELETE' });
              await refreshGuestLinks();
              setFlash(t('guest_link_deleted'), false);
              render();
            }
          }));
          tr.appendChild(actions);
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        root.appendChild(table);

        return root;
      }

      async function createSystemInfoView() {
        var info = await api('/api/system-info');
        function liStrong(label, value, indent) {
          var li = el('li');
          if (indent) li.style.paddingLeft = '20px';
          li.appendChild(el('strong', { text: label + ': ' }));
          li.appendChild(document.createTextNode(value));
          return li;
        }
        var root = el('section', { class: 'stack' });
        root.appendChild(el('h1', { text: t('system_information') }));
        root.appendChild(el('h2', { text: t('picoshare_usage') }));

        var list = el('ul', { style: 'font-size: 30px; line-height: 1.7;' });
        list.appendChild(liStrong(t('upload_data'), formatSize(info.upload_data_bytes || 0)));
        list.appendChild(liStrong(t('files'), String(info.db_entry_count || 0)));
        list.appendChild(liStrong(t('guest_links_count'), String(info.db_guest_link_count || 0)));
        list.appendChild(liStrong(t('total_downloads'), String(info.download_count || 0)));
        root.appendChild(list);

        root.appendChild(el('h2', { text: 'PicoShare ' + t('version') }));
        var vList = el('ul', { style: 'font-size: 30px; line-height: 1.7;' });
        vList.appendChild(liStrong(t('version'), '1.0.0-ts'));
        vList.appendChild(liStrong(t('built_at'), t('not_available')));
        root.appendChild(vList);

        return root;
      }

      function createSettingsView() {
        var root = el('section', { class: 'stack stack-wide' });
        root.appendChild(el('h1', { text: t('settings') }));

        var form = el('form', { class: 'panel settings-form' });
        form.appendChild(el('h3', { text: t('default_file_expiration') }));

        var storeForever = el('input', { id: 'set-store-forever', type: 'checkbox' });
        if (state.settings.storeForever) storeForever.checked = true;
        var days = el('input', { id: 'set-days', type: 'number', min: '1', value: String(state.settings.defaultDays || 30) });

        var toggleRow = el('div', { class: 'toggle-row' }, [
          storeForever,
          el('label', { for: 'set-store-forever', text: t('store_files_forever') }),
        ]);
        var daysRow = el('div', { class: 'days-row' }, [
          days,
          el('span', { text: t('days') }),
        ]);

        function syncDaysState() {
          days.disabled = storeForever.checked;
          if (storeForever.checked) daysRow.classList.add('disabled');
          else daysRow.classList.remove('disabled');
        }

        storeForever.addEventListener('change', syncDaysState);
        syncDaysState();

        form.appendChild(toggleRow);
        form.appendChild(daysRow);

        form.appendChild(
          el('div', { class: 'submit-row' }, [
            el('button', { type: 'submit', class: 'btn form-submit', text: t('save') }),
          ]),
        );

        form.addEventListener('submit', async function(evt) {
          evt.preventDefault();
          await api('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              storeForever: storeForever.checked,
              defaultDays: Number(days.value || 30),
            }),
          });
          state.settings = { storeForever: storeForever.checked, defaultDays: Number(days.value || 30) };
          setFlash(t('settings_saved'), false);
        });

        root.appendChild(form);
        return root;
      }

      async function render() {
        closeSystemMenu();
        hidePreview();
        updateActiveNav();
        mainEl.innerHTML = '';

        try {
          if (state.view === 'upload') mainEl.appendChild(createUploadView());
          else if (state.view === 'files') mainEl.appendChild(createFilesView());
          else if (state.view === 'guestLinks') mainEl.appendChild(createGuestLinksView());
          else if (state.view === 'systemInfo') mainEl.appendChild(await createSystemInfoView());
          else if (state.view === 'settings') mainEl.appendChild(createSettingsView());
          else if (state.view === 'fileInfo') mainEl.appendChild(await createFileInfoView());
          else if (state.view === 'downloads') mainEl.appendChild(await createDownloadsView());
          else if (state.view === 'fileEdit') mainEl.appendChild(await createFileEditView());
          mainEl.focus();
        } catch (err) {
          setFlash(String(err.message || err), true);
        }
      }

      document.querySelectorAll('.nav [data-view]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          state.view = btn.getAttribute('data-view');
          state.selectedId = null;
          setFlash('', false);
          render();
        });
      });

      systemToggle.addEventListener('click', function() {
        if (systemMenu.style.display === 'block') closeSystemMenu();
        else openSystemMenu();
      });

      document.addEventListener('click', function(evt) {
        if (!systemMenu.contains(evt.target) && !systemToggle.contains(evt.target)) closeSystemMenu();
      });
      confirmBackdrop.addEventListener('click', function(evt) {
        if (evt.target === confirmBackdrop) confirmCancel.click();
      });

      systemMenu.querySelectorAll('[data-view]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          state.view = btn.getAttribute('data-view');
          setFlash('', false);
          render();
        });
      });

      document.getElementById('logout-btn').addEventListener('click', logout);
      langToggle.addEventListener('click', switchLang);
      loginBtn.addEventListener('click', login);
      pwEl.addEventListener('keydown', function(evt) {
        if (evt.key === 'Enter') login();
      });
      window.addEventListener('blur', hidePreview);
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) hidePreview();
      });

      if (state.pw) {
        loginEl.classList.add('hidden');
        appEl.classList.remove('hidden');
        loadInitialData().then(render).catch(function() {
          logout();
          setFlash(t('session_expired'), true);
        });
      }
      applyStaticTranslations();
    })();
  </script>
</body>
</html>`;
}

