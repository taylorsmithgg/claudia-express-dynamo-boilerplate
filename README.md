### Setup
  Make sure there's a table named "AtomicCounters", with "id" (string) as the primary hash key, in your AWS account.
  /configurations/config.json - stores amazon credentials

### **<span style="color: red">Important!</span>**
  You must add `AmazonDynamoDBFullAccess` policy to your executor role.

### Permissions
  APIGatewayAdministrator
  IAMFullAccess (Creates role for svm-counter-executor)
  AmazonAPIGatewayAdministrator

### Build
#### First, make sure typescript is up to date
```
  npm i -g typescript
```

#### Then, build the project using either gulp or grunt
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
```
  npm run dev
```

### Convert Express to Serverless
```
  claudia generate-serverless-express-proxy --express-module dist/server
```

### Deploy (https://claudiajs.com/tutorials/installing.html)
```
  claudia create --handler lambda.handler --deploy-proxy-api --region us-east-1
```

### Update Deployment/Redeploy
``` 
  claudia update 
```

### Delete Deployment/Roles
### **<span style="color: red">Important!</span>**
  You must remove `AmazonDynamoDBFullAccess` policy from your executor role before running destroy.
```
  claudia destroy
```
