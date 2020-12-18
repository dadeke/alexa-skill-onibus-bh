const Alexa = require('ask-sdk-core');

const FallbackIntentHandler = require('../../lambda/handlers/FallbackIntentHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 08. Test scenario: FallbackIntent', () => {
  const handlerInput = {
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'AMAZON.FallbackIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.FallbackIntent';
  });

  it('should be able can not handle FallbackIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(FallbackIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle FallbackIntent', () => {
    expect(FallbackIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response', () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND)
      .withStandardCard(speaks.SKILL_NAME, speaks.NOT_UNDERSTAND)
      .reprompt(speaks.NOT_UNDERSTAND)
      .getResponse();

    expect(FallbackIntentHandler.handle(handlerInput)).toEqual(outputSpeech);
  });
});
