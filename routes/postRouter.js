const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { isAuth } = require('../utils/auth');

router.get('/posts', isAuth, handleErrorAsync(PostController.getPosts));
router.get('/posts/:id', isAuth, handleErrorAsync(PostController.getPost));
router.get('/posts/user/:id', isAuth, handleErrorAsync(PostController.getUserPost));
router.post('/post', isAuth, handleErrorAsync(PostController.addPost));
router.post('/posts/:id/like', isAuth, handleErrorAsync(PostController.addPostLike));
router.delete('/posts/:id/unlike', isAuth, handleErrorAsync(PostController.deletePostLike));
router.delete('/post/:id', isAuth, handleErrorAsync(PostController.deletePost));
router.post('/posts/:id/comment', isAuth, handleErrorAsync(PostController.addPostComment));

module.exports = router;