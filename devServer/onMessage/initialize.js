const inMemoryData = require('../inMemoryData');

function initialize(message, response) {
  response({
    data: inMemoryData.data,
  });
}
module.exports = initialize;
