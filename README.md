# File update notification

## What this script does

- Watch files under given dir, and if there is the file which is updated in 15 minutes, send notification to slack.

## Where this script is hosted

- heroku

## How to start to use

- At first, you have to get 'credentials.json' by following this page.
  - https://developers.google.com/drive/api/v3/quickstart/nodejs
- Once you've got credential, you have to set them as env variables(use dotenv).  
  The list of env variables name are below.
  - DRIVE_CLIENT_ID
  - DRIVE_PROJECT_ID
  - DRIVE_AUTH_URL
  - DRIVE_TOKEN_URL
  - DRIVE_AUTH_PROVIDER_X509_CERT_URL
  - DRIVE_CLIENT_SECRET
  - DRIVE_SCOPES
  - DRIVE_REDIRECT_URI
- Run `node main.js`  
  You will get error and ask to click link for allow access to drive from code.  
  After you allow, you'll get the auth-code to paste terminal.
  Then first set up will complete and make token.json
- Set env variables at token.json.  
  To make be able to work at Heroku, you have to set env variables at token.json too.

- Run `node scripts/setEnvs.js`  
  By running this command, the env variables are set as env variables of Heroku.

when you update code, you should run `git push heroku master` to deploy latest version to Heroku
