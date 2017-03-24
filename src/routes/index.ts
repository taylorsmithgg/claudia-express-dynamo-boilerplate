import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as AWS from "aws-sdk";
import AtomicCounter = require('dynamodb-atomic-counter');
const config = require('../configurations/config.json');

interface Options {
  tableName?;
  keyAttribute?;
  countAttribute?;
  increment?;
  success?;
  error?;
  complete?;
  context?;
}

/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {

  private dynamoDbClient : AWS.DynamoDB.DocumentClient;
  private dynamoDb :  AWS.DynamoDB;
  private options: Options;
  private config: AWS.Config = new AWS.Config(config);
  private credentials: AWS.Credentials;
  private atomic;

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    this.dynamoDb = new AWS.DynamoDB();
    this.atomic = AtomicCounter;

    this.atomic.config.update(this.config);

    this.options = {
      tableName: 'AtomicCounters',
      increment: 10
    };
  }

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[IndexRoute::create] Creating index route.");

    router.get("/:company/current", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().get(req, res, next);0
    });

    router.get("/:company/next", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().getNext(req, res, next);
    });

    // router.post("/:company", (req: Request, res: Response, next: NextFunction) => {
    //   new IndexRoute().post(req, res, next);
    // });
  }

  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    // //set custom title
    // this.title = "Home | Tour of Heros";

    // //set options
    // let options: Object = {
    //   "message": "Welcome to the Tour of Heros"
    // };

    // //render template
    // this.render(req, res, "index", options);
    res.json(req.body);
  }

  public get(req: Request, res: Response, next: NextFunction){
      this.atomic.getLastValue(req.params.company)
        .done(function(value){ return res.json(100000000 + value); })
        .fail(function(err){
          console.log(err);
          return res.json({error: err}); 
        })
  }

  public getNext(req: Request, res: Response, next: NextFunction){
      this.atomic.increment(req.params.company, this.options)
        .done(function(value){
          return res.json(100000000 + value); 
        })
        .fail(function(err){
          console.log(err);
          return res.json({error: err}); 
        })
  }

  public post(req: Request, res: Response, next: NextFunction){
    res.json(this.atomic);
  }
}
