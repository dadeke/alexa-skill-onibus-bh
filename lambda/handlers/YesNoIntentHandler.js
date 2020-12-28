const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const Util = require('../util');

const OptionOne = require('../responses/OptionOneResponse');
const OptionTwo = require('../responses/OptionTwoResponse');
const BusLines = require('../responses/BusLinesResponse');

const YesNoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.YesIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent')
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};

    const lastIntent = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'lastIntent',
    )
      ? sessionAttributes.lastIntent
      : false;

    const optionNumber = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'optionNumber',
    )
      ? sessionAttributes.optionNumber
      : false;
    const OptionOneResponseCache = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'OptionOneResponseCache',
    )
      ? sessionAttributes.OptionOneResponseCache
      : false;
    const especificBusLine = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'especificBusLine',
    )
      ? sessionAttributes.especificBusLine
      : false;
    // console.log('optionNumber:', optionNumber);
    // console.log('OptionOneResponseCache:', OptionOneResponseCache);
    // console.log('especificBusLine:', especificBusLine);

    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);

    if (intentName === 'AMAZON.YesIntent') {
      if (lastIntent === 'AMAZON.HelpIntent') {
        sessionAttributes.lastIntent = undefined;
        attributesManager.setSessionAttributes(sessionAttributes);

        if (optionNumber === '1') {
          const response = await OptionOne.getResponse(handlerInput);
          return response;
        }

        if (optionNumber === '2') {
          const response = await OptionTwo.getResponse(handlerInput);
          return response;
        }

        // eslint-disable-next-line no-console
        console.error('Error:', 'YesNoIntentHandler - optionNumber not found');

        return handlerInput.responseBuilder
          .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
          .withStandardCard(
            speaks.SKILL_NAME,
            speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
          )
          .reprompt(speaks.OPTIONS)
          .getResponse();
      }

      // Repetir a opção 1
      if (OptionOneResponseCache !== false) {
        const speakOutput =
          speaks.REPEATING + OptionOneResponseCache + speaks.REPEAT_AGAIN;

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutput)
          .reprompt(speaks.REPEAT_AGAIN)
          .getResponse();
      }

      if (optionNumber === '2' && especificBusLine === false) {
        const response = await BusLines.getResponse(handlerInput);
        return response;
      }

      if (optionNumber === '2' && especificBusLine === true) {
        return handlerInput.responseBuilder
          .speak(speaks.OPTION2_WHATBUSLINE)
          .withStandardCard(speaks.SKILL_NAME, speaks.OPTION2_WHATBUSLINE)
          .reprompt(speaks.OPTION2_WHATBUSLINE)
          .getResponse();
      }

      // eslint-disable-next-line no-console
      console.error(
        'Error:',
        'YesNoIntentHandler - lastIntent or optionNumber not found',
      );

      return handlerInput.responseBuilder
        .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
        .withStandardCard(
          speaks.SKILL_NAME,
          speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
        )
        .reprompt(speaks.OPTIONS)
        .getResponse();
    }

    await Util.setLastAccess(handlerInput);

    const number = Util.getNumberRand(2);

    return handlerInput.responseBuilder
      .speak(speaks.ALL_RIGHT_BYE[number])
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT_BYE[number])
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = YesNoIntentHandler;
