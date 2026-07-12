const { spawn } = require('child_process');

// Try with a random domain
const surge = spawn('cmd.exe', ['/c', 'npx', 'surge', '.', 'ramazan-devstudio.surge.sh'], {
  cwd: 'E:\\ПРИЛОЖЕНИЕ 1\\landing',
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, HTTP_PROXY: '', HTTPS_PROXY: '' }
});

let allOutput = '';
surge.stdout.on('data', (data) => {
  const text = data.toString();
  allOutput += text;
  process.stdout.write(data);
  if (text.includes('email:')) {
    setTimeout(() => surge.stdin.write('ramazan20055555@gmail.com\n'), 300);
  }
  if (text.includes('password:')) {
    setTimeout(() => surge.stdin.write('Ramazan2005roma\n'), 300);
  }
});

surge.stderr.on('data', (data) => {
  allOutput += data.toString();
  process.stderr.write(data);
});

surge.on('close', (code) => {
  console.log('\n=== EXIT:', code, '===');
  process.exit(code);
});

setTimeout(() => { surge.stdin.end(); }, 15000);
