var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
// var upload = multer({ dest: './upload'});
var createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};
var uploadFoler = "./upload";
createFolder(uploadFoler);

// 磁盘存贮
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFoler );// 他会放在当前目录下的 /upload 文件夹下（没有该文件夹，就新建一个）
    },
    filename: function (req, file, cb) {// 在这里设定文件名
        cb(null, file.originalname );
    }
});
var upload = multer({ storage: storage })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var videoRouter = require('./routes/videoRouter.js');
var menuRouter = require("./routes/menuRouter");

var app = express();
//设置跨域访问
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    // //允许的header类型
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    // //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // 可以带cookies
    res.header("Access-Control-Allow-Credentials", true);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./upload'));


app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/video', videoRouter);
app.use('/menu', menuRouter);

app.post('/upload', upload.any(), function (req, res) {
    console.log(req);
    let defaultPath = './upload/';
    let getRandomID = () => Number(Math.random().toString().substr(4, 10) + Date.now()).toString(36);

    let filePath = req.files[0].path;
    let backName = filePath.split('.')[1];
    let oldPath = filePath.split('\\')[filePath.split('\\').length - 1];
    let newPath = `${getRandomID()}.${backName}`;
    console.log(filePath);
    console.log(backName);
    console.log(oldPath);
    console.log(newPath);
    fs.rename(defaultPath + oldPath, defaultPath + newPath, (err) => {//fs.rename重命名
        if (!err) {
            newPath = `http://localhost:3000/${newPath}`;
            res.json({ flag: true, path: newPath });
        } else {
            console.log(err);
            res.json({ flag: false, path: '' });
        }
    });

    // console.dir(req.files);
    // res.send(req.files[0].path);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(upload.any());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req,res){
    res.write("The response from server");
    res.end();
});

module.exports = app;
