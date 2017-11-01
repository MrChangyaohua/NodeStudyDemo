var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    telephone: { type: String, default: '未填写' },
    email: { type: String, default: '未填写' }
});


module.exports = mongoose.model('User', UserSchema);