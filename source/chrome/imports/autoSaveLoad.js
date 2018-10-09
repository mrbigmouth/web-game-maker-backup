import data from './data.json';
// auto load when chrome initialize
chrome.runtime.onStartup.addListener(() => {
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
  chrome.storage.local.set(data);
}

// auto load i18n/sync data when each children page send initialize message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'initialize') {
    const dataPathHash = {};
    copyDataToPathHash({
      i18n: data.i18n,
      sync: data.sync,
    }, dataPathHash);
    sendResponse({
      data: dataPathHash,
    });

    return true;
  }
});
function copyDataToPathHash(data, dataPathHash, prefix = '/') {
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      copyDataToPathHash(value, dataPathHash, prefix + key + '/');
    }
    else {
      dataPathHash[prefix + key] = value;
    }
  });
}
