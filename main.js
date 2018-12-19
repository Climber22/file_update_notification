const fileManipulater = require("./src/fileManipulater.js");
const authorizer = require("./src/authorizer.js");
const slackAPI = require("./src/slackAPIWrapper.js");

require("dotenv").config();

async function main() {
  // Load client secrets from a local file.
  try {
    // Authorize a client with credentials, then call the Google Drive API.
    const auth = await authorizer.authorize();
    const rootDirId = await fileManipulater.getDirIdByName(auth, "PLUSPACE");

    const files = await fileManipulater.getFilesByUpdatedInGivenMinutes(
      auth,
      rootDirId,
      10
    );

    if (files.length == 0) return;

    const attachments = await Promise.all(
      files.map(async file => {
        const filePath = await fileManipulater.createDirHierarchy(
          auth,
          file,
          rootDirId
        );

        return await slackAPI.buildJSONForAttachments(file, filePath);
      })
    );

    slackAPI.postSlack(attachments);
  } catch (err) {
    console.log("Error loading client secret file:", err);
  }
}

main();
