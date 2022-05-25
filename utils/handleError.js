const handleError = (res, next, err, statusCode) => {
  let errors = {};
  console.log(err)

  // 處理 mongoose error
  if (err.errors) {
    [...Object.keys(err.errors)].forEach(el => {
      errors = err.errors[el].properties?.message ?
        { ...errors, [el]: err.errors[el].properties.message } :
        err.errors[el].message ?
          { ...errors, [el]: err.errors[el].message } :
          { ...errors, [el]: err.errors[el] }
    });
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0] === 'email') {
    errors = {
      ...errors,
      [Object.keys(err.keyValue)]: '已有該帳號，請重新確認'
    }
  }

  // 自訂 error
  if (err.kind) {
    if (err.kind === 'ObjectId' && err.name === 'CastError') {
      errors = { ...errors, id: 'id 有誤，請重新確認' }
    } else {
      errors = { ...errors, [err.kind]: err.message }
    }
  }

  const error = new Error();
  error.status = statusCode || 400;
  error.isOperational = true;
  error.errors = errors;

  next(error);
}

module.exports = handleError;