const fetch = require('node-fetch');
const { getBotToken } = require('./secrets');

module.exports.default = async (event, context) => {
  if (!event.body) {
    return { statusCode: 400 };
  }

  const body = JSON.parse(event.body);

  console.log('body ', body);

  // Slack url verification https://api.slack.com/events/url_verification
  if (body.token && body.challenge && body.type) {
    return {
      statusCode: 200,
      body: JSON.stringify({ challenge: body.challenge })
    };
  }

  try {
    const botToken = await getBotToken();

    if (body.event && body.event.type === 'message' && !body.event.subtype) {
      const isParent = !body.event.thread_ts;

      if (isParent) {
        await fetch('https://slack.com/api/chat.postMessage', {
          method: 'post',
          body: JSON.stringify({
            channel: body.event.channel,
            text: ':thread: Remember to use threads!',
            thread_ts: body.event.ts
          }),
          headers: {
            Authorization: `Bearer ${botToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to parse bot token' })
    };
  }

  return { statusCode: 200 };
};
