const { fetchSpeech, fetchVoices } = require('./google-text-to-speech');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

function createResponse (response) {
  return new Promise(async (resolve, reject) => {
    return resolve({
      // Body must be stringified to be accepted by API Gateway Lambda Proxy handler
      body: response,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Wcasg-Widget-Tts-Request-Data',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
      },
      isBase64Encoded: true,
      statusCode: 200
    });
  });
}

async function makeCoeusDataInsertRequest (payload) {
  if (!payload) {
    return;
  }

  return lambda.invoke({
    FunctionName: 'arn:aws:lambda:us-west-2:696585593443:function:srn-lambda-wcasg-widget-dashboard_coeus-insert-tts-request',
    InvocationType: 'Event',
    LogType: 'Tail',
    Payload: JSON.stringify(payload)
  }).promise();
}

exports.standard = async (event, context, callback) => {
  const speech = await fetchSpeech(event.body);
  const response = JSON.stringify(await speech.json());

  if (event.headers && event.headers['X-Wcasg-Widget-Tts-Request-Data']) {
    await makeCoeusDataInsertRequest( {
      request: {
        body: event.body,
        bytes: Buffer.byteLength(response, 'utf8'),
        headers: event.headers,
      }
    })
  }

  return createResponse(response);
};

exports.voices = async (event, context, callback) => {
  const requestData = JSON.parse(event.body);
  const voices = await fetchVoices(requestData.languageCode);
  return createResponse(JSON.stringify(await voices.json()));
};
