const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const next = require('./frontend/node_modules/next');

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false, dir: path.join(__dirname, 'frontend') });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, '0.0.0.0', () => {
    console.log(`> Ready on port ${port}`);
  });
});