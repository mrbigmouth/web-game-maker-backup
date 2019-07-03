chrome.browserAction.onClicked.addListener(() => {
  window.open(chrome.extension.getURL('home.html'));
});
