const { generateAuthToken } = require('./authorization');
const fetch = require('node-fetch');

exports.fetchSpeech = async body => {
  return await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    body: body,
    headers: {
      Authorization: `Bearer ${generateAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
};

exports.fetchVoices = async (languageCode = 'en-US') => {
  return await fetch(
    `https://texttospeech.googleapis.com/v1/voices?languageCode=${languageCode}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${generateAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );
};
