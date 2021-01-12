const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const Util = require('../util');

const OptionOne = require('../responses/OptionOneResponse');
const OptionTwo = require('../responses/OptionTwoResponse');
const OptionThree = require('../responses/OptionThreeResponse');
const BusLines = require('../responses/BusLinesResponse');
const BusLine = require('../responses/BusLineResponse');

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
    const busLines = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'busLines',
    )
      ? sessionAttributes.busLines
      : false;
    // console.log('optionNumber:', optionNumber);
    // console.log('OptionOneResponseCache:', OptionOneResponseCache);
    // console.log('especificBusLine:', especificBusLine);
    // console.log('busLines:', busLines);

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

        if (optionNumber === '3') {
          const response = await OptionThree.getResponse(handlerInput);
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

      if (optionNumber === '1') {
        const response = await OptionOne.getResponse(handlerInput);
        return response;
      }

      // Retorna a(s) linha(s) de ônibus que atendem a parada.
      if (
        optionNumber === '2' &&
        (busLines === false || especificBusLine === true)
      ) {
        const response = await BusLines.getResponse(handlerInput);
        return response;
      }

      // Caso seja apenas uma única linha de ônibus atendida na parada,
      // retorna a previsão dela mesma de uma vez.
      if (optionNumber === '2' && busLines !== false && busLines.length === 1) {
        const slots = {
          bus_line_string: {
            value: busLines[0],
          },
        };
        // console.log('optionNumber:', optionNumber);

        const modifiedHandlerInput = handlerInput;
        modifiedHandlerInput.requestEnvelope.request.intent.slots = slots;

        const response = await BusLine.getResponse(modifiedHandlerInput);
        return response;
      }

      // Caso sejam várias linhas de ônibus atendidas na parada,
      // realiza o questionamento.
      if (optionNumber === '2' && busLines !== false) {
        return handlerInput.responseBuilder
          .speak(speaks.WHAT_BUSLINE)
          .withStandardCard(speaks.SKILL_NAME, speaks.WHAT_BUSLINE)
          .reprompt(speaks.WHAT_BUSLINE)
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

    const number = Util.getNumberRand(speaks.ALL_RIGHT_BYE.length - 1);

    return handlerInput.responseBuilder
      .speak(speaks.ALL_RIGHT_BYE[number])
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT_BYE[number])
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = YesNoIntentHandler;
