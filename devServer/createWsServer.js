const WebSocket = require('ws');
const onMessage = require('./onMessage');

function createWsServer(port) {
  const wsServer = new WebSocket.Server({
    port,
  });
  const sendToAllWs = function sendToAllWs(message) {
    const jsonMessage = JSON.stringify(message);
    wsServer.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(jsonMessage);
      }
    });
  };
  wsServer.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(sendMessage);
    }
  });

  let pageIdCounter = 0;
  wsServer.on('connection', (ws) => {
    pageIdCounter += 1;
    ws.customId = pageIdCounter;
    console.log(`page-${ws.customId} is connecting...`);
    ws.on('message', onMessage(ws, sendToAllWs));
    ws.on('clouse', () => {
      console.log(`page-${ws.customId} is disconnected...`);
    });
  });
}
module.exports = createWsServer;
