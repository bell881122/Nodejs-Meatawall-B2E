module.exports = {
  routerNotFound: (res) => {
    res.status(404).json({
      status: 'error',
      message: '無此路由資訊',
    });
  },
  operationalRes: (res, err) => {
    res.status(err.status).json({
      status: 'failed',
      error: err,
    })
  },
  devRes: (res, err) => {
    res.status(err.status || 500).json({
      status: 'failed',
      name: err.name,
      message: err.message,
      stack: err.stack
    })
  },
  productionRes: (res, err) => {
    res.status(500).send({
      status: 'error',
      message: '網站發生錯誤，請稍後再試'
    })
  },
};