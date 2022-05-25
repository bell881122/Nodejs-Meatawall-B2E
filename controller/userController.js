const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess');
const { generateSendJWT } = require('../utils/auth');

module.exports = {
  getUsers: async (req, res, next) => {
    await User.find()
      .then(result => handleSuccess(res, { users: result }))
  },
  register: async (req, res, next) => {
    let { email, password, name } = req.body;
    let errors = {};

    if (!email)
      errors = { ...errors, email: "請填寫 email" }
    else if (!validator.isEmail(email))
      errors = { ...errors, email: "email 格式有誤，請重新確認" }

    if (!password)
      errors = { ...errors, password: "請填寫 password" }
    else if (!validator.isLength(password, { min: 8 }))
      errors = { ...errors, password: "密碼字數最少為 8 碼" }

    if (!name)
      errors = { ...errors, name: "請填寫 name" }

    if (Object.keys(errors).length > 0)
      return handleError(res, next, { errors })

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    generateSendJWT(newUser, 201, res);
  },
};