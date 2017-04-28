'use strict'
try {
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./dist/server')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
} catch(e) {
    console.log(e);
}