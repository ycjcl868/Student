var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var student = require('./routes/student');
var teacher = require('./routes/teacher');
var admin = require('./routes/admin');
var api = require('./routes/api');


var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('kylin'));
app.use(session({
  secret: 'ky',
  cookie:{maxAge: 600000}
}));
app.use(express.static(path.join(__dirname, 'public')));


//公共控制器
app.use('/', routes);
//教师控制器
app.use('/teacher',teacher);
//学生控制器
app.use('/student',student);
//管理员控制器
app.use('/admin',admin);
//api用于ajax接口
app.use('/api',api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // next(err);
  res.jsonp({status:-1});
  
});

app.listen(3003,function(){
  console.log('服务启动：http://localhost:3003');
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
