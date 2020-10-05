// This code IS NOT executed or part of this SAM CLI project.
// This file is added to this project for repo code storage.
// Implementation: https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/srn-lambda-wcasg-widget-dashboard_coeus-insert-tts-request?tab=configuration
const axios = require('axios');
const paseto = require('paseto');

function getCoeusToken(url) {
  url = getCoeusUrl(url);
  switch (url) {
    case process.env.COEUS_URL_PRODUCTION:
      return process.env.COEUS_TOKEN_PRODUCTION;
    case process.env.COEUS_URL_TESTING:
      return process.env.COEUS_TOKEN_TESTING;
    default:
      return process.env.COEUS_TOKEN_PRODUCTION;
  }
}

function getCoeusUrl(value) {
  if (!value) {
    return process.env.COEUS_URL_PRODUCTION;
  }

  if (typeof value !== 'string') {
    return process.env.COEUS_URL_PRODUCTION;
  }

  if (value.startsWith('https://coeus')) {
    return value;
  }

  if (value.startsWith('127.0.0.1')) {
    return process.env.COEUS_URL_TESTING;
  }

  return process.env.COEUS_URL_PRODUCTION;
}

exports.handler = async(event, context) => {
  const {
    V2: { decrypt }
  } = paseto;

  if (event.request && event.request.headers && event.request.headers[process.env.TTS_REQUEST_HEADER]) {
    const decryptedData = await decrypt(
      event.request.headers[process.env.TTS_REQUEST_HEADER],
      Buffer.from(process.env.APP_PASETO_SECRET)
    );

    if (decryptedData) {
      const { coeus } = decryptedData;
      const requestPayload = Object.assign(event.request, decryptedData.request);
      requestPayload.body = JSON.parse(requestPayload.body)

      const coeusUrl = getCoeusUrl(coeus.url);
      const coeusToken = getCoeusToken(coeusUrl);

      const config = {
        method: 'post',
        url: `${coeusUrl}/data/insert`,
        headers: {
          'Authorization': `Bearer ${coeusToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          collection: process.env.COEUS_TARGET_COLLECTION,
          db: process.env.COEUS_TARGET_DB,
          document: [{
            request: requestPayload,
            site: decryptedData.site
          }]
        }
      };

      console.log(JSON.stringify(config.data));

      try {
        const response = await axios(config);
        console.log(response.data);
        return response.data;
      }
      catch (e) {
        console.log(e);
      }

    }
  }

  return {
    statusCode: 400,
    message: 'Invalid request',
  };
};
