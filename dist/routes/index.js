"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var route_1 = require("./route");
var AWS = require("aws-sdk");
var AtomicCounter = require("dynamodb-atomic-counter");
var config = require('../../private/config.json');
/**
 * / route
 *
 * @class User
 */
var IndexRoute = (function (_super) {
    __extends(IndexRoute, _super);
    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    function IndexRoute() {
        var _this = _super.call(this) || this;
        _this.config = new AWS.Config(config);
        _this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
        _this.dynamoDb = new AWS.DynamoDB();
        _this.atomic = AtomicCounter;
        _this.atomic.config.update(_this.config);
        _this.options = {
            tableName: 'AtomicCounters',
            increment: 10
        };
        return _this;
    }
    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    IndexRoute.create = function (router) {
        //log
        console.log("[IndexRoute::create] Creating index route.");
        router.get("/:company/current", function (req, res, next) {
            new IndexRoute().get(req, res, next);
            0;
        });
        router.get("/:company/next", function (req, res, next) {
            new IndexRoute().getNext(req, res, next);
        });
        // router.post("/:company", (req: Request, res: Response, next: NextFunction) => {
        //   new IndexRoute().post(req, res, next);
        // });
    };
    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    IndexRoute.prototype.index = function (req, res, next) {
        // //set custom title
        // this.title = "Home | Tour of Heros";
        // //set options
        // let options: Object = {
        //   "message": "Welcome to the Tour of Heros"
        // };
        // //render template
        // this.render(req, res, "index", options);
        res.json(req.body);
    };
    IndexRoute.prototype.get = function (req, res, next) {
        this.atomic.getLastValue(req.params.company)
            .done(function (value) { return res.json(100000000 + value); })
            .fail(function (err) {
            console.log(err);
            return res.json({ error: err });
        });
    };
    IndexRoute.prototype.getNext = function (req, res, next) {
        this.atomic.increment(req.params.company, this.options)
            .done(function (value) {
            return res.json(100000000 + value);
        })
            .fail(function (err) {
            console.log(err);
            return res.json({ error: err });
        });
    };
    IndexRoute.prototype.post = function (req, res, next) {
        res.json(this.atomic);
    };
    return IndexRoute;
}(route_1.BaseRoute));
exports.IndexRoute = IndexRoute;
