const handleError = (res, err) => {
  console.log(err);
  let error;
  if (err.errors) {
    [...Object.keys(err.errors)].forEach(el =>
      error = err.errors[el].properties?.message ?
        { ...error, [el]: err.errors[el].properties.message } :
        { ...error, [el]: err.errors[el].message }
    );
  } else if (err.kind === 'ObjectId' && err.name === 'CastError') {
    error = { message: 'id 有誤，請重新確認' }
  } else {
    error = err;
  }
  res.status(400).json({
    "status": "failed",
    "error": error
  })
  res.end();
}

module.exports = handleError;