const path = require('path');

const standaloneDir = path.join(__dirname, 'frontend', '.next', 'standalone');

process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = '0.0.0.0';

process.chdir(standaloneDir);
require(path.join(standaloneDir, 'server.js'));
