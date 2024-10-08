const express = require('express');
const router = express.Router();
const { db, genid } = require('../db/dbUtils');
const { CONSTRAINT } = require('sqlite3');
// 路由
router.get('/list', async (req, res) => {
    const select_sql ='select * from `category`';
    let { err, rows } = await db.async.all(select_sql, []);
    if (err == null) {
        res.send({
            code: 200,
            msg: '查询成功',
            rows//rows:rows
        });
    } else {
        res.send({
            code: 200,
            msg: '查询失败'
        });
    }
});

//删除/category/delete?id=1
router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id;
    const delete_sql = 'delete from `category` where `id`=?';
    console.log(id);
    let { err, rows } = await db.async.run(delete_sql, [id]);
    if (err == null) {
        res.send({
            code: 200,
            msg: '删除成功'
        });
    } else {
        res.send({
            code: 200,
            msg: '删除失败'
        });
    }
});

router.put('/_token/update', async (req, res) => {

    let { id,name } = req.body;
    const update_sql = 'update `category` set `name`=? where `id`=?';
    let { err, rows } = await db.async.run(update_sql, [name,id]);
    if (err == null) {
        res.send({
            code: 200,
            msg: '更新成功'
        });
    } else {
        res.send({
            code: 200,
            msg: '更新失败'
        });
    }

});

router.post('/_token/add', async (req, res) => {
    let { name } = req.body;
    const insert_sql = 'INSERT into `category` (`id`,`name`) VALUES(?,?)';
    let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name]);
    if (err == null) {
        res.send({
            code: 200,
            msg: '添加成功'
        });
    } else {
        res.send({
            code: 500,
            msg: '添加失败'
        });
    }

});


// async function  token(req,res){

// }
module.exports = router;