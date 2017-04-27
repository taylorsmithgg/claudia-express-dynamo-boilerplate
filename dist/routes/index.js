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
var config = require('../configurations/config.json');
/**
 * Default name of the DynamoDB table where the atomic counters will be stored.
 */
var DEFAULT_TABLE_NAME = 'AtomicCounters';
/**
 * Default attribute name that will identify each counter.
 */
var DEFAULT_KEY_ATTRIBUTE = 'id';
/**
 * Default attribute name of the count value attribute.
 * The count attribute indicates the "last value" used in the last increment operation.
 */
var DEFAULT_COUNT_ATTRIBUTE = 'lastValue';
/**
 * Default increment value.
 */
var DEFAULT_INCREMENT = 1;
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
        _this.dynamo = new AWS.DynamoDB(config);
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
        var request = {
            Key: { id: { 'S': req.params.company } },
            TableName: 'AtomicCounters'
        };
        return this.dynamo.getItem(request, function (err, data) {
            if (err) {
                console.log(err); // an error occurred
                return res.json({ error: err });
            }
            else {
                console.log(data); // successful response
                res.json(100000000 + parseInt(data.Item.lastValue.N));
            }
            return next();
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
    IndexRoute.prototype.getLastValue = function (counterId) {
        var request;
        var keyAttribute = config.keyAttribute || DEFAULT_KEY_ATTRIBUTE;
        var countAttribute = config.countAttribute || DEFAULT_COUNT_ATTRIBUTE;
        var params = {
            Key: {},
            AttributesToGet: [countAttribute],
            TableName: config.tableName || DEFAULT_TABLE_NAME
        };
        params.Key[keyAttribute] = { S: counterId };
    };
    return IndexRoute;
}(route_1.BaseRoute));
exports.IndexRoute = IndexRoute;
