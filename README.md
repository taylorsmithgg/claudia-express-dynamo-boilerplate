Setup
  Make sure there's a table named "AtomicCounters", with "id" (string) as the primary hash key, in your AWS account.
  /private/config.json - stores amazon credentials

Permissions
  APIGatewayAdministrator
  IAMFullAccess (Creates role for svm-counter-executor)
  AmazonDynamoDBFullAccess
  AmazonAPIGatewayAdministrator

Build
  grunt

Run
  npm run dev

Convert Express to Serverless
  claudia generate-serverless-express-proxy --express-module dist/server

Important: in server.js
  ```module.exports = Server.bootstrap().app;```

Deploy (https://claudiajs.com/tutorials/installing.html)
  claudia create --handler lambda.handler --deploy-proxy-api --region us-east-1

Update Deployment/Redeploy
  claudia update
