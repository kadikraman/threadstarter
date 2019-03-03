const aws = require('aws-sdk');

const getBotToken = () =>
  new Promise((resolve, reject) => {
    const kms = new aws.KMS();
    kms.decrypt(
      {
        CiphertextBlob: Buffer.from(process.env.BOT_USER_TOKEN, 'base64'),
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

module.exports = {
  getBotToken,
};
