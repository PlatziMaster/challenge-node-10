const slackTemplate = (data) => {
  const template = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `${data.name}: ${data.quote}`
        }
      }
    ]
  }
  return template;
};

module.exports = slackTemplate;