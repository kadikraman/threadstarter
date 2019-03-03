const fetch = require('node-fetch');
const { getBotToken } = require('./secrets');
const { getEventType } = require('./events');
const { eventTypes } = require('./consts');

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

  const eventType = getEventType(body);

  let botToken;

  try {
    botToken = await getBotToken();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to parse bot token' })
    };
  }

  if (eventType === eventTypes.TOP_LEVEL_MESSAGE) {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'post',
      body: JSON.stringify({
        channel: body.event.channel,
        text: 'Remember to use threads! :thread:',
        thread_ts: body.event.ts
      }),
      headers: {
        Authorization: `Bearer ${botToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return { statusCode: 200 };
};
