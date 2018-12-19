const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const moment = require("moment");

/**
 * Get dir id by dir name
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} dirName An name of dir.
 * @return {integer} An number of file dirId.
 */

async function getDirIdByName(auth, dirName) {
  const drive = google.drive({ version: "v3", auth });

  try {
    const res = await drive.files.list({
      fields: "nextPageToken, files(id, name, modifiedTime)",
      q: `name = '${dirName}'`
    });

    return res.data.files[0].id;
  } catch (err) {
    console.log("The API returned an error: " + err);
  }
}

/**
 * Lists all files under given dir including sub dir.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {integer} dirId An number of file dirId.
 * @param {array} files An array of files.
 * @return {array} files An array of files.
 */
async function listFiles(auth, dirId, files) {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files
    .list({
      pageSize: 100,
      fields:
        "files(id, name, mimeType, modifiedTime, parents, webViewLink, iconLink)",
      q: `'${dirId}' in parents and trashed = false`
    })
    .catch(err => {
      console.log("The API returned an error: " + err);
    });

  const newFiles = res.data.files;

  for (let i = 0; i < newFiles.length; i++) {
    if (
      newFiles[i] &
      (newFiles[i].mimeType == "application/vnd.google-apps.folder")
    ) {
      listFiles(auth, newFiles[i].id, files);
    } else {
      files.push(newFiles[i]);
    }
  }

  return files;
}

async function getFilesByUpdatedInGivenMinutes(auth, rootDirId, minutes) {
  const files = await listFiles(auth, rootDirId, []);

  const newFiles = [];
  const thresholdTime = moment().subtract(minutes * 60, "seconds");
  files.forEach(file => {
    if (moment(file.modifiedTime) >= thresholdTime) {
      newFiles.push(file);
    }
  });
  return newFiles;
}

async function createDirHierarchy(auth, file, rootDirId) {
  let fileTmp = file;
  const parents = [];
  while (fileTmp.parents[0] !== rootDirId) {
    const parent = await getFileById(auth, fileTmp.parents[0]);
    parents.push(parent.name);
    fileTmp = parent;
  }
  parents.push((await getFileById(auth, rootDirId)).name);
  parents.reverse().push(file.name);
  return parents.join("/");
}

async function getFileById(auth, id) {
  const drive = google.drive({ version: "v3", auth });
  const res = await drive.files.get({
    fileId: id,
    fields: "*"
  });
  return res.data;
}

module.exports.getDirIdByName = getDirIdByName;
module.exports.createDirHierarchy = createDirHierarchy;
module.exports.getFilesByUpdatedInGivenMinutes = getFilesByUpdatedInGivenMinutes;
module.exports.listFiles = listFiles;
module.exports.getFileById = getFileById;
