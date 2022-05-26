const express = require('express');
const router = express.Router();
const UtilsController = require('../controller/utilsController');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { isAuth } = require('../utils/auth');

router.post('/upload', isAuth, handleErrorAsync(UtilsController.uploadImage));

module.exports = router;