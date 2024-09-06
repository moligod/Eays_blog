const express = require('express');
const router = express.Router();
const { db, genid } = require('../db/dbUtils');
const { route } = require('./CategoryRouter');


router.post('/_token/add', async (req, res) => {
    let { title, categoryid, content } = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime();
    const insert_sql = 'insert into `blog` (`id`,`title`,`category_id`,`content`,`create_time`) values(?,?,?,?,?)';

    let params = [id, title, categoryid, content, create_time];

    let { err, rows } = await db.async.run(insert_sql, params);

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
})

router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id;

    const delete_sql = 'delete from `blog` where `id`=?';
    let { err, rows } = await db.async.run(delete_sql, [id]);
    if (err == null) {
        res.send({
            code: 200,
            msg: '删除成功'
        });
    }
    else {
        res.send({
            code: 500,
            msg: '删除失败'
        });
    }

})

router.put('/_token/update', async (req, res) => {
    let { id, title, categoryid, content } = req.body;
    const update_sql = 'update `blog` set `title`=?,`category_id`=?,`content`=? where `id`=?';
    let params = [title, categoryid, content, id];
    let { err, rows } = await db.async.run(update_sql, params);
    if (err == null) {
        res.send({
            code: 200,
            msg: '更新成功'
        });
    } else {
        res.send({
            code: 500,
            msg: '更新失败'
        });
    }
})

router.get('/list', async (req, res) => {
    const select_sql = 'select * from `blog`';
    let { err, rows } = await db.async.all(select_sql, [])
    if (err == null) {
        res.send({
            code: 200,
            msg: '查询成功',
            rows
        });
    } else {
        res.send({
            code: 500,
            msg: '查询失败'
        });
    }
})
router.get('/search', async (req, res) => {
    /**     
     * keyworld 关键字
     * categoryid 分类id
     * 
     * 分页：
     * page 页码
     * pageSize 每页显示的条数
     */
    let { keyword,categoryid, page, pageSize } = req.query;
    //默认值
    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize;
    categoryid = categoryid == null ? 0 : categoryid;
    keyword = keyword == null ? '' : keyword;
    console.log(categoryid, keyword, page, pageSize);
    //查询条件，参数
    let params = [];
    //查询条件，sql
    let whereSqls = [];
    //分类条件
    if (categoryid != 0) {
        whereSqls.push('`category_id`=?');
        params.push(categoryid);
    }
    //关键字条件
    if (keyword != '') {
        whereSqls.push('(`title` like ? OR ``content` like ?)');
        //两个条件，可以用一个参数
        params.push('%' + keyword + '%');
        params.push('%' + keyword + '%');
    }
    //拼接查询条件
    let whereSqlStr = '';
    if (whereSqls.length > 0) {
        whereSqlStr = 'where ' + whereSqls.join(' and ');
    }
    //分页，查询blog+条件+分页（按照createtime时间进行降序排序，并且限制查询结果，第一个值是偏移量，第二个值是偏移量+最大值，返回这两个区间的值）
    let searchSql = "select * from `blog`" + whereSqlStr + " ORDER BY `create_time` DESC limit ?,?";
    //查询条件（原查询条件+拼接分页条件）
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]);

    //查询数据总数
    let searchCountSql = "select count(*) from `blog`" + whereSqlStr;
    //查询数据总数的条件
    let searchCountParams = params;

    //分页数据
    let searchResult = await db.async.all(searchSql, searchSqlParams);
    //总数
    let CountResult = await db.async.all(searchCountSql, searchCountParams);

    console.log(CountResult);

    //查询成功
    if (searchResult.err == null && CountResult.err == null) {
        res.send({
            code: 200,
            msg: '查询成功',
            data: {
                keyword,
                categoryid,
                page,
                pageSize,
                rows: searchResult.rows,
                count: CountResult.rows[0]["count(*)"]
            }
        });
    }
    else {
        res.send({
            code: 500,
            msg: '查询失败'
        });
    }
})

module.exports = router;
