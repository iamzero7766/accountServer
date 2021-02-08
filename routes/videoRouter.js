var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var async = require("async");


var db = require("../config/db");
var querySql = require("../config/videoSql");
var pool = mysql.createPool(db.mysql);
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var responseJSON = function(res,ret){
    if(typeof ret == 'undefined'){
        res.json({code:"-200",msg:"操作失败"});
    }else{
        res.json(ret);
    }
};



router.post("/query", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var list = []
        var params = req.body;
        console.log(params);
        for(var i = 1; i < 10; i ++) {
            var result = {
                id: i,
                list: []
            };
            list.push(result);
        }
        async.map(
            list,
            (el, callback) => {
                connection.query(querySql.query, [el.id, 0, 10], function (err, result0) {
                    if (err) throw err;
                    el.list = result0;
                    callback(null, el);
                });
                return el;
            },
            (err, result) => {
                var code = {
                    status: 1,
                    info: result
                };
                responseJSON(res, code);
                connection.release();
            }
        );
    })
});

router.post("/add", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var params = req.body;
        console.log(params);
        connection.query(querySql.add, [params.user_id, params.video_url, params.video_image, params.video_info, params.video_title, params.dt_create, params.video_type], function (err, result) {
            if(err) {
                console.log(err);
                return;
            }
            var code = {
                status: 1,
                info: result
            };
            responseJSON(res, code);
            connection.release();
        })
    })
});

router.post("/queryByID", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var params = req.body;
        console.log(params);
        connection.query(querySql.queryByID, params.id, function (err, result) {
            if(err) {
                console.log(err);
                return;
            }
            var code = {
                status: 1,
                info: result
            };
            responseJSON(res, code);
            connection.release();
        })
    })
});


module.exports = router;
