"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const AWS = require("aws-sdk");
const AtomicCounter = require("dynamodb-atomic-counter");
const config = require('../configurations/config.json');
class IndexRoute extends route_1.BaseRoute {
    constructor() {
        super();
        this.config = new AWS.Config(config);
        this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
        this.dynamoDb = new AWS.DynamoDB();
        this.atomic = AtomicCounter;
        this.atomic.config.update(this.config);
        this.options = {
            tableName: 'AtomicCounters',
            increment: 10
        };
    }
    static create(router) {
        console.log("[IndexRoute::create] Creating index route.");
        router.get("/:company/current", (req, res, next) => {
            new IndexRoute().get(req, res, next);
            0;
        });
        router.get("/:company/next", (req, res, next) => {
            new IndexRoute().getNext(req, res, next);
        });
    }
    index(req, res, next) {
        res.json(req.body);
    }
    get(req, res, next) {
        this.atomic.getLastValue(req.params.company)
            .done(function (value) { return res.json(100000000 + value); })
            .fail(function (err) {
            console.log(err);
            return res.json({ error: err });
        });
    }
    getNext(req, res, next) {
        this.atomic.increment(req.params.company, this.options)
            .done(function (value) {
            return res.json(100000000 + value);
        })
            .fail(function (err) {
            console.log(err);
            return res.json({ error: err });
        });
    }
    post(req, res, next) {
        res.json(this.atomic);
    }
}
exports.IndexRoute = IndexRoute;
