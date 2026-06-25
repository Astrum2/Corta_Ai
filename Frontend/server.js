const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const buildDir = path.join(__dirname, 'build');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function sendFile(filePath, res) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  stream.pipe(res);

  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Erro ao ler o arquivo.');
  });
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = path.join(buildDir, safePath);

  if (filePath.startsWith(buildDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(filePath, res);
    return;
  }

  const indexPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    sendFile(indexPath, res);
    return;
  }

  res.statusCode = 404;
  res.end('Build nao encontrado.');
});

server.listen(port, () => {
  console.log(`Frontend server rodando em http://localhost:${port}`);
});