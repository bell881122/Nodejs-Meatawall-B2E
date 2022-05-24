const User = require('../models/userModel');
const Post = require('../models/postModel');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess.js');

async function getPosts(req, res) {
  await Post.find().populate('user')
    .then(result => handleSuccess(res, { posts: result }))
    .catch(err => handleError(res, err));
};

async function addPost(req, res) {
  const { content, image } = req.body;
  if (image) {
    if (!image.startsWith('https://')) {
      return handleError(res, { kind: 'image', message: '請使用 https 開頭的圖片網址' })
    }
  }
  await Post.create({
    user: '62838efef6b9c0e789d73569',
    content,
    image
  }).then(result => handleSuccess(res, { newPost: result }))
    .catch(err => handleError(res, err));
};

async function deletePost(req, res) {
  const { id } = req.params;
  await Post.findByIdAndDelete({ _id: id })
    .then(result => {
      if (result == null)
        return handleError(res, { kind: 'id', message: '無此 id，請重新確認' })
      else
        getPosts(req, res)
    })
    .catch(err => handleError(res, err));
};

module.exports = {
  getPosts,
  addPost,
  deletePost,
};