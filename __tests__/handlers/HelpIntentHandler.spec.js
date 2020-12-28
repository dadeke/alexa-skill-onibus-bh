const Alexa = require('ask-sdk-core');

const HelpIntentHandler = require('../../lambda/handlers/HelpIntentHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 08. Test scenario: HelpIntent', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setSessionAttributes,
    },
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.HelpIntent';
  });

  it('should be able can not handle HelpIntentHandler if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(HelpIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can not handle HelpIntentHandler if name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.FallbackIntent';

    expect(HelpIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle AMAZON.HelpIntent', () => {
    expect(HelpIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.HELP)
      .withStandardCard(speaks.SKILL_NAME, speaks.HELP)
      .reprompt(speaks.HELP)
      .getResponse();

    expect(HelpIntentHandler.handle(handlerInput)).toEqual(outputSpeech);
  });
});
