const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { isAuth } = require('../utils/auth');

router.get('/posts', isAuth, handleErrorAsync(PostController.getPosts));
router.post('/post', isAuth, handleErrorAsync(PostController.addPost));
router.delete('/post/:id', isAuth, handleErrorAsync(PostController.deletePost));

module.exports = router;