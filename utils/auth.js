const jwt = require('jsonwebtoken');
const handleErrorAsync = require('./handleErrorAsync');
const handleError = require('./handleError');
const User = require('../models/userModel');

module.exports = {
  generateSendJWT: (user, statusCode, res) => {
    // 產生 JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      user: {
        token,
        name: user.name
      }
    });
  },
  isAuth: handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return handleError(res, next, { kind: 'login', message: '尚未登入，請重新驗證身分' }, 401)
    }

    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          return handleError(res, next, { errors: { checkAuth: 'token 過期或失效，請重新認證' } }, 401)
        } else {
          resolve(payload)
        }
      })
    })
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    next();
  }),
};