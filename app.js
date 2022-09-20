const express = require('express');
const bodyParser = require('body-parser');
const { feedRouter } = require('./routes/feed');
const port = 5050;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', '*');
    res.setHeader('Access-Control-Allow-Header', '*');

    next();
})

app.use('/feed', feedRouter);

app.listen(port, () => {
    console.log(`SERVER UP AND RUNNING ON PORT - ... [${port}] ...`);
});