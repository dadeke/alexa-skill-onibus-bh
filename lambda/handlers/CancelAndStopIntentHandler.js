const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          'AMAZON.StopIntent')
    );
  },
  async handle(handlerInput) {
    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.ALL_RIGHT)
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CancelAndStopIntentHandler;
