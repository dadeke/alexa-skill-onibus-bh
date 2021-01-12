const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatIntent'
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
    const OptionTwoResponseCache = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'OptionTwoResponseCache',
    )
      ? sessionAttributes.OptionTwoResponseCache
      : false;
    const BusLinesResponseCache = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'BusLinesResponseCache',
    )
      ? sessionAttributes.BusLinesResponseCache
      : false;
    const BusLinesResponseCardCache = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'BusLinesResponseCache',
    )
      ? sessionAttributes.BusLinesResponseCardCache
      : false;
    // console.log('lastIntent:', lastIntent);
    // console.log('optionNumber:', optionNumber);
    // console.log('OptionOneResponseCache:', OptionOneResponseCache);
    // console.log('OptionTwoResponseCache:', OptionTwoResponseCache);
    // console.log('BusLinesResponseCache:', BusLinesResponseCache);
    // console.log('BusLinesResponseCardCache:', BusLinesResponseCardCache);

    // Repete as opções de ajuda.
    if (
      lastIntent === 'AMAZON.HelpIntent' &&
      (optionNumber === '1' || optionNumber === '2' || optionNumber === '3')
    ) {
      let speakOutput = speaks.REPEATING;
      if (optionNumber === '1') {
        speakOutput += speaks.HELP_OPTION1;
      } else if (optionNumber === '2') {
        speakOutput += speaks.HELP_OPTION2;
      } else {
        speakOutput += speaks.HELP_OPTION3;
      }
      speakOutput += speaks.CHOOSE_OPTION;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, speakOutput)
        .reprompt(speaks.CHOOSE_OPTION)
        .getResponse();
    }

    // Repete a opção 1, sempre pegando do cache.
    if (OptionOneResponseCache !== false) {
      const speakOutput =
        speaks.REPEATING + OptionOneResponseCache + speaks.REPEAT_AGAIN;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, speakOutput)
        .reprompt(speaks.REPEAT_AGAIN)
        .getResponse();
    }

    // Repete a opção 2, sempre pegando do cache.
    if (OptionTwoResponseCache !== false && BusLinesResponseCache === false) {
      const speakOutput = speaks.REPEATING + OptionTwoResponseCache;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, speakOutput)
        .reprompt(speaks.REPEAT_AGAIN)
        .getResponse();
    }

    // Repete a(s) linha(s) de ônibus da opção 2, sempre pegando do cache.
    if (BusLinesResponseCache !== false) {
      const speakOutput = speaks.REPEATING + BusLinesResponseCache;
      const speakOutputCard = speaks.REPEATING + BusLinesResponseCardCache;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
        .reprompt(speaks.REPEAT_AGAIN)
        .getResponse();
    }

    const speakOutput = speaks.REPEATING + speaks.OPTIONS;
    const speakOutputCard = speaks.REPEATING + speaks.OPTIONS_CARD;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
      .reprompt(speakOutput)
      .getResponse();
  },
};

module.exports = RepeatIntentHandler;
