const Alexa = require('ask-sdk-core');

const CancelAndStopIntentHandler = require('../../lambda/handlers/CancelAndStopIntentHandler');
const speaks = require('../../lambda/speakStrings');
const Util = require('../../lambda/util');

describe('Sequence 10. Test scenario: AMAZON.CancelIntent and AMAZON.StopIntent', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetNumberRand = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  Util.getNumberRand = mockGetNumberRand;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {},
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.type = 'IntentRequest';
  });

  it('should be able can not handle CancelAndStopIntent if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(CancelAndStopIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle AMAZON.CancelIntent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.CancelIntent';

    expect(CancelAndStopIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can handle AMAZON.StopIntent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.StopIntent';

    expect(CancelAndStopIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response when AMAZON.CancelIntent', async () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.CancelIntent';

    mockGetNumberRand.mockReturnValueOnce(0);

    const outputSpeech = testResponseBuilder
      .speak(speaks.ALL_RIGHT_BYE[0])
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT_BYE[0])
      .withShouldEndSession(true)
      .getResponse();

    const response = await CancelAndStopIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response when AMAZON.StopIntent', async () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.StopIntent';

    mockGetNumberRand.mockReturnValueOnce(1);

    const outputSpeech = testResponseBuilder
      .speak(speaks.ALL_RIGHT_BYE[1])
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT_BYE[1])
      .withShouldEndSession(true)
      .getResponse();

    const response = await CancelAndStopIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
