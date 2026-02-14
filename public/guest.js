(function() {
  var form = document.getElementById('guest-form');
  var filesInput = document.getElementById('files');
  var dropZone = document.getElementById('drop-zone');
  var fileList = document.getElementById('file-list');
  var guestBusy = document.getElementById('guest-busy');
  var selectedFiles = [];
  var uploading = false;
  var guestConfig = window.__PS_GUEST__ || { noFiles: 'No files selected', lang: 'en' };

  function syncFileList() {
    if (!selectedFiles.length) {
      fileList.textContent = guestConfig.noFiles;
      return;
    }
    fileList.textContent = selectedFiles.map(function(f, idx) {
      return (idx + 1) + '. ' + f.name;
    }).join('\n');
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
    fd.append('lang', guestConfig.lang);
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
