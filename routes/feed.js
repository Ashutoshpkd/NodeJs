const express = require('express');

const feedController = require('../controller/feedController');

const router = express.Router();

router.get('/posts/:postId', feedController.getPostById);

router.put('/post/:postId', feedController.updatePost);

router.get('/posts', feedController.getPosts);

router.post('/post', feedController.createPost);

router.delete('/post/:postId', feedController.deletePost)

exports.feedRouter = router;