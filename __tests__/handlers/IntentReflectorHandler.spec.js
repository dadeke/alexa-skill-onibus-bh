const Alexa = require('ask-sdk-core');

const IntentReflectorHandler = require('../../lambda/handlers/IntentReflectorHandler');

describe('Test IntentReflector', () => {
  const handlerInput = {
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'AMAZON.HelpIntent',
        },
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

  it('should be able can not handle IntentReflectorHandler if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(IntentReflectorHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak('Você acabou de ativar AMAZON.HelpIntent')
      .getResponse();

    expect(IntentReflectorHandler.handle(handlerInput)).toEqual(outputSpeech);
  });
});
