const prepareData = require('./prepareData');
const createHttpServer = require('./createHttpServer');
const createWsServer = require('./createWsServer');

exports.start = function() {
  prepareData();
  const server = createHttpServer();
  server.listen(3000);
  console.log('http server listening 3000...');

  const wsServer = createWsServer(3001);
  console.log('ws server listening 3001...');
};
