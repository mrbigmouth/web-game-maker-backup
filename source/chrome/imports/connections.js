import data from './data.json';
import log from './logger';

// update by long-lived connection
const portList = [];
chrome.runtime.onConnect.addListener((port) => {
  log(`page ${port.name} is connecting...`);
  const existsPortIndex = findPortIndex(port.name);
  if (existsPortIndex === -1) {
    portList.push(port);
    port.onDisconnect.addListener(() => {
      log(`page ${port.name} is disconnected...`);
      const index = findPortIndex(port.name);
      if (index !== -1) {
        portList.splice(index, 1);
      }
    });
    port.onMessage.addListener((message) => {
      log(message);
      try {
        if (message.type === 'update') {
          const payload = message.payload;
          const needSyncPayload = {};
          Object.keys(payload).forEach((path) => {
            updateChromeInMemoryData(path, payload[path]);
            setNeedSyncPayload(path, payload[path], needSyncPayload);
          });
          message.payload = needSyncPayload;
          portList.forEach((port) => {
            port.postMessage(message);
          });
        }
        else if (message.type === 'read') {
          const pathList = message.pathList;
          const postMessage = {
            stamp: message.stamp,
          };
          setReadMessage(postMessage, pathList);
          port.postMessage(postMessage);
        }
      }
      catch(e) {
        port.postMessage({
          ...message,
          error: e.message,
        });
      }
    });
  }
});

function findPortIndex(portName) {
  return portList.findIndex((existsPort) => {
    return portName === existsPort.name;
  });
}
function updateChromeInMemoryData(path, value) {
  const paceList = path.split('/');
  let updateTarget = data;
  const updateField = paceList.pop();
  paceList.forEach((pace) => {
    if (pace) {
      updateTarget = updateTarget[pace];
    }
  });
  updateTarget[updateField] = value;
}
function setNeedSyncPayload(path, value, needSyncPayload) {
  const slicedPath = path.slice(0, 5);
  if (slicedPath === '/i18n' || slicedPath === '/sync') {
    needSyncPayload[path] = value;
  }
}
function setReadMessage(message, pathList) {
  const readData = {};
  const error = [];
  pathList.forEach((path) => {
    const paceList = path.split('/');
    let result = data;
    try {
      paceList.forEach((pace) => {
        if (pace) {
          result = result[pace];
        }
      });
    }
    catch (e) {
      error.push({
        code: 'e00001',
        params: {
          path,
        },
      });
    }

    readData[path] = result;
  });
  message.data = readData;
  if (error.length) {
    message.error = error;
  }

  return message;
}
