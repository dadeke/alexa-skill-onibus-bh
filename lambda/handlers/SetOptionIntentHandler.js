const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const OptionOne = require('../responses/OptionOneResponse');
const OptionTwo = require('../responses/OptionTwoResponse');
const BusLine = require('../responses/BusLineResponse');

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

      if (
        lastIntent === 'AMAZON.HelpIntent' &&
        (optionNumber === '1' || optionNumber === '2')
      ) {
        let speakOutput =
          optionNumber === '1' ? speaks.HELP_OPTION1 : speaks.HELP_OPTION2;
        speakOutput += speaks.CHOOSE_OPTION;

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

      // Em último caso, pode ser número de linha de ônibus.
      if (optionNumber) {
        const slots = {
          bus_line_string: {
            value: optionNumber,
          },
        };

        const modifiedHandlerInput = handlerInput;
        modifiedHandlerInput.requestEnvelope.request.intent.slots = slots;

        const response = await BusLine.getResponse(modifiedHandlerInput);
        return response;
      }

      // eslint-disable-next-line no-console
      console.error(
        'Error:',
        'SetOptionIntentHandler - optionNumber not found',
      );

      return handlerInput.responseBuilder
        .speak(speaks.NOT_UNDERSTAND)
        .withStandardCard(speaks.SKILL_NAME, speaks.NOT_UNDERSTAND)
        .reprompt(speaks.NOT_UNDERSTAND)
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