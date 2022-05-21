const handleSuccess = (res, data) => {
  console.log('success')
  res.send({
    "status": "success",
    ...data
  })
  res.end();
}

module.exports = handleSuccess;