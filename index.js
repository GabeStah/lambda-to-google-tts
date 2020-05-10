const { fetchSpeech, fetchVoices } = require('./google-text-to-speech');

function createResponse (response) {
  return new Promise(async (resolve, reject) => {
    return resolve({
      // Body must be stringified to be accepted by API Gateway Lambda Proxy handler
      body: JSON.stringify(await response.json()),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
      },
      isBase64Encoded: true,
      statusCode: 200
    });
  });
}

exports.standard = async (event, context, callback) => {
  const response = await fetchSpeech(event.body);
  return createResponse(response);
};

exports.voices = async (event, context, callback) => {
  const requestData = JSON.parse(event.body);
  const response = await fetchVoices(requestData.languageCode);
  return createResponse(response);
};
