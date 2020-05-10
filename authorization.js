const { sign } = require('jsonwebtoken');
const keys = require('./credentials/credentials.json');

exports.generateAuthToken = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  return signJWT({
    payload: {
      iss: keys.client_email,
      sub: keys.client_email,
      aud: 'https://texttospeech.googleapis.com/',
      iat: timestamp,
      exp: timestamp + 3600
    },
    privateKey: keys.private_key,
    options: {
      header: {
        alg: 'RS256',
        typ: 'JWT',
        kid: keys.private_key_id
      },
      algorithm: 'RS256'
    }
  });
};

const signJWT = ({ payload, privateKey, options }) => {
  return sign(payload, privateKey, options);
};
