const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const { feedRouter } = require('./routes/feed');
const { join } = require('path');
const port = 5050;
const uri = `mongodb+srv://ashutoshpkd:naruto@rest-api.qmaic7m.mongodb.net/rest-api?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});

app.use('/feed', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
], feedRouter);

app.use('/images', express.static(join(__dirname, 'images')));

app.use((error, req, res, next) => {
  return res.status(error.statusCode).json({
    message: error.message,
  });
});
mongoose
.connect(uri)
  .then(() => {
      console.log(`Connected to MongoDB - DB - ${process.env.MONGO_DB}`);
      app.listen(port, () => {
        console.log(`SERVER UP AND RUNNING ON PORT - ... [${port}] ...`);
    });
  })
  .catch(err => {
    console.log(err);
  });