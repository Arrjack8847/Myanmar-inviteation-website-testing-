/** Minimal dependency-free local server. Node.js 18+ required. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = 4173;
// Default to loopback. Opt into LAN device testing explicitly with HOST=0.0.0.0.
const host = process.env.HOST === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1';
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon'};
http.createServer((req,res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  fs.stat(file,(err,stat) => {
    if (err || !stat.isFile()) {res.writeHead(404).end('Not Found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, host, () => console.log(`Golden Autumn Heritage preview: http://localhost:${port}\nListening on ${host}:${port}. ${host === '0.0.0.0' ? 'LAN access enabled: use your computer LAN IP on the same private Wi-Fi.' : 'Loopback access only.'}\nPress Ctrl+C to stop.`));
