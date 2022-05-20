const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');

router.get('/posts', PostController.getPosts);

module.exports = router;