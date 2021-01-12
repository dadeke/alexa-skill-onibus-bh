const Alexa = require('ask-sdk-core');

const SetOptionThreeIntentHandler = require('../../lambda/handlers/SetOptionThreeIntentHandler');
const OptionThree = require('../../lambda/responses/OptionThreeResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 05. Test scenario: SetOptionThreeIntent', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const mockOptionThreeResponse = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  OptionThree.getResponse = mockOptionThreeResponse;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetOptionThreeIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'SetOptionThreeIntent';
  });

  it('should be able can not handle SetOptionThreeIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetOptionThreeIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(SetOptionThreeIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return with response I have a problem when an exception happens', async () => {
    getSessionAttributes.mockReturnValueOnce({});
    mockOptionThreeResponse.mockImplementationOnce(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetOptionThreeIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionThreeIntentHandler - Error: InternalError',
    );
  });

  it('should be able can return response not understand when getSessionAttributes return null', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce(null);
    // Resposta fake.
    // O verdadeiro teste do OptionThree.getResponse é no
    // __tests__/responses/OptionThreeResponse.spec.js
    mockOptionThreeResponse.mockReturnValueOnce(outputSpeech);

    const response = await SetOptionThreeIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return help response of the option three', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const speakOutput = speaks.HELP_OPTION3 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await SetOptionThreeIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '3',
      },
    };

    const optionThreeResponse =
      speaks.NOT_BUSSTOP + speaks.CHOOSE_OPTION1;

    const mockGetResponse = testResponseBuilder
      .speak(optionThreeResponse)
      .withStandardCard(speaks.SKILL_NAME, optionThreeResponse)
      .reprompt(speaks.CHOOSE_OPTION1)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({});
    mockOptionThreeResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionThreeIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
