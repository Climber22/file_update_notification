const fileManipulater = require("./src/fileManipulater.js");
const authorizer = require("./src/authorizer.js");
const slackAPI = require("./src/slackAPIWrapper.js");

require("dotenv").config();

async function main() {
  // Load client secrets from a local file.
  try {
    // Authorize a client with credentials, then call the Google Drive API.
    const auth = await authorizer.authorize();
    const rootDir = await fileManipulater.getDirByName(auth, "PLUSPACE全社");

    const files = await fileManipulater.listFiles(auth, rootDir.id, []);
    const updatedFiles = await fileManipulater.getFilesByUpdatedInGivenMinutes(
      auth,
      files,
      15
    );
    var updatedFilesUniq = updatedFiles.filter(function(x, i, self) {
      return self.indexOf(x) === i;
    });

    if (updatedFiles.length == 0) return;

    const attachments = updatedFilesUniq.map(file => {
      const filePath = fileManipulater.createDirHierarchy(file, files, rootDir);

      return slackAPI.buildJSONForAttachments(file, filePath);
    });

    slackAPI.postSlack(attachments);
  } catch (err) {
    console.log("Error loading client secret file:", err);
  }
}

main();
