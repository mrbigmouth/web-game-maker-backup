// api handlers
const initialize = require('./initialize');
const update = require('./update');
const read = require('./read');
const handlers = {
  initialize,
  update,
  read,
};

function onMessage(ws, responseAll) {
  return (rawMessage) => {
    const message = JSON.parse(rawMessage);
    console.log('receive message: ', message);
    const response = function response(responseMessage) {
      if (! responseMessage.stamp) {
        responseMessage.stamp = message.stamp;
      }
      ws.send(JSON.stringify(responseMessage));
    };

    const handler = handlers[message.type];
    if (handler) {
      try {
        handler(message, response, responseAll);
      }
      catch (e) {
        response({
          ...message,
          error: {
            message: e.message,
          },
        });
      }
    }
    else {
      response({
        error: {
          message: `Invalid message type: ${message.type}!`,
        },
      });
    }
  };
}
module.exports = onMessage;
