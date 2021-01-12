const Alexa = require('ask-sdk-core');

const BusLine = require('../../lambda/responses/BusLineResponse');
const SetBusLineIntentHandler = require('../../lambda/handlers/SetBusLineIntentHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 06. Test scenario: SetBusLineIntent', () => {
  const getSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const getResponse = jest.fn();
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;
  BusLine.getResponse = getResponse;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetBusLineIntent',
          slots: {
            bus_line_string: {
              value: '15 09',
            },
          },
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
    handlerInput.requestEnvelope.request.intent.name = 'SetBusLineIntent';
  });

  it('should be able can not handle SetBusLineIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetBusLineIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle SetBusLineIntent', () => {
    expect(SetBusLineIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return with response I have a problem when an exception happens', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: '8711',
      busLines: ['1145', '1505', '1509', '30'],
    });
    getResponse.mockImplementationOnce(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetBusLineIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'SetBusLineIntentHandler - Error: InternalError',
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

    const response = await SetBusLineIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: '8711',
      busLines: ['1145', '1505', '1509', '30'],
    });

    await SetBusLineIntentHandler.handle(handlerInput);

    // Apenas verifica se chamou o método.
    expect(getResponse).toHaveBeenCalled();
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
