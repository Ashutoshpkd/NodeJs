const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const { feedRouter } = require('./routes/feed');
const { userRouter } = require('./routes/user');
const multer = require('multer');
const { join } = require('path');
const helmet = require('helmet');
const comp = require('compression');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@rest-api.qmaic7m.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(comp());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
   || file.mimetype === 'image/jpeg' || file.mimetype === 'image/JPG') {
     cb(null, true);
   } else {
     cb(null, false);
   }
};

app.use(
  multer({ storage: fileStorage, fileFilter }).single('images')
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return next();
});

app.use('/feed', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
], feedRouter);

app.use('/user', userRouter);

app.use('/images', express.static(join(__dirname, 'images')));

app.use((error, req, res, next) => {
  return res.status(error.statusCode).json({
    message: error.message,
  });
});
mongoose
.connect(uri)
  .then(() => {
      console.log(`Connected to MongoDB - DB - ${process.env.DB}`);
      const server = app.listen(process.env.PORT, () => {
        console.log(`SERVER UP AND RUNNING ON PORT - ... [${process.env.PORT}] ...`);
      });
      const io = require('./socket').init(server);
      io.on('connection', (socket) => {
        console.log('Client connected');
      });
  })
  .catch(err => {
    console.log(err);
});