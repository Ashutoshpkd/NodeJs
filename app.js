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
const port = 5050;
const uri = `mongodb+srv://ashutoshpkd:naruto@rest-api.qmaic7m.mongodb.net/rest-api-dev?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
      console.log(`Connected to MongoDB - DB - ${process.env.MONGO_DB}`);
      const server = app.listen(port, () => {
        console.log(`SERVER UP AND RUNNING ON PORT - ... [${port}] ...`);
      });
      const io = require('socket.io')(server);
      io.on('connection', (socket) => {
        console.log('Client connected');
      });
  })
  .catch(err => {
    console.log(err);
});