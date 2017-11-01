var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var settings = require('./settings');

//连接monggoDB数据库
var db = require('./models/db');

var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,  
  saveUninitialized: true,
  secret: settings.cookieSecret,
  //cookie name
  key: settings.db,
  //30 days
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
}));


//连接数据库到路由件
app.use(function (req, res, next) {
  req.db = db;
  next();
});



app.use('/', index);
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err });
  console.log(err);
});

module.exports = app;
