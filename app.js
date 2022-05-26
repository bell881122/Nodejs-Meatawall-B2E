const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileupload = require("express-fileupload");
const handleResponse = require('./utils/handleResponse');
require('./connections/mongoose');

const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const utilsRouter = require('./routes/utilsRouter');

// 程式重大錯誤
process.on('uncaughtException', err => {
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

// 未捕捉的 promise 錯誤
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉的 Promise Rejection：', err);
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

app.use('/api/', postRouter);
app.use('/api/', userRouter);
app.use('/api/', utilsRouter);

app.use((req, res) => {
  handleResponse.routerNotFound(res);
});

app.use((err, req, res, next) => {
  if (err.isOperational) {
    handleResponse.operationalRes(res, err);
  } else {
    if (process.env.NODE_ENV === 'dev')
      handleResponse.devRes(res, err);
    else
      handleResponse.productionRes(res, err);
  }
})

module.exports = app;