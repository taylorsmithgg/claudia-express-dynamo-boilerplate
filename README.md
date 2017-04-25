### Setup
  Make sure there's a table named "AtomicCounters", with "id" (string) as the primary hash key, in your AWS account.
  /configurations/config.json - stores amazon credentials

### Permissions
  APIGatewayAdministrator
  IAMFullAccess (Creates role for svm-counter-executor)
  AmazonDynamoDBFullAccess
  AmazonAPIGatewayAdministrator

### Build
#### First, make sure typescript is up to date
  ```
  npm i -g typescript
  ```

#### Then  
  ```
  npm i
  ```

  ```
  gulp
  ```

  or (depending on your preference)

  ```
  grunt
  ```

### Run w/Hot Reload
  `npm run dev`

### Convert Express to Serverless
  `claudia generate-serverless-express-proxy --express-module dist/server`

### Deploy (https://claudiajs.com/tutorials/installing.html)
  `claudia create --handler lambda.handler --deploy-proxy-api --region us-east-1`

### Update Deployment/Redeploy
  `claudia update`
