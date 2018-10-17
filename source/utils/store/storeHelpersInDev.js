// unique id for every page
function random() {
  return '' + Date.now() + '#' + Math.floor(Math.random() * 10000);
}
const id = random();
let port;

// initialize
export function initialize(callback) {
  const stamp = random();
  const message = {
    source: id,
    type: 'initialize',
    stamp,
  };
  port = new WebSocket('ws://127.0.0.1:3001/');
  port.addEventListener('open', function open() {
    port.send(JSON.stringify(message));
  });

  function initializeDone(e) {
    const message = JSON.parse(e.data);
    if (message.stamp === stamp) {
      callback(message.data);
      port.removeEventListener('message', initializeDone);
    }
  }
  port.addEventListener('message', initializeDone);

  // auto send save message before window unload
  if (window) {
    window.addEventListener('beforeunload', () => {
      const message = {
        source: id,
        type: 'save',
      };
      port.send(JSON.stringify(message));

      return true;
    });
  }
}

export function sendUpdate(payload, callback) {
  const stamp = random();
  function onUpdateDone(e) {
    const message = JSON.parse(e.data);
    if (message.stamp === stamp) {
      port.removeEventListener('message', onUpdateDone);
      callback(message);
    }
  }
  port.addEventListener('message', onUpdateDone);

  const message = {
    type: 'update',
    source: id,
    payload,
    stamp,
  };
  port.send(JSON.stringify(message));
}
export function sendRead(pathList, callback) {
  const stamp = random();
  function onReadDone(e) {
    const message = JSON.parse(e.data);
    if (message.stamp === stamp) {
      port.removeEventListener('message', onReadDone);
      callback(message);
    }
  }
  port.addEventListener('message', onReadDone);

  const message = {
    type: 'read',
    source: id,
    pathList,
    stamp,
  };
  port.send(JSON.stringify(message));
}

export function onUpdate(updateHandler) {
  port.addEventListener('message', (e) => {
    const message = JSON.parse(e.data);
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

