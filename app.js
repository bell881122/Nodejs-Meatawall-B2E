const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./connections/mongoose');

const postRouter = require('./routes/postRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', postRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: "無此路由資訊",
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({
    status: 'error',
    message: '網站發生錯誤，請稍後再試'
  })
})

module.exports = app;