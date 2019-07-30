const inMemoryData = require('../inMemoryData');

function update(message, response, responseAll) {
  const payload = message.payload;
  const needSyncPayload = {};
  Object.keys(payload).forEach((path) => {
    const value = payload[path];
    updateDevInMemoryData(path, value);
    needSyncPayload[path] = value;
  });
  message.payload = needSyncPayload;
  responseAll(message);
}
module.exports = update;

function updateDevInMemoryData(path, value) {
  const paceList = path.split('/');
  let updateTarget = inMemoryData.data;
  const updateField = paceList.pop();
  paceList.forEach((pace) => {
    if (pace) {
      updateTarget = updateTarget[pace];
    }
  });
  updateTarget[updateField] = value;
  console.log('inMemoryData', inMemoryData.data);
}
