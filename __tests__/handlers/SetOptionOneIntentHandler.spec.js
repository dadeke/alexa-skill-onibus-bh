const Alexa = require('ask-sdk-core');

const SetOptionOneIntentHandler = require('../../lambda/handlers/SetOptionOneIntentHandler');
const OptionOne = require('../../lambda/responses/OptionOneResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 03. Test scenario: SetOptionOneIntent', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const mockOptionOneResponse = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  OptionOne.getResponse = mockOptionOneResponse;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetOptionOneIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'SetOptionOneIntent';
  });

  it('should be able can not handle SetOptionOneIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetOptionOneIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(SetOptionOneIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return with response I have a problem when an exception happens', async () => {
    getSessionAttributes.mockReturnValueOnce({});
    mockOptionOneResponse.mockImplementationOnce(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetOptionOneIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionOneIntentHandler - Error: InternalError',
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
    // O verdadeiro teste do OptionOne.getResponse é no
    // __tests__/responses/OptionOneResponse.spec.js
    mockOptionOneResponse.mockReturnValueOnce(outputSpeech);

    const response = await SetOptionOneIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return help response of the option one', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const speakOutput = speaks.HELP_OPTION1 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await SetOptionOneIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está retornando a opção 1.
    const mockGetResponse = testResponseBuilder
      .speak(speaks.OPTION1_BUSSTOP)
      .withStandardCard(speaks.SKILL_NAME, speaks.OPTION1_BUSSTOP)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({});
    mockOptionOneResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionOneIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
