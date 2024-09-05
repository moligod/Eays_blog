const express = require('express');
const multer = require("multer")
const path = require('path');
const { db, genid } = require('./db/dbUtils');
const app = express();
const port = 8080;
// 解决跨域问题
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'DELETE,GET,POST,PUT,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else next();
});
// 解析请求体
app.use(express.json());
// 解析请求参数
const update = multer({ dest: './public/upload/temp' })
app.use(update.any());

//token验证
const ADMIN_TOKEN_PATH = '/_token'
app.all("*", async (req, res, next) => {
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    let { token } = req.headers;
    console.log(token);
    let admin_token_sql = 'select * from `admin` where `token`=?';
    let adminResult = await db.async.all(admin_token_sql, [token]);
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: '请先登录'
      });
      return
    } else {
      next();
    }
  } else {
    next();
  }
})

// 静态资源路径
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/test', require('./routers/TestRouter'));
app.use('/admin', require('./routers/AdminRouter'));
app.use('/category', require('./routers/CategoryRouter'));
app.use('/blog', require('./routers/BlogRouter'));
app.use('/upload', require('./routers/UploadRouter'));
// 路由
app.listen(port, () => {
  console.log(`启动成功： http://localhost:${port}`);
});