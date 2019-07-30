/* global chrome */

// unique id for every page
function random() {
  return '' + Date.now() + '#' + Math.floor(Math.random() * 10000);
}
const id = random();

// initialize by single message
let initialized = false;
let beforeInitializeMessageList = [];
export function initialize(callback) {
  const initializeMessage = {
    source: id,
    type: 'initialize',
  };
  chrome.runtime.sendMessage(initializeMessage, function(response) {
    callback(response.data);
    initialized = true;
    beforeInitializeMessageList.forEach((message) => {
      chrome.runtime.sendMessage(message);
    });
  });
  // auto send save message before window unload
  if (window) {
    window.addEventListener('beforeunload', () => {
      const unloadMessage = {
        source: id,
        type: 'save',
      };
      chrome.runtime.sendMessage(unloadMessage);

      return true;
    });
  }
}

// update by long-lived connection
const port = chrome.runtime.connect({
  name: id,
});

export function sendUpdate(payload, callback) {
  const stamp = random();
  function onUpdateDone(message) {
    if (message.stamp === stamp) {
      port.onMessage.removeListener(onUpdateDone);
      callback(message);
    }
  }
  port.onMessage.addListener(onUpdateDone);

  const message = {
    type: 'update',
    source: id,
    payload,
    stamp,
  };
  port.postMessage(message);
}

export function sendRead(pathList, callback) {
  const stamp = random();
  function onReadDone(message) {
    if (message.stamp === stamp) {
      port.onMessage.removeListener(onReadDone);
      callback(message);
    }
  }
  port.onMessage.addListener(onReadDone);

  const message = {
    type: 'read',
    source: id,
    pathList,
    stamp,
  };
  if (initialized) {
    port.postMessage(message);
  }
  else {
    beforeInitializeMessageList.push(message);
  }
}

export function sendCall(helper, callback) {
  const stamp = random();
  function onCallDone(message) {
    if (message.stamp === stamp) {
      port.onMessage.removeListener(onCallDone);
      callback(message);
    }
  }
  port.onMessage.addListener(onCallDone);

  const message = {
    source: id,
    stamp,
    ...helper,
  };
  if (initialized) {
    port.postMessage(message);
  }
  else {
    beforeInitializeMessageList.push(message);
  }
}

export function onUpdate(updateHandler) {
  port.onMessage.addListener((message) => {
    if (message.type === 'update' && message.source !== id) {
      updateHandler(message.payload);
    }
  });
}

export function mapModel(prefixPath = '', fields = []) {
  const result = {};
  if (Array.isArray(fields)) {
    fields.forEach((fieldName) => {
      const path = `${prefixPath}/${fieldName}`;
      result[fieldName] = {
        get() {
          return this.$store.getters.read(path);
        },
        set(value) {
          this.$store.dispatch('update', {
            [path]: value,
          });
        },
      };
    });
  }
  else {
    Object.keys(fields).forEach((aliasFieldName) => {
      const path = `${prefixPath}/${fields[aliasFieldName]}`;
      result[aliasFieldName] = {
        get() {
          return this.$store.getters.read(path);
        },
        set(value) {
          this.$store.dispatch('update', {
            [path]: value,
          });
        },
      };
    });
  }

  return result;
}

