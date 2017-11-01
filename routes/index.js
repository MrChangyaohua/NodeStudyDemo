var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', checkNotLogin);
router.get('/', function (req, res, next) {
  res.render('login');
});

router.get('/index', checkNotLogin);
router.get('/index', function (req, res, next) {
  res.render('login');
});

router.get('/login', checkNotLogin);
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/register', checkNotLogin);
router.get('/register', function (req, res, next) {
  res.render('register');
});

//注册事件处理
router.post('/register_action', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var verify_password = req.body.verify_password;

  if (0 == username.length) {
    return res.render('register', { message: "用户名不能为空" });
  }

  if (0 == password.length) {
    return res.render('register', { message: "密码不能为空" });
  }
  if (3 > password.length) {
    return res.render('register', { message: "密码至少为三位" });
  }
  if (verify_password != password) {
    return res.render('register', { message: "两次密码输入不一致" });
  }
  // 生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
    password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
    username: username,
    password: password,
    telephone: req.body.telephone,
    email: req.body.email
  });
  //检查用户名是否已经存在
  var whereStr = { 'username': username };
  User.findOne(whereStr, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.render('register', { message: "此用户已存在" });
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        return next(err);
      }
      //用户信息存入session
      req.session.user = newUser;
      res.render('login', { message: "注册成功，请登录" });
    });
  });
});

//登录事件处理
router.post('/login_action', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  //检查用户名是否已经存在
  var whereStr = { 'username': username };
  User.findOne(whereStr, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', { message: "用户不存在" });
    }
    // 生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    //检查密码是否一致
    if (password != user.password) {
      return res.render('login', { message: "密码错误，请重新输入" });
    }
    //用户信息存入session
    req.session.user = user;
    res.render('user_info', {
      message: "登录成功,欢迎您：" + user.username,
      user: req.session.user
    });
  });
});

/* 用户信息修改页面跳转 */
router.get('/user_info_modify', function (req, res) {
  var user = req.session.user;
  if (user) {
    return res.render('user_info_modify', { user: user });
  }
});

/* 用户信息修改事件处理 */
router.post('/user_info_modify_action', function (req, res) {
  var modifyUser = new User({
    username: req.body.username,
    telephone: req.body.telephone,
    email: req.body.email
  });
  //修改用户信息数据库操作
  var whereStr = {'username':req.body.username};
  var modifyStr = {
    username: req.body.username,
    telephone: req.body.telephone,
    email: req.body.email 
  };
  User.update(whereStr, modifyStr, function (err, user) {
    if (err) {
      return next(err);
    }
    //用户信息存入session
    req.session.user = modifyUser;
    res.render('user_info', { message: "用户信息修改成功，用户：" + req.body.username, user: modifyUser });
  });
});

/* 用户删除事件处理 */
router.get('/user_delete_action', function (req, res) {
  var username = req.session.user.username;
  var whereStr = {'username':username};
  User.remove(whereStr, function (err) {
    if (err) {
      return rnext(err);
    } 
    //清除用户session
    req.session.user = null;
    res.render('login', { message: "" + username + ",您的账户已删除" });
  });
});

//注销事件处理
router.get('/logout', function (req, res) {
  req.session.user = null;
  res.render('login', { message: "安全登出" });
});

//检测用户是否已经登录成功
function checkNotLogin(req, res, next) {
  var user = req.session.user;
  if (user) {
    return res.render('user_info', { message: "已登录，用户：" + user.username, user: user });
  }
  next();
}

module.exports = router;
