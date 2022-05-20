const handleSuccess = (res, data) => {
  res.send({
    "status": "success",
    ...data
  })
}

module.exports = handleSuccess;