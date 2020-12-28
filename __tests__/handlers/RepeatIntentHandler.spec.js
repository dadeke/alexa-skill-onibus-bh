const Alexa = require('ask-sdk-core');

const RepeatIntentHandler = require('../../lambda/handlers/RepeatIntentHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 02. Test scenario: RepeatIntent', () => {
  const getSessionAttributes = jest.fn();

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'RepeatIntent',
        },
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.intent.name = 'RepeatIntent';
  });

  it('should be able can not handle RepeatIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(RepeatIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able to handle requests', () => {
    expect(RepeatIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return help repeating response of the option one', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
      optionNumber: '1',
    });

    const speakOutput =
      speaks.REPEATING + speaks.HELP_OPTION1 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return help repeating response of the option two', async () => {
    getSessionAttributes.mockReturnValueOnce({
      lastIntent: 'AMAZON.HelpIntent',
      optionNumber: '2',
    });

    const speakOutput =
      speaks.REPEATING + speaks.HELP_OPTION2 + speaks.CHOOSE_OPTION;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response repeating of the option one', async () => {
    getSessionAttributes.mockReturnValueOnce({
      // O conteúdo da fala aqui foi desconsiderado.
      // Apenas verifica se está repetindo.
      OptionOneResponseCache: speaks.OPTION1_BUSSTOP,
    });

    const speakOutput =
      speaks.REPEATING + speaks.OPTION1_BUSSTOP + speaks.REPEAT_AGAIN;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response repeating of the option two', async () => {
    // O conteúdo da fala aqui foi desconsiderado.
    // Apenas verifica se está repetindo.
    const optionTwoResponse = speaks.OPTION2_YES_BUSSTOP.format(
      '1 minuto',
      'RUA PROFESSOR BEATA NEVES, 185',
    );

    getSessionAttributes.mockReturnValueOnce({
      OptionTwoResponseCache: optionTwoResponse,
    });

    const speakOutput = speaks.REPEATING + optionTwoResponse;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.REPEAT_AGAIN)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response repeating of the option two with bus lines', async () => {
    const optionTwoResponse = speaks.OPTION2_BUSLINENUMBERS.format(
      '11 45, 15 05 e 15 09',
    );
    const optionTwoCardResponse = speaks.OPTION2_BUSLINENUMBERS.format(
      '1145, 1505 e 1509',
    );

    getSessionAttributes.mockReturnValueOnce({
      BusLinesResponseCache: optionTwoResponse,
      BusLinesResponseCardCache: optionTwoCardResponse,
    });

    const speakOutput = speaks.REPEATING + optionTwoResponse;
    const speakOutputCard = speaks.REPEATING + optionTwoCardResponse;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response repeating options main', async () => {
    getSessionAttributes.mockReturnValueOnce({});

    const speakOutput = speaks.REPEATING + speaks.OPTIONS;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.REPEATING + speaks.OPTIONS_CARD,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response repeating options main when getSessionAttributes return null', async () => {
    getSessionAttributes.mockReturnValueOnce(null);

    const speakOutput = speaks.REPEATING + speaks.OPTIONS;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.REPEATING + speaks.OPTIONS_CARD,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await RepeatIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
