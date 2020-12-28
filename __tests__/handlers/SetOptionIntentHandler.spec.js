const Alexa = require('ask-sdk-core');

const SetOptionIntentHandler = require('../../lambda/handlers/SetOptionIntentHandler');
const OptionOne = require('../../lambda/responses/OptionOneResponse');
const OptionTwo = require('../../lambda/responses/OptionTwoResponse');
const BusLine = require('../../lambda/responses/BusLineResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 05. Test scenario: SetOptionIntent', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockOptionOneResponse = jest.fn();
  const mockOptionTwoResponse = jest.fn();
  const mockBusLineResponse = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  OptionOne.getResponse = mockOptionOneResponse;
  OptionTwo.getResponse = mockOptionTwoResponse;
  BusLine.getResponse = mockBusLineResponse;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setSessionAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetOptionIntent',
          slots: undefined,
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
    handlerInput.requestEnvelope.request.intent.name = 'SetOptionIntent';
    handlerInput.requestEnvelope.request.intent.slots = undefined;
  });

  it('should be able can not handle SetOptionIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetOptionIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(SetOptionIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return with response I have a problem when an exception happens', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '1',
      },
    };

    getSessionAttributes.mockReturnValueOnce({});
    mockOptionOneResponse.mockImplementationOnce(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionIntentHandler - Error: InternalError',
    );
  });

  it('should be able can return response not understand when getSessionAttributes return null', async () => {
    getSessionAttributes.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionIntentHandler - codBusStop and especificBusLine and optionNumber not found',
    );
  });

  it('should be able can return help response of the option one', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '1',
      },
    };

    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const speakOutput = speaks.HELP_OPTION1 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return help response of the option two', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '2',
      },
    };

    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const speakOutput = speaks.HELP_OPTION2 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response of the option one', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '1',
      },
    };

    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está selecionando a opção 1.
    const mockGetResponse = testResponseBuilder
      .speak(speaks.OPTION1_BUSSTOP)
      .withStandardCard(speaks.SKILL_NAME, speaks.OPTION1_BUSSTOP)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({});
    mockOptionOneResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response of the option two', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '2',
      },
    };

    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está selecionando a opção 2.
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

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be not able can return response of the predicion for bus line stop', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '15 09',
      },
    };

    const mockGetResponse = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.NOT_UNDERSTAND + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({});
    mockBusLineResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetOptionIntentHandler - codBusStop and especificBusLine and optionNumber not found',
    );
  });

  it('should be able can return response of the predicion for bus line stop', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      option_number: {
        value: '15 09',
      },
    };

    const optionTwoResponse = speaks.OPTION2_BUSSTOP_PREDICTION.format(
      '15 09',
      '5 minutos',
    );

    const optionTwoResponseCard = speaks.OPTION2_BUSSTOP_PREDICTION.format(
      '1509',
      '5 minutos',
    );

    const mockGetResponse = testResponseBuilder
      .speak(optionTwoResponse)
      .withStandardCard(speaks.SKILL_NAME, optionTwoResponseCard)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    getSessionAttributes.mockReturnValueOnce({
      codBusStop: '8711',
      especificBusLine: true,
    });
    mockBusLineResponse.mockReturnValueOnce(mockGetResponse);

    const response = await SetOptionIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
