require("dotenv").config();
const { exec } = require("child_process");

const client_id = process.env.DRIVE_CLIENT_ID;
const client_secret = process.env.DRIVE_CLIENT_SECRET;
const redirect_uri = process.env.DRIVE_REDIRECT_URI;
const slack_webhook_url = process.env.SLACK_WEBHOOK_URL;

exec(`heroku config:set DRIVE_CLIENT_ID=${client_id}`);
exec(`heroku config:set DRIVE_CLIENT_SECRET=${client_secret}`);
exec(`heroku config:set DRIVE_REDIRECT_URI=${redirect_uri}`);
exec(`heroku config:set SLACK_WEBHOOK_URL=${slack_webhook_url}`);
