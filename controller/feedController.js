const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const Post = require('../models/posts');
const User = require('../models/users');

exports.getPosts = async (req, res, next) => {
    try {
        const perPage = 3;
        const page = req.query.page || 1;
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find().skip((page - 1) * perPage).limit(perPage).populate('creator');
        console.log(posts);
        return res.status(200).json({
            message: 'Fetched successfully!',
            totalItems,
            posts,
            perPage,
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
  const userId = req.userId;
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
  if (!userId) {
    const err = new Error('Cannot create post without verifying yourself');
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
    creator: userId,
  });
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error('Invalid authorization!');
    err.statusCode = 404;
    throw err;
  }
  const result = await post.save();
  user.posts.push(result.id);
  const creator = await user.save();
  return res.status(201).json({
      message: 'Post created!',
      post: result,
      creator,
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
    const userId = req.userId;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      const err = new Error('Image not selected!');
      err.statusCode = 404;
      throw err;
    }

    const resp = await Post.findById(postId);

    if (resp.creator.toString() !== userId) {
      const err = new Error('Not Authorised');
      err.statusCode = 401;
      throw err;
    }

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

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const resp = await Post.findById(postId);
    
    if (resp.creator.toString() !== userId) {
      const err = new Error('Not Authorised');
      err.statusCode = 401;
      throw err;
    }

    if (!resp) {
      const err = new Error('Post not found!');
      err.statusCode = 422;
      throw err;
    }
    clearImage(resp.imageUrl);
    const result = await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      message: 'Deleted successfully!',
      post: result,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }

}

function clearImage(imgPath) {
  const filePath = path.join(__dirname, '..', imgPath);
  fs.unlink(filePath, (err, res) => {
    console.log(err, res);
  })
};