const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.statusCode = 301;
        res.write('<html><head><title>Assignment</title></head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">SUBMIT</button>');
        res.write('</form></body></html>');
        return res.end();
    }
    if (req.url === '/create-user') {
        const data = [];

        req.on('data', (chunk) => {
            data.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(data).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
            fs.writeFileSync('assignment.txt', username);
        });
        res.setHeader('Location', '/');
        res.statusCode = 302;
        return res.end();
    }
    
});

server.listen(2500, () => {
    console.log('Server up on port 2500');
});