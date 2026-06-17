const { spawn } = require('child_process');
const path = require('path');

const standaloneDir = path.join(__dirname, 'frontend', '.next', 'standalone');
const serverFile = path.join(standaloneDir, 'server.js');

const child = spawn(process.execPath, [serverFile], {
  cwd: standaloneDir,
  env: { ...process.env, PORT: process.env.PORT || '3000', HOSTNAME: '0.0.0.0' },
  stdio: 'inherit',
});

child.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));