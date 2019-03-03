const aws = require('aws-sdk');

const getToken = environmentVariable =>
  new Promise((resolve, reject) => {
    const kms = new aws.KMS();
    kms.decrypt(
      {
        CiphertextBlob: Buffer.from(environmentVariable, 'base64'),
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

const getBotToken = () => getToken(process.env.BOT_TOKEN);
const getUserToken = () => getToken(process.env.USER_TOKEN);

module.exports = {
  getBotToken,
  getUserToken,
};
