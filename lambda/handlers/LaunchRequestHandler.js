const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  async handle(handlerInput) {
    const { attributesManager, serviceClientFactory } = handlerInput;
    const { device, person } = handlerInput.requestEnvelope.context.System;

    let personId = 'default';
    if (person) {
      personId = person.personId;
    }

    let userTimeZone;
    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();
      userTimeZone = await upsServiceClient.getSystemTimeZone(device.deviceId);
    } catch (error) {
      if (error.name !== 'ServiceError') {
        // eslint-disable-next-line no-console
        console.error('Error:', `LaunchRequestHandler - ${error.message}`);

        await setLastAccess(handlerInput);

        return handlerInput.responseBuilder
          .speak(speaks.PROBLEM)
          .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
          .withShouldEndSession(true)
          .getResponse();
      }
    }

    const persistentAttributes =
      (await attributesManager.getPersistentAttributes()) || {};
    const lastAccess = Object.prototype.hasOwnProperty.call(
      persistentAttributes,
      personId,
    )
      ? persistentAttributes[personId].lastAccess
      : false;

    const dateNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: userTimeZone }),
    );
    const currentHour = dateNow.getHours();

    let greetingNow = speaks.GOOD_EVENING;
    if (currentHour < 12) {
      greetingNow = speaks.GOOD_MORNING;
    } else if (currentHour < 18) {
      greetingNow = speaks.GOOD_AFTERNOON;
    }

    let speakOutput = null;
    let speakCard = speaks.GREETING.format(greetingNow);
    if (personId !== 'default') {
      speakOutput = speaks.GREETING_PERSON.format(personId, greetingNow);
    } else {
      speakOutput = speakCard;
    }

    const welcome = lastAccess === false ? speaks.WELCOME : speaks.WELCOME_BACK;
    speakOutput += welcome;
    speakOutput += speaks.OPTIONS;
    speakCard += welcome;
    speakCard += speaks.OPTIONS_CARD;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakCard)
      .reprompt(speaks.OPTIONS)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
