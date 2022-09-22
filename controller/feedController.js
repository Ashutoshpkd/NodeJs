const { validationResult } = require('express-validator');

const Post = require('../models/posts');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        return res.status(200).json({
            message: 'Fetched successfully!',
            posts,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
try {
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.statusCode = 422;
    throw err;
  }
  if (!req.file) {
    const err = new Error('Image not uploaded!');
    err.statusCode = 422;
    throw err;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new Post({
    title: title,
    content: content,
    imageUrl,
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

exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        return res.status(200).json({
            message: 'Post found!',
            post,
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 404;
        }
        return next(err);
    }
};