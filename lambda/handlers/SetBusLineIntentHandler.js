const Alexa = require('ask-sdk-core');

const BusLine = require('../responses/BusLineResponse');

const SetBusLineIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetBusLineIntent'
    );
  },
  async handle(handlerInput) {
    const response = await BusLine.getResponse(handlerInput);
    return response;
  },
};

module.exports = SetBusLineIntentHandler;
