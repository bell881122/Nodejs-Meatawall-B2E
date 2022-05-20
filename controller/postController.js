const User = require('../models/userModel');
const Post = require('../models/postModel');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess.js');

async function getPosts(req, res) {
  const posts = await Post.find().populate('user')
    .catch(err => handleError(res, err));
  handleSuccess(res, { posts });
};

module.exports = {
  getPosts,
};