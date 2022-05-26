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
      errors = { ...errors, email: '請填寫 email' }
    else if (!validator.isEmail(email))
      errors = { ...errors, email: 'email 格式有誤，請重新確認' }

    if (!password)
      errors = { ...errors, password: '請填寫 password' }
    else if (!validator.isLength(password, { min: 8 }))
      errors = { ...errors, password: '密碼字數最少為 8 碼' }

    if (!name)
      errors = { ...errors, name: '請填寫 name' }

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
  login: async (req, res, next) => {
    const { email, password } = req.body;
    let errors = {};
    if (!email)
      errors = { ...errors, email: '請填寫 email' }
    else if (!validator.isEmail(email))
      errors = { ...errors, email: 'email 格式有誤，請重新確認' }

    if (!password)
      errors = { ...errors, password: '請填寫 password' }
    else if (!validator.isLength(password, { min: 8 }))
      errors = { ...errors, password: '密碼字數最少為 8 碼' }

    if (Object.keys(errors).length > 0)
      return handleError(res, next, { errors })

    const user = await User.findOne({ email }).select('+password')
    if (!user)
      return handleError(res, next, { kind: 'login', message: '帳號或密碼錯誤，請重新確認' })

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return handleError(res, next, {
        errors: {
          password: '密碼不正確'
        }
      })
    }
    generateSendJWT(user, 200, res);
  },
  checkAuth: async (req, res, next) => {
    res.status(200).json({
      status: 'success',
      user: req.user
    });
  },
  updatePassword: async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return handleError(res, next, { kind: 'update-password', message: '欄位請填寫完整' })
    }
    if (!validator.isLength(password, { min: 8 }) || !validator.isLength(confirmPassword, { min: 8 })) {
      return handleError(res, next, { kind: 'update-password', message: '密碼字數最少為 8 碼' })
    }
    if (password !== confirmPassword) {
      return handleError(res, next, { kind: 'update-password', message: '密碼不一致' })
    }

    newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
    generateSendJWT(user, 200, res)
  },
  getProfile: async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id })

    res.json({
      status: 'success',
      user
    });
  },
};