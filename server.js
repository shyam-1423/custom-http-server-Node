const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

const serveFile = (filePath, res, contentType = 'text/html') => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            const errorMsg = `<h1>${err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error'}</h1>`;
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = err.code === 'ENOENT' ? 404 : 500;
            res.end(errorMsg);
        } else {
            res.setHeader('Content-Type', contentType);
            res.statusCode = 200;
            res.end(content);
        }
    });
};

const server = http.createServer((req, res) => {
    const route = req.url;
    const ext = path.extname(route);

    // ✅ API routes
    if (route === '/api/users') {
        const users = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
            { id: 3, name: 'Alice Doe' },
            { id: 4, name: 'Ryan Dahl' }
        ];
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        return res.end(JSON.stringify(users));
    }

    if (route === '/api/status') {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        return res.end(JSON.stringify({
            status: 'OK',
            time: new Date().toISOString()
        }));
    }

    // ✅ Routing for HTML pages
    let filePath = '';
    switch (route) {
        case '/':
            filePath = path.join(__dirname, 'public', 'index.html');
            break;
        case '/about':
            filePath = path.join(__dirname, 'public', 'about.html');
            break;
        case '/contact':
            filePath = path.join(__dirname, 'public', 'contact.html');
            break;
        case '/services':
            filePath = path.join(__dirname, 'public', 'service.html');
            break;
        default:
            filePath = path.join(__dirname, 'public', route);
            break;
    }

    const finalExt = ext || path.extname(filePath);
    const contentType = mimeTypes[finalExt] || 'application/octet-stream';
    serveFile(filePath, res, contentType);
});

const PORT = 1406;
server.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});