const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const DATA_FILE = path.join(__dirname, 'pregnancy-data.json');

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // API: Sync data
  if (req.url === '/api/sync') {
    if (req.method === 'GET') {
      // Return saved data
      fs.readFile(DATA_FILE, (err, data) => {
        if (err) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{}'); return; }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
      return;
    }
    if (req.method === 'POST') {
      // Save data
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2), (err) => {
            if (err) { res.writeHead(500); res.end('Save failed'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, savedAt: new Date().toISOString() }));
          });
        } catch(e) { res.writeHead(400); res.end('Invalid JSON'); }
      });
      return;
    }
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === '/' ? 'pregnancy-tracker.html' : req.url);
  const ext = path.extname(filePath);
  const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});
server.listen(PORT, () => console.log('Server running at http://localhost:' + PORT));
