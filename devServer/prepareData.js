const fs = require('fs');
const path = require('path');
const pathToDataJson = path.join(__dirname, '..', 'initialInMemoryData.json');
const inMemoryData = require('./inMemoryData');
function prepareData() {
  // watching data change
  fs.watch(pathToDataJson, () => {
    console.log(`${pathToDataJson} was changed!`);
    loadData();
  });
  loadData();
}
module.exports = prepareData;

function loadData() {
  console.log('loading data...');
  const dataText = fs.readFileSync(pathToDataJson, {
    encoding: 'utf8',
  });
  if (dataText) {
    try {
      const parsedData = JSON.parse(dataText);
      inMemoryData.data = parsedData;
    }
    catch(e) {
      console.error(`read ${pathToDataJson} error: `);
      console.error(e);
      console.error(dataText);
    }
  }
}
