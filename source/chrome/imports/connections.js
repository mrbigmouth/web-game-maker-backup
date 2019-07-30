import log from './logger';
import onMessage from './onMessage';

// update by long-lived connection
const portList = [];
chrome.runtime.onConnect.addListener((port) => {
  log(`page-${port.name} is connecting...`);
  const existsPortIndex = findPortIndex(port.name);
  if (existsPortIndex === -1) {
    portList.push(port);
    port.onDisconnect.addListener(() => {
      log(`page-${port.name} is disconnected...`);
      const index = findPortIndex(port.name);
      if (index !== -1) {
        portList.splice(index, 1);
      }
    });
    port.onMessage.addListener(onMessage(port, postMessageToAllPort));
  }
});

function findPortIndex(portName) {
  return portList.findIndex((existsPort) => {
    return portName === existsPort.name;
  });
}

function postMessageToAllPort(message) {
  portList.forEach((port) => {
    port.postMessage(message);
  });
}
