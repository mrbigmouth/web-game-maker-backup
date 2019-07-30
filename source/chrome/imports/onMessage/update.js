import inMemoryData from '../inMemoryData';

export function update(message, response, responseAll) {
  const payload = message.payload;
  Object.keys(payload).forEach((path) => {
    updateChromeInMemoryData(path, payload[path]);
  });
  responseAll(message);
}
export default update;

function updateChromeInMemoryData(path, value) {
  const paceList = path.split('/');
  let updateTarget = inMemoryData.data;
  const updateField = paceList.pop();
  paceList.forEach((pace) => {
    if (pace) {
      updateTarget = updateTarget[pace];
    }
  });
  updateTarget[updateField] = value;
}
