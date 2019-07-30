const fs = require('fs');
const url = require('url');
const path = require('path');
const ROOTPATH = path.join(__dirname, '..');
const connect = require('connect');
const serveStatic = require('serve-static');

function createHttpServer() {
  const server = connect();
  server
    .use(serveStatic(path.join(ROOTPATH, 'destination')))
    .use((req, res, next) => {
      const { pathname } = url.parse(req.url);
      console.log(pathname);
      if (pathname === '/favicon.ico') {
        const iconPath = path.join(ROOTPATH, 'static', 'favicon.ico');
        const iconFile = fs.readFileSync(iconPath);
        res.end(iconFile);
      }

      next();
    })
    .use((req, res, next) => {
      console.log('404!');
      console.log(req.method, req.url);
      next();
    });

  return server;
}
module.exports = createHttpServer;
