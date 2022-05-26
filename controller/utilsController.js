const { ImgurClient } = require('imgur');
const handleError = require('../utils/handleError');
const handleSuccess = require('../utils/handleSuccess');

module.exports = {
  uploadImage: async (req, res, next) => {
    if (!req.files || !req.files.image)
      return handleError(res, next, { errors: { upload: '請上傳圖片' } })

    const { image } = req.files;

    let errors = {};
    if (image.size > 2000000)
      errors = { ...errors, size: '請選擇小於 2MB 的檔案' }
    if (!image.name.endsWith(".jpg") && !image.name.endsWith(".png"))
      errors = { ...errors, type: '僅限上傳 jpg 或 png 檔案' }
    if (Object.keys(errors).length > 0)
      return handleError(res, next, { errors })

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: image.data.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    handleSuccess(res, { imageLink: response.data.link })
  },
};