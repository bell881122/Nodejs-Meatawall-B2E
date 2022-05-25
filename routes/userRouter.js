const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { isAuth } = require('../utils/auth');

router.get('/users', handleErrorAsync(UserController.getUsers));
router.get('/users/checkAuth', isAuth, handleErrorAsync(UserController.checkAuth));
router.post('/users/sign_up', handleErrorAsync(UserController.register));
router.post('/users/sign_in', handleErrorAsync(UserController.login));
router.post('/users/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));

module.exports = router;