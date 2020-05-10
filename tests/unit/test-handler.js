'use strict';

const index = require('../../index');
const chai = require('chai');
const expect = chai.expect;
const standardEvent = require('../../events/standard-event.json');
const voicesEvent = require('../../events/voices-event.json');

describe('Tests index', function () {
  it('standard successful response', async () => {
    standardEvent.body = JSON.stringify(standardEvent.body);
    const result = await index.standard(standardEvent, context);

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');
    expect(JSON.parse(result.body)).to.have.property('audioContent').with.length.gt(100);
  });

  it('voices successful response', async () => {
    voicesEvent.body = JSON.stringify(voicesEvent.body);
    const result = await index.voices(voicesEvent, context);

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');
    expect(JSON.parse(result.body)).to.have.property('voices').with.length.gt(10);
  });
});
