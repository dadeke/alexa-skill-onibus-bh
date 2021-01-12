const Alexa = require('ask-sdk-core');

const BusLine = require('../responses/BusLineResponse');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const SetBusLineIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetBusLineIntent'
    );
  },
  async handle(handlerInput) {
    try {
      const { attributesManager } = handlerInput;
      const sessionAttributes = attributesManager.getSessionAttributes() || {};

      const codBusStop = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'codBusStop',
      )
        ? sessionAttributes.codBusStop
        : false;

      const busLines = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'busLines',
      )
        ? sessionAttributes.busLines
        : false;

      if (codBusStop !== false && busLines !== false) {
        const response = await BusLine.getResponse(handlerInput);
        return response;
      }

      return handlerInput.responseBuilder
        .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
        .withStandardCard(
          speaks.SKILL_NAME,
          speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
        )
        .reprompt(speaks.OPTIONS)
        .getResponse();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `SetBusLineIntentHandler - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = SetBusLineIntentHandler;
