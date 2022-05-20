const handleError = (res, err) => {
  console.log(err);
  let error;
  if (err.errors) {
    [...Object.keys(err.errors)].forEach(el =>
      error = err.errors[el].properties?.message ?
        { ...error, [el]: err.errors[el].properties.message } :
        { ...error, [el]: err.errors[el].message }
    );
  } else {
    error = err;
  }
  res.status(400).json({
    "status": "failed",
    "error": error
  })
}

module.exports = handleError;