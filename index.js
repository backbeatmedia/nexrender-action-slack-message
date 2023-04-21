const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_TOKEN;

module.exports = (job, settings, action, type) => {

  const slackWeb = new WebClient(token);
  const icon_emoji = type === 'prerender' ? ':robot_face:' : ':white_check_mark:';

  var payload = {
    channel: action.conversationId,
    username: 'Render Kit Robot',
    text: action.text || `Renderkit notification for job ${job.uid} at ${type} stage`,
    icon_emoji: icon_emoji
  };

  if (action.link) {

    payload.attachments = [
      {
        "text": "",
        "image_url": action.link
      }
    ]

  }

  return new Promise((resolve, reject) => {
    slackWeb.chat
      .postMessage(payload)
      .then((res) => {
        console.log(
          `Successfully send message ${res.ts} in conversation ${action.conversationId}`
        );
        resolve(job);
      })
      .catch((e) => {
        console.log(`*** slack action error: ${e.data.error} ***`);
        reject(e);
      });
  });
};



