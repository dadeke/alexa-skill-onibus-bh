const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    sessionAttributes.lastIntent = 'AMAZON.HelpIntent';
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speaks.HELP)
      .withStandardCard(speaks.SKILL_NAME, speaks.HELP)
      .reprompt(speaks.HELP)
      .getResponse();
  },
};

module.exports = HelpIntentHandler;
