const express = require('express');
const router = express.Router();
const { db, genid } = require('../db/dbUtils');
// 路由
router.get('/test', async(req, res) => {
    //查询db数据空中的admin表，[]是参数化查询，防止sql注入
    db.all('select * from admin', [],(err, rows) => {
        console.log(rows);
    });
    //promise查询方法
    db.async.all('select * from admin', []).then((result) => {
        console.log(result.rows);
    });
    //async/await查询方法
    let out = await db.async.all('select * from admin', []);
    res.send({
        id: genid.NextId(),
        //可以简写成out
        out: out
    })
});

module.exports = router;