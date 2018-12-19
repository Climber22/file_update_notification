require("dotenv").config();
const { exec } = require("child_process");

const client_id = process.env.DRIVE_CLIENT_ID;
const client_secret = process.env.DRIVE_CLIENT_SECRET;
const redirect_uri = process.env.DRIVE_REDIRECT_URI;
const scopes = process.env.DRIVE_SCOPES;

const access_token = process.env.DRIVE_ACCESS_TOKEN;
const refresh_token = process.env.DRIVE_REFRESH_TOKEN;
const token_type = process.env.TOKEN_TYPE;
const expiry_date = process.env.DRIVE_EXPIRY_DATE;

const slack_webhook_url = process.env.SLACK_WEBHOOK_URL;

exec(`heroku config:set DRIVE_CLIENT_ID=${client_id}`);
exec(`heroku config:set DRIVE_CLIENT_SECRET=${client_secret}`);
exec(`heroku config:set DRIVE_REDIRECT_URI=${redirect_uri}`);
exec(`heroku config:set DRIVE_SCOPES=${scopes}`);

exec(`heroku config:set DRIVE_ACCESS_TOKEN=${access_token}`);
exec(`heroku config:set DRIVE_REFRESH_TOKEN=${refresh_token}`);
exec(`heroku config:set DRIVE_TOKEN_TYPE=${token_type}`);
exec(`heroku config:set DRIVE_EXPIRY_DATE=${expiry_date}`);

exec(`heroku config:set SLACK_WEBHOOK_URL=${slack_webhook_url}`);
