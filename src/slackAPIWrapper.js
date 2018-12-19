const request = require("request");

// 引数で与えられたfileに関して、attatchmentを構成する。
function buildJSONForAttachments(file, path) {
  const json = {
    title: path,
    title_link: file.webViewLink
  };
  return json;
}

// 複数のattatchments(slackに送信した時、左に薄い線がついているメッセージ。1塊が1つのattachement)と、メッセージ本文を合わせてpayloadを構成。
function buildPayload(attachments) {
  return {
    text: "ファイルの更新がありました",
    attachments: attachments
  };
}

// 投稿する用のpayload等を組み立て、最後のUrlFetchAppによってapiを叩いている。
function postSlack(attachments) {
  const payload = buildPayload(attachments);
  const options = {
    url: process.env.SLACK_WEBHOOK_URL,
    form: JSON.stringify(payload),
    json: true
  };
  request.post(options);
}

module.exports.buildJSONForAttachments = buildJSONForAttachments;
module.exports.postSlack = postSlack;
