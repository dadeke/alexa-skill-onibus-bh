const Alexa = require('ask-sdk-core');

const YesNoIntentHandler = require('../../lambda/handlers/YesNoIntentHandler');
const OptionOne = require('../../lambda/responses/OptionOneResponse');
const OptionTwo = require('../../lambda/responses/OptionTwoResponse');
const BusLines = require('../../lambda/responses/BusLinesResponse');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 07. Test scenario: YesNoIntent', () => {
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
  BusLines.getResponse = mockBusLineResponse;

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
          name: 'AMAZON.YesIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.YesIntent';
  });

  it('should be able can not handle YesNoIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(YesNoIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle YesNoIntent if intent name is AMAZON.YesIntent', () => {
    expect(YesNoIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can handle YesNoIntent if intent name is AMAZON.NoIntent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.NoIntent';

    expect(YesNoIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response not understand when getSessionAttributes return null', async () => {
    getSessionAttributes.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND)
      .withStandardCard(speaks.SKILL_NAME, speaks.NOT_UNDERSTAND)
      .reprompt(speaks.NOT_UNDERSTAND)
      .getResponse();

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'YesNoIntentHandler - lastIntent or optionNumber not found',
    );
  });

  it('should be able can return response all right when intent name is AMAZON.NoIntent', async () => {
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.NoIntent';

    const outputSpeech = testResponseBuilder
      .speak(speaks.ALL_RIGHT)
      .withStandardCard(speaks.SKILL_NAME, speaks.ALL_RIGHT)
      .withShouldEndSession(true)
      .getResponse();

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response not understand when optionNumber not found', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.NOT_UNDERSTAND)
      .withStandardCard(speaks.SKILL_NAME, speaks.NOT_UNDERSTAND)
      .reprompt(speaks.NOT_UNDERSTAND)
      .getResponse();

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'YesNoIntentHandler - optionNumber not found',
    );
  });

  it('should be able can return response of the option one', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
      optionNumber: '1',
    });

    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está selecionando a opção 1.
    const mockGetResponse = testResponseBuilder
      .speak(speaks.OPTION1_BUSSTOP)
      .withStandardCard(speaks.SKILL_NAME, speaks.OPTION1_BUSSTOP)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    mockOptionOneResponse.mockReturnValueOnce(mockGetResponse);

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response of the option two', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
      optionNumber: '2',
    });

    const optionTwoResponse = speaks.OPTION2_YES_BUSSTOP.format(
      '2 minutos',
      'AVE SANTA MATILDE, 403',
    );

    const mockGetResponse = testResponseBuilder
      .speak(optionTwoResponse)
      .withStandardCard(speaks.SKILL_NAME, optionTwoResponse)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    mockOptionTwoResponse.mockReturnValueOnce(mockGetResponse);

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response repeating of the option one', async () => {
    getSessionAttributes.mockReturnValueOnce({
      // O conteúdo da fala aqui foi desconsiderado.
      // Apenas verifica se está repetindo a opção 1.
      OptionOneResponseCache: speaks.OPTION1_BUSSTOP,
    });

    const speakOutput =
      speaks.REPEATING + speaks.OPTION1_BUSSTOP + speaks.REPEAT_AGAIN;

    const mockGetResponse = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    mockOptionTwoResponse.mockReturnValueOnce(mockGetResponse);

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with bus lines serving the stop', async () => {
    getSessionAttributes.mockReturnValueOnce({
      optionNumber: '2',
    });

    const optionTwoResponse = speaks.OPTION2_BUSLINENUMBERS.format(
      '15 09 e 94 14',
    );
    const optionTwoResponseCard = speaks.OPTION2_BUSLINENUMBERS.format(
      '1509 e 9414',
    );

    const mockGetResponse = testResponseBuilder
      .speak(optionTwoResponse)
      .withStandardCard(speaks.SKILL_NAME, optionTwoResponseCard)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    mockBusLineResponse.mockReturnValueOnce(mockGetResponse);

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(mockGetResponse);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return asks what is the bus line', async () => {
    getSessionAttributes.mockReturnValueOnce({
      optionNumber: '2',
      especificBusLine: true,
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.OPTION2_WHATBUSLINE)
      .withStandardCard(speaks.SKILL_NAME, speaks.OPTION2_WHATBUSLINE)
      .reprompt(speaks.OPTION2_WHATBUSLINE)
      .getResponse();

    const response = await YesNoIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
