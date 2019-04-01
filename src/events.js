const { eventTypes } = require('./consts');

const getEventType = requestBody => {
  const isBotMessage =
    requestBody.event &&
    requestBody.event.type === 'message' &&
    requestBody.event.subtype === 'bot_message';

  if (isBotMessage) {
    return eventTypes.BOT_MESSAGE;
  }

  const isMessage = requestBody.event && requestBody.event.type === 'message';

  if (isMessage) {
    const isParent = !requestBody.event.thread_ts;

    if (isParent) {
      if (!requestBody.event.subtype) {
        return eventTypes.TOP_LEVEL_MESSAGE;
      }
      if (requestBody.event.subtype === 'file_share') {
        return eventTypes.TOP_LEVEL_IMAGE_MESSAGE;
      }
    } else {
      return eventTypes.THREADED_REPLY;
    }
  }

  return eventTypes.OTHER;
};

const getBotMessage = history => {
  const botMessage = history.messages[1];
  if (botMessage.subtype === 'bot_message' && botMessage.text.includes('threads')) {
    return botMessage;
  }
  return null;
};

module.exports = {
  getEventType,
  getBotMessage,
};
