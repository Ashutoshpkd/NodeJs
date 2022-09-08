const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>NodeJs</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
        res.write('</html>');
        return res.end();
    } else if (req.url === '/message') {
        const data = [];
        req.on('data', (chunk) => {
            console.log('Chunk = ', chunk);
            data.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(data).toString();
            console.log('parsedBody', parsedBody);
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message);
        });
        res.statusCode = 301;
        res.setHeader('Location', '/home');
        return res.end();
    } else {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>NodeJs</title></head>');
        res.write('<body><h1>Hello First NodeJs Application</h1></body>');
        res.write('</html>');
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server up and running on port 3000 ...')
});