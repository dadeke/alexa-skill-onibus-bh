const Alexa = require('ask-sdk-core');

const SetOptionTwoIntentHandler = require('../../lambda/handlers/SetOptionTwoIntentHandler');
const OptionTwo = require('../../lambda/responses/OptionTwoResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 04. Test scenario: SetOptionTwoIntent', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const mockOptionTwoResponse = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  OptionTwo.getResponse = mockOptionTwoResponse;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetOptionTwoIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'SetOptionTwoIntent';
  });

  it('should be able can not handle SetOptionTwoIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetOptionTwoIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(SetOptionTwoIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return with response I have a problem when an exception happens', async () => {
    getSessionAttributes.mockReturnValueOnce({});
    mockOptionTwoResponse.mockImplementationOnce(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetOptionTwoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionTwoIntentHandler - Error: InternalError',
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
    // O verdadeiro teste do OptionTwo.getResponse é no
    // __tests__/responses/OptionTwoResponse.spec.js
    mockOptionTwoResponse.mockReturnValueOnce(outputSpeech);

    const response = await SetOptionTwoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return help response of the option two', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const speakOutput = speaks.HELP_OPTION2 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await SetOptionTwoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está retornando a opção 2.
    const optionTwoResponse = speaks.OPTION2_YES_BUSSTOP.format(
      '1 minuto',
      'RUA PROFESSOR BEATA NEVES, 185',
    );

    const mockGetResponse = testResponseBuilder
      .speak(optionTwoResponse)
      .withStandardCard(speaks.SKILL_NAME, optionTwoResponse)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({});
    mockOptionTwoResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionTwoIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
