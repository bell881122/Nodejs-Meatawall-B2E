const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const handleErrorAsync = require('../utils/handleErrorAsync');

router.get('/users', handleErrorAsync(UserController.getUsers));
router.post('/users/sign_up', handleErrorAsync(UserController.register));
router.post('/users/sign_in', handleErrorAsync(UserController.login));

module.exports = router;