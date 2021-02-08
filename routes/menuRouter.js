var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var async = require("async");


var db = require("../config/db");
var querySql = require("../config/menuSql");
var pool = mysql.createPool(db.mysql);
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var responseJSON = function(res,ret){
    if(typeof ret == 'undefined'){
        res.json({code:"-200",msg:"操作失败"});
    }else{
        res.json(ret);
    }
};



router.post("/add", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var params = req.body;
        console.log(params);
        connection.query(querySql.add, [params.user_id, params.menu], function (err, result) {
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

router.post("/query", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var params = req.body;
        console.log(params);
        connection.query(querySql.query, params.id, function (err, result) {
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

router.post("/update", urlencodedParser, function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        var params = req.body;
        console.log(params);
        connection.query(querySql.update, [params.menu, params.user_id], function (err, result) {
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
