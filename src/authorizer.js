const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize() {
  const client_id = process.env.DRIVE_CLIENT_ID;
  const client_secret = process.env.DRIVE_CLIENT_SECRET;
  const redirect_uri = process.env.DRIVE_REDIRECT_URI;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri
  );

  // Check if we have previously stored a token.
  try {
    const token = fs.readFileSync(TOKEN_PATH, { encoding: "utf-8" });
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (error) {
    getAccessToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: process.env.DRIVE_SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", async code => {
    rl.close();
    const token = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token.tokens), err => {
      if (err) console.error(err);
      console.log("Token stored to", TOKEN_PATH);
    });
    return oAuth2Client;
  });
}

module.exports.authorize = authorize;
// module.exports.getAccessToken = getAccessToken;
