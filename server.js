const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');

const frontendDir = path.join(__dirname, 'frontend');
const next = require(path.join(frontendDir, 'node_modules', 'next'));

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false, dir: frontendDir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, '0.0.0.0');
}).catch(err => {
  console.error('Next.js failed to start:', err);
  process.exit(1);
});
