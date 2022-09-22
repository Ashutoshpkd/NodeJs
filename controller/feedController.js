const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

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

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.images;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      const err = new Error('Image not selected!');
      err.statusCode = 404;
      throw err;
    }

    const resp = await Post.findById(postId);
    if (imageUrl !== resp.imageUrl) clearImage(resp.imageUrl);

    resp.title = title;
    resp.content = content;
    resp.imageUrl = imageUrl;

    const result = await resp.save();

    return res.status(200).json({
      message: 'Post updated!',
      post: result,
    })
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422;
    }
    return next(err);
  }
};

function clearImage(imgPath) {
  const filePath = path.join(__dirname, '..', imgPath);
  fs.unlink(filePath, (err, res) => {
    console.log(err, res);
  })
};