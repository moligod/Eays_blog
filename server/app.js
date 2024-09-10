const express = require('express');
const multer = require("multer")
const path = require('path');
const { db, genid } = require('./db/dbUtils');
const app = express();
const port = 8080;
//开放跨域请求
app.use(function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
  else next();
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