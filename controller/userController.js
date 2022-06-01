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

    handleSuccess(res, { user });
  },
  updateProfile: async (req, res, next) => {
    const { user } = req;
    const { photo, sex } = req.body;

    let errors = {};
    const sexs = ["male", "female", "other"];
    if (photo && !photo.startsWith('https://'))
      errors = { ...errors, avatar: '請使用 https 開頭的圖片網址' }
    if (sex && sexs.indexOf(sex) < 0)
      errors = { ...errors, sex: `請選擇以下任一種性別：${sexs}` }
    if (Object.keys(errors).length > 0)
      return handleError(res, next, { errors })

    await User.findByIdAndUpdate(user._id, {
      photo: photo ? photo : user.photo,
      sex: sex ? sex : user.sex,
    });

    const newUser = await User.findById({ _id: user._id })
    handleSuccess(res, { newUser });
  },
  addUserFollow: async (req, res, next) => {
    const follower = req.user._id;
    const following = req.params.id;

    if (following && follower.valueOf() === following)
      return handleError(res, next, { kind: 'follow', message: '使用者無法追蹤自己' })
    await User.findOne({ _id: following })
      .catch(err => handleError(res, next, { kind: 'follow', message: '找不到追蹤的使用者' }))

    await User.findByIdAndUpdate(follower, { $addToSet: { following } });
    await User.findByIdAndUpdate(following, { $addToSet: { follower } });
    handleSuccess(res, { follow: '追蹤成功' });
  },
  deleteUserFollow: async (req, res, next) => {
    const followerId = req.user._id;
    const followingId = req.params.id;

    await User.findOne({ _id: followingId })
      .catch(err => handleError(res, next, { kind: 'follow', message: '找不到取消追蹤的使用者' }))

    await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { follower: followerId } });
    handleSuccess(res, { unfollow: '取消追蹤成功' });
  },
  getUserFollowing: async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id })
    const following = user.following;
    handleSuccess(res, { following });
  },
};