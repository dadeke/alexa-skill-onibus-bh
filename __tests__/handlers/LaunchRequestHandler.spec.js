const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = require('../../lambda/handlers/LaunchRequestHandler.js');
const speaks = require('../../lambda/speakStrings');

const deviceId = 'amzn1.ask.device.XXXXXXXX';
const personId = 'amzn1.ask.person.XXXXXXXX';
const deviceTimeZone = 'America/Sao_Paulo';

function testGreetingNow(currentPersonId = 'default') {
  const dateNow = new Date(
    new Date().toLocaleString('en-US', { timeZone: deviceTimeZone }),
  );
  const currentHour = dateNow.getHours();

  let greetingNow = speaks.GOOD_EVENING;
  if (currentHour < 12) {
    greetingNow = speaks.GOOD_MORNING;
  } else if (currentHour < 18) {
    greetingNow = speaks.GOOD_AFTERNOON;
  }

  let speakOutput = null;
  const speakCard = speaks.GREETING.format(greetingNow);
  if (currentPersonId !== 'default') {
    speakOutput = speaks.GREETING_PERSON.format(currentPersonId, greetingNow);
  } else {
    speakOutput = speakCard;
  }

  return speakOutput;
}

describe('Sequence 01. Test scenario: launch request. no further interaction.', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const getPersistentAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const getSystemTimeZone = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getPersistentAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
      getSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'LaunchRequest',
      },
      context: {
        System: {
          device: {
            deviceId,
          },
        },
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
    serviceClientFactory: {
      getUpsServiceClient: () => ({
        getSystemTimeZone,
      }),
    },
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.type = 'LaunchRequest';
    handlerInput.requestEnvelope.context.System.person = undefined;
  });

  it('should be able can not handle LaunchRequest if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(LaunchRequestHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(LaunchRequestHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response problem when service return error', async () => {
    getSystemTimeZone.mockImplementation(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'LaunchRequestHandler - InternalError',
    );
  });

  // "Resposta normal?". Fiquei na dúvida se este comportamento seria o correto. Hum ...
  it('should be able can return normal response when service return ServiceError', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-11-15T07:00:00.000-03:00'));

    getSystemTimeZone.mockImplementation(() => {
      const error = {
        name: 'ServiceError',
        message: 'Message to simulation ServiceError.',
      };

      throw error;
    });

    const speakOutput = testGreetingNow() + speaks.WELCOME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const speakOutput = testGreetingNow() + speaks.WELCOME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good morning', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-11-15T07:00:00.000-03:00'));

    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const speakOutput = testGreetingNow() + speaks.WELCOME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good afternoon', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-11-15T15:00:00.000-03:00'));

    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const speakOutput = testGreetingNow() + speaks.WELCOME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with good evening', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-11-15T20:00:00.000-03:00'));

    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const speakOutput = testGreetingNow() + speaks.WELCOME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response personalized', async () => {
    handlerInput.requestEnvelope.context.System.person = { personId };

    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const outputSpeech = testResponseBuilder
      .speak(testGreetingNow(personId) + speaks.WELCOME + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        testGreetingNow() + speaks.WELCOME + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with welcome back', async () => {
    getPersistentAttributes.mockReturnValueOnce({
      default: {
        lastAccess: '2020-12-15T14:29:34.531Z',
      },
    });
    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const speakOutput = testGreetingNow() + speaks.WELCOME_BACK;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput + speaks.OPTIONS)
      .withStandardCard(speaks.SKILL_NAME, speakOutput + speaks.OPTIONS_CARD)
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response personalized with welcome back', async () => {
    handlerInput.requestEnvelope.context.System.person = { personId };

    getPersistentAttributes.mockReturnValueOnce({
      [personId]: {
        lastAccess: '2020-12-15T14:29:34.531Z',
      },
    });
    getSystemTimeZone.mockReturnValueOnce(deviceTimeZone);

    const outputSpeech = testResponseBuilder
      .speak(testGreetingNow(personId) + speaks.WELCOME_BACK + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        testGreetingNow() + speaks.WELCOME_BACK + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
