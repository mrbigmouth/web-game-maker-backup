/* global chrome */

// unique id for every page
function random() {
  return '' + Date.now() + '#' + Math.floor(Math.random() * 10000);
}
const id = random();

// initialize by single message
export function initialize(callback) {
  const message = {
    source: id,
    type: 'initialize',
  };
  chrome.runtime.sendMessage(message, function(response) {
    callback(response.data);
  });
  // auto send save message before window unload
  if (window) {
    window.addEventListener('beforeunload', () => {
      const message = {
        source: id,
        type: 'save',
      };
      chrome.runtime.sendMessage(message);

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
  port.postMessage(message);
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

