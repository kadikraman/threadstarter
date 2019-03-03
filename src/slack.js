const fetch = require('node-fetch');

const postMessage = async ({ channel, ts, botToken }) => {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    body: JSON.stringify({
      channel,
      text: 'Remember to use threads! :thread:',
      thread_ts: ts,
    }),
    headers: {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

const getThreadHistory = async ({ userToken, channel, ts }) => {
  const params = {
    channel,
    ts,
    limit: 1,
    oldest: 1,
  };

  // this api doesn't support application/json https://api.slack.com/methods/conversations.replies
  const searchParams = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  const result = await fetch(`https://slack.com/api/conversations.replies?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });

  if (result.ok) {
    const parsed = await result.json();
    return parsed;
  }
  return null;
};

const deleteMessage = async ({ channel, ts, botToken }) => {
  await fetch('https://slack.com/api/chat.delete', {
    method: 'post',
    body: JSON.stringify({
      channel,
      ts,
    }),
    headers: {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

module.exports = {
  postMessage,
  getThreadHistory,
  deleteMessage,
};
