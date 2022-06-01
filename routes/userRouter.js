const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const PostController = require('../controller/postController');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { isAuth } = require('../utils/auth');

router.get('/users', isAuth, handleErrorAsync(UserController.getUsers));
router.get('/users/checkAuth', isAuth, handleErrorAsync(UserController.checkAuth));
router.post('/users/sign_up', handleErrorAsync(UserController.register));
router.post('/users/sign_in', handleErrorAsync(UserController.login));
router.post('/users/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));
router.get('/users/profile', isAuth, handleErrorAsync(UserController.getProfile));
router.patch('/users/profile', isAuth, handleErrorAsync(UserController.updateProfile));
router.get('/users/getLikeList', isAuth, handleErrorAsync(PostController.getLikeList));
router.post('/users/:id/follow', isAuth, handleErrorAsync(UserController.addUserFollow));
router.delete('/users/:id/unfollow', isAuth, handleErrorAsync(UserController.deleteUserFollow));

module.exports = router;