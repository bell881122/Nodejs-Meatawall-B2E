const User = require('../models/userModel');
const Post = require('../models/postModel');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess.js');

async function getPosts(req, res, next) {
  await Post.find().populate('user')
    .then(result => handleSuccess(res, { posts: result }))
};

async function addPost(req, res, next) {
  const { content, image } = req.body;
  if (image) {
    if (!image.startsWith('https://')) {
      return handleError(res, next, { kind: 'image', message: '請使用 https 開頭的圖片網址' })
    }
  }
  await Post.create({
    user: '62838efef6b9c0e789d73569',
    content,
    image
  }).then(result => handleSuccess(res, { newPost: result }))
};

async function deletePost(req, res, next) {
  const { id } = req.params;
  await Post.findByIdAndDelete({ _id: id })
    .then(result => {
      if (result == null)
        return handleError(res, next, { kind: 'id', message: '無此 id，請重新確認' })
      else
        getPosts(req, res)
    })
};

module.exports = {
  getPosts,
  addPost,
  deletePost,
};