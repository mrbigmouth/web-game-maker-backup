const inMemoryData = require('../inMemoryData');

function read(message, response) {
  const pathList = message.pathList;
  const responseMessage = {};
  buildResponseMessage(responseMessage, pathList);
  response(responseMessage);
}
module.exports = read;

function buildResponseMessage(message, pathList) {
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
