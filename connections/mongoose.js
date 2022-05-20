const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' })
let url = process.env.DATABASE;
const dbName = 'metaWall-test';
url = url.replace('<password>', process.env.DATABASE_PASSWORD)
url = url.replace('<dbName>', dbName)

mongoose
  .connect(url)
  .then(() => console.log('資料庫連接成功'))
  .catch(error => console.log(error));