const fileUitls = appRequire('utils/file-utils');
const io = appRequire('socket');
const Post = appRequire('models/post-model');
const uuidTools = appRequire('utils/uuid-tools');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.perpage || 3;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
        .populate('creator')  
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

    res
      .status(200)
      .json({
        message: 'Fetched posts successfully.',
        posts: posts,
        totalItems: totalItems
      });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
  
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors:', errors);
    const valErrs = errors.array();
    const error = new Error({ message: 'Validation failed, entered data is incorrect.'});
    error.statusCode = 422;
    error.validationErrors = valErrs;
    throw error;
  }
  console.log('createPost:', req.body.title, req.body.content);

  const imageFile = req.file.filename;
  console.log('image:', imageFile);
  if (!imageFile) {
    console.log('error - no image', imageFile);
    return res.status(422).json({
      post: post,
      errorMessage: 'Attached file is not an image (png, jpg, gif).',
      errors: []
    });
  }

  const postCreator = req.userId;
  if (!postCreator) {
    const error = new Error('Not authorised!');
    error.statusCode = 401;
    throw error;
  }

  const post = Post.postFactory(req.body);
  post.imageUrl = 'images/' + imageFile;
  post.creator = postCreator;
  console.log('post:', post);

  try {
    const result = await post.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: req.email } }
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  console.log('fetching post:', postId);

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = 'images/' + req.file.filename;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  console.log('updatePost data:', title, content, imageUrl);
    
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      fileUitls.deleteImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;

    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    fileUitls.deleteImage(post.imageUrl);

    const result = await Post.findByIdAndRemove(postId);
    console.log(result);
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post.' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
