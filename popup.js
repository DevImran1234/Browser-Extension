document.getElementById('lockBrowser').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'lockBrowser' });
});

document.getElementById('openOptions').addEventListener('click', function() {
  chrome.runtime.openOptionsPage();
});
