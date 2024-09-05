const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Genid = require('../utils/SnowFlake');
//设置连接数据库
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"));
//设置机器码
const genid = new Genid({WorkerId:1});

db.async = {}
//封装查询方法，sql是sql语句，parms是查询参数的数组
db.async.all = (sql, parms) => {
    //返回一个promise对象,resolve表示成功，reject表示失败
    return new Promise((resolve, reject) => {
        //err错误信息，rows查询结果
        db.all(sql, parms, (err, rows) => {
            //操作完成时调用
            resolve({ err, rows });
        }
        )
    })
}

db.async.run = (sql, parms) => {
    //返回一个promise对象,resolve表示成功，reject表示失败
    return new Promise((resolve, reject) => {
        //err错误信息，rows查询结果
        db.run(sql, parms, (err, rows) => {
            //操作完成时调用
            resolve({ err, rows });
        }
        )
    })
}

module.exports = { db, genid }
