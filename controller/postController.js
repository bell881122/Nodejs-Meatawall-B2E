const User = require('../models/userModel');
const Post = require('../models/postModel');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess.js');

async function getPosts(req, res, next) {
  await Post.find().populate('user')
    .then(result => handleSuccess(res, { posts: result }))
};

async function getPost(req, res, next) {
  const { id } = req.params;
  await Post.find({ _id: id }).populate('user')
    .then(result => handleSuccess(res, { posts: result }))
};

async function getUserPost(req, res, next) {
  const { id } = req.params;
  await Post.find({ user: id }).populate('user')
    .then(result => handleSuccess(res, { posts: result }))
};

async function addPost(req, res, next) {
  const { content, image } = req.body;
  const { _id } = req.user;

  if (image) {
    if (!image.startsWith('https://')) {
      return handleError(res, next, { kind: 'image', message: '請使用 https 開頭的圖片網址' })
    }
  }
  await Post.create({
    user: _id,
    content,
    image
  }).then(result => handleSuccess(res, { newPost: result }))
};

async function addPostLike(req, res, next) {
  const postId = req.params.id;
  const { _id } = req.user;
  await Post.findByIdAndUpdate({ _id: postId }, {
    $addToSet: { likes: _id }
  })
  getPost(req, res, next);
};

async function deletePostLike(req, res, next) {
  const postId = req.params.id;
  const { _id } = req.user;
  await Post.findByIdAndUpdate({ _id: postId }, {
    $pull: { likes: _id }
  })
  getPost(req, res, next);
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

async function addPostComment(req, res, next) {
  const { commentContent } = req.body;
  if (!commentContent) {
    return handleError(res, next, { kind: 'comment', message: '請填寫留言' })
  }

  const postId = req.params.id;
  const { _id } = req.user;
  await Post.findByIdAndUpdate({ _id: postId }, {
    $addToSet: {
      comments: {
        commentContent,
        user: _id
      }
    }
  })
  getPost(req, res, next);
};

module.exports = {
  getPosts,
  getPost,
  getUserPost,
  addPost,
  addPostLike,
  deletePostLike,
  deletePost,
  addPostComment,
};