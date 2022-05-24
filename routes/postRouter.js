const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const handleErrorAsync = require('../utils/handleErrorAsync');

router.get('/posts', handleErrorAsync(PostController.getPosts));
router.post('/post', handleErrorAsync(PostController.addPost));
router.delete('/post/:id', handleErrorAsync(PostController.deletePost));

module.exports = router;