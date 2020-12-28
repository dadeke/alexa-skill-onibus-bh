const Alexa = require('ask-sdk-core');

const OptionOne = require('../responses/OptionOneResponse');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const SetOptionOneIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetOptionOneIntent'
    );
  },
  async handle(handlerInput) {
    try {
      const { attributesManager } = handlerInput;
      const sessionAttributes = attributesManager.getSessionAttributes() || {};
      const lastIntent = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'lastIntent',
      )
        ? sessionAttributes.lastIntent
        : false;

      if (lastIntent === 'AMAZON.HelpIntent') {
        const speakOutput = speaks.HELP_OPTION1 + speaks.CHOOSE_OPTION;

        sessionAttributes.OptionOneResponseCache = undefined;
        sessionAttributes.OptionTwoResponseCache = undefined;
        sessionAttributes.BusLinesResponseCache = undefined;
        sessionAttributes.BusLinesResponseCardCache = undefined;
        sessionAttributes.lastIntent = lastIntent;
        sessionAttributes.optionNumber = '1';
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutput)
          .reprompt(speaks.CHOOSE_OPTION)
          .getResponse();
      }

      const response = await OptionOne.getResponse(handlerInput);
      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `SetOptionOneIntentHandler - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = SetOptionOneIntentHandler;
