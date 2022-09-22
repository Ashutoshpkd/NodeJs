const express = require('express');

const feedController = require('../controller/feedController');

const router = express.Router();

router.get('/posts/:postId', feedController.getPostById);

router.get('/posts', feedController.getPosts);

router.post('/post', feedController.createPost);

exports.feedRouter = router;