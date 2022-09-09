const express = require('express');

const app = express();

// app.use('/', (req, res, next) => {
//     console.log('Into the first middleware');
//     console.log(req.method, req.url);
//     next();
// });
app.use('/users', (req, res) => {
    console.log('Into the second middleware');
    console.log('Second = ', req.method, req.url);
    res.send('Hello Ashutosh!');
});

app.use('/', (req, res, next) => {
    console.log('Into the second middleware');
    console.log('First = ', req.method, req.url);
    res.send('Hello World!');
});

app.listen(2500, () => {
    console.log('Server running on port [2500] ... ');
});