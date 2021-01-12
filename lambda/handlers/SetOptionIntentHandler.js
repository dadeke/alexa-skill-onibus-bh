const Alexa = require('ask-sdk-core');

const OptionOne = require('../responses/OptionOneResponse');
const OptionTwo = require('../responses/OptionTwoResponse');
const OptionThree = require('../responses/OptionThreeResponse');
const BusLine = require('../responses/BusLineResponse');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const SetOptionIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetOptionIntent'
    );
  },
  async handle(handlerInput) {
    try {
      const optionNumber = Alexa.getSlotValue(
        handlerInput.requestEnvelope,
        'option_number',
      );

      const { attributesManager } = handlerInput;
      const sessionAttributes = attributesManager.getSessionAttributes() || {};
      const lastIntent = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'lastIntent',
      )
        ? sessionAttributes.lastIntent
        : false;
      // console.log('lastIntent:', lastIntent);
      // console.log('optionNumber:', optionNumber);

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

      if (
        lastIntent === 'AMAZON.HelpIntent' &&
        (optionNumber === '1' || optionNumber === '2' || optionNumber === '3')
      ) {
        let speakOutput = '';
        if (optionNumber === '1') {
          speakOutput += speaks.HELP_OPTION1;
        } else if (optionNumber === '2') {
          speakOutput += speaks.HELP_OPTION2;
        } else {
          speakOutput += speaks.HELP_OPTION3;
        }
        speakOutput += speaks.CHOOSE_OPTION;

        sessionAttributes.OptionOneResponseCache = undefined;
        sessionAttributes.OptionTwoResponseCache = undefined;
        sessionAttributes.BusLinesResponseCache = undefined;
        sessionAttributes.BusLinesResponseCardCache = undefined;
        sessionAttributes.lastIntent = lastIntent;
        sessionAttributes.optionNumber = optionNumber;
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutput)
          .reprompt(speaks.CHOOSE_OPTION)
          .getResponse();
      }

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

      // Em último caso, pode ser número de linha de ônibus.
      if (optionNumber && codBusStop !== false && busLines !== false) {
        const slots = {
          bus_line_string: {
            value: optionNumber,
          },
        };
        // console.log('optionNumber:', optionNumber);

        const modifiedHandlerInput = handlerInput;
        modifiedHandlerInput.requestEnvelope.request.intent.slots = slots;

        const response = await BusLine.getResponse(modifiedHandlerInput);
        return response;
      }

      // eslint-disable-next-line no-console
      console.error(
        'Error:',
        'SetOptionIntentHandler - ' +
          'optionNumber and codBusStop and busLines not found',
      );

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
      console.error('Error:', `SetOptionIntentHandler - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = SetOptionIntentHandler;
