"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var logger = require("morgan");
var errorHandler = require("errorhandler");
var methodOverride = require("method-override");
var index_1 = require("./routes/index");
var Server = (function () {
    function Server() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.api = function () {
    };
    Server.prototype.config = function () {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        index_1.IndexRoute.create(router);
        this.app.use(router);
    };
    return Server;
}());
exports.Server = Server;
module.exports['bootstrap'] = Server.bootstrap().app;
//# sourceMappingURL=server.js.map