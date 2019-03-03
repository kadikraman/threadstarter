const { eventTypes } = require('./consts');

const getEventType = requestBody => {
  const isBotMessage =
    requestBody.event &&
    requestBody.event.type === 'message' &&
    requestBody.event.subtype === 'bot_message';

  if (isBotMessage) {
    return eventTypes.BOT_MESSAGE;
  }

  const isMessage =
    requestBody.event &&
    requestBody.event.type === 'message' &&
    !requestBody.event.subtype;

  if (isMessage) {
    const isParent = !requestBody.event.thread_ts;

    if (isParent) {
      return eventTypes.TOP_LEVEL_MESSAGE;
    } else {
      return eventTypes.THREADED_REPLY;
    }
  }
};

module.exports = {
  getEventType
};
