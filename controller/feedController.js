const { validationResult } = require('express-validator');

const Post = require('../models/posts');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Maximilian'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
try {
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.statusCode = 422;
    throw err;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Ashutosh' }
  });
    const result = await post.save();
    console.log('RAW = ', result);
    return res.status(201).json({
        message: 'Post created!',
        post: result,
    });
  } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 422;
      }
      return next(err);
  }
};