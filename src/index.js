const { getBotToken, getUserToken } = require('./secrets');
const { getEventType, getBotMessage } = require('./events');
const { eventTypes } = require('./consts');
const { postMessage, getThreadHistory, deleteMessage } = require('./slack');

module.exports.default = async event => {
  if (!event.body) {
    return { statusCode: 400 };
  }

  const body = JSON.parse(event.body);

  console.info('body ', body); // this is here on purpose

  // Slack url verification https://api.slack.com/events/url_verification
  if (body.token && body.challenge && body.type) {
    return {
      statusCode: 200,
      body: JSON.stringify({ challenge: body.challenge }),
    };
  }

  const eventType = getEventType(body);

  let botToken;
  let userToken;

  try {
    botToken = await getBotToken();
    userToken = await getUserToken();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to parse token' }),
    };
  }

  if ([eventTypes.TOP_LEVEL_MESSAGE, eventTypes.TOP_LEVEL_IMAGE_MESSAGE].includes(eventType)) {
    await postMessage({
      channel: body.event.channel,
      ts: body.event.ts,
      botToken,
    });
    console.info('Started a thread'); // this is here on purpose
  } else if (eventType === eventTypes.THREADED_REPLY) {
    const history = await getThreadHistory({
      userToken,
      channel: body.event.channel,
      ts: body.event.thread_ts,
    });

    if (history) {
      const botMessage = getBotMessage(history);
      if (botMessage) {
        await deleteMessage({
          botToken,
          channel: body.event.channel,
          ts: botMessage.ts,
        });
        console.info('Deleted thread starter message');
      }
    }
  }

  return { statusCode: 200 };
};
