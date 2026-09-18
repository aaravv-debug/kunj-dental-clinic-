const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Explicit path references ensure Vercel Node File Trace bundles both files
const INDEX_PATH = path.join(__dirname, 'index.html');
const TREATMENTS_PATH = path.join(__dirname, 'treatments.html');

let indexContent = '';
let treatmentsContent = '';

try {
  indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
} catch (e) {
  try {
    indexContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  } catch (err) {
    indexContent = '<h1>Index not found</h1>';
  }
}

try {
  treatmentsContent = fs.readFileSync(TREATMENTS_PATH, 'utf8');
} catch (e) {
  try {
    treatmentsContent = fs.readFileSync(path.join(process.cwd(), 'treatments.html'), 'utf8');
  } catch (err) {
    treatmentsContent = '<h1>Treatments not found</h1>';
  }
}

function handler(req, res) {
  const reqUrl = req.url.split('?')[0].split('#')[0];

  // Route to treatments page
  if (reqUrl === '/treatments' || reqUrl === '/treatments.html' || reqUrl === '/treatments/' || reqUrl.startsWith('/treatments')) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(treatmentsContent);
    return;
  }

  // Default to index page for root or any other document request
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(indexContent);
}

module.exports = handler;

if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
