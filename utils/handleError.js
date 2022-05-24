const handleError = (res, err) => {
  let errors = {};

  // 處理 mongoose error
  if (err.errors) {
    [...Object.keys(err.errors)].forEach(el => {
      errors = err.errors[el].properties?.message ?
        { ...errors, [el]: err.errors[el].properties.message } :
        { ...errors, [el]: err.errors[el].message }
    });
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
  error.status = 400;
  error.isOperational = true;
  error.errors = errors;

  res.status(400).json({
    "status": "failed",
    error
  })
}

module.exports = handleError;