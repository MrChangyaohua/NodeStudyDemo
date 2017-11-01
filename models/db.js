var setting = require("../settings");
var mongdb = require("mongodb");
var Db = mongdb.Db;
var Connection = mongdb.Connection;
var Server = mongdb.Server;

module.exports = new Db(setting.db, new Server(setting.host, setting.port),{safe:true});