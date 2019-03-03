const fetch = require('node-fetch');
const aws = require('aws-sdk');

const getToken = () =>
  new Promise((resolve, reject) => {
    const kms = new aws.KMS();

    kms.decrypt(
      {
        CiphertextBlob: new Buffer(process.env.BOT_USER_TOKEN, 'base64')
      },
      (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.Plaintext.toString('ascii'));
        }
      }
    );
  });

module.exports.message = async (event, context) => {
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
    const token = await getToken();

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
            Authorization: `Bearer ${token}`,
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
