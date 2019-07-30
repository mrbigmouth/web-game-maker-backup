import inMemoryData from './inMemoryData';
// auto load when chrome initialize
chrome.runtime.onStartup.addListener(() => {
  const data = inMemoryData.data;
  chrome.storage.local.get(null, (savedData) => {
    Object.keys(savedData).forEach((savedKey) => {
      data[savedKey] = savedData[savedKey];
    });
  });
});

// auto save data when chrome extension suspend
chrome.runtime.onSuspend.addListener(saveAllData);

// save data when children page send save message
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'save') {
    saveAllData();
  }
});

function saveAllData() {
  chrome.storage.local.set(inMemoryData.data);
}

// auto load i18n/sync data when each children page send initialize message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'initialize') {
    sendResponse({
      data: inMemoryData.data,
    });

    return true;
  }
});
