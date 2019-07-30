import log from '../logger';

// api handlers
import update from './update';
import read from './read';
const handlers = {
  // initialize api write in ../autoSaveLoad.js
  // initialize,
  update,
  read,
};

export function onMessage(port, responseAll) {
  return (message) => {
    log(`port-${port.name} receive message: `, message);
    const response = function response(responseMessage) {
      if (! responseMessage.stamp) {
        responseMessage.stamp = message.stamp;
      }
      port.postMessage(responseMessage);
    };

    const handler = handlers[message.type];
    if (handler) {
      try {
        handler(message, response, responseAll);
      }
      catch (e) {
        port.postMessage({
          ...message,
          error: e.message,
        });
      }
    }
    else {
      response({
        error: `Invalid message type: ${message.type}!`,
      });
    }

    return true;
  };
}
export default onMessage;
