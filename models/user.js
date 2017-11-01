var mongodb = require('./db');

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.telephone = user.telephone;
    this.email = user.email;
}

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
    var user = {
        username: this.username,
        password: this.password,
        telephone: this.telephone,
        email: this.email
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(user, { safe: true }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
}

//读取用户信息
User.get = function (username, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({ username: username }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
}

//修改用户信息
User.prototype.modify = function (callback) {
    var user = {
        username: this.username,
        telephone: this.telephone,
        email: this.email
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({ 'username': user.username }, 
                                { $set: { 'telephone': user.telephone, 'email': user.email } }, 
                                function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
}
//删除用户账户
User.del = function (username, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.remove({ 'username': username }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}
