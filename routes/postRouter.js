const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');

router.get('/posts', PostController.getPosts);
router.post('/post', PostController.addPost);
router.delete('/post/:id', PostController.deletPost);

module.exports = router;