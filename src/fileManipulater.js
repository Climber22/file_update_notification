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

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function getDirByName(auth, dirName) {
  const drive = google.drive({ version: "v3", auth });

  try {
    const res = await drive.files.list({
      fields: "nextPageToken, files(id, name, modifiedTime)",
      q: `name = '${dirName}'`
    });

    return res.data.files[0];
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

  await sleep(5000);
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

  if (newFiles.length == 0) return files;
  for (let i = 0; i < newFiles.length; i++) {
    const tmp = [];
    if (
      newFiles[i] !== undefined &&
      newFiles[i].mimeType == "application/vnd.google-apps.folder"
    ) {
      const children = await listFiles(auth, newFiles[i].id, files);
      if (children.length > 0) {
        Array.prototype.push.apply(tmp, children);
      }
    }
    files.push(newFiles[i]);

    if (i == newFiles.length - 1) {
      Array.prototype.push.apply(files, tmp);
    }
  }
  return files;
}

async function getFilesByUpdatedInGivenMinutes(auth, files, minutes) {
  const newFiles = [];
  const thresholdTime = moment().subtract(minutes * 60, "seconds");
  files.forEach(file => {
    if (moment(file.modifiedTime) >= thresholdTime) {
      newFiles.push(file);
    }
  });
  return newFiles;
}

function createDirHierarchy(file, files, rootDir) {
  let fileTmp = file;
  const parents = [];
  while (fileTmp.parents[0] !== rootDir.id) {
    const parent = getParent(fileTmp, files);
    parents.push(parent.name);
    fileTmp = parent;
  }
  parents.push(rootDir.name);
  parents.reverse().push(file.name);
  return parents.join("/");
}

function getParent(file, files) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].id == file.parents[0]) {
      return files[i];
    }
  }
}

module.exports.getDirByName = getDirByName;
module.exports.createDirHierarchy = createDirHierarchy;
module.exports.getFilesByUpdatedInGivenMinutes = getFilesByUpdatedInGivenMinutes;
module.exports.listFiles = listFiles;
