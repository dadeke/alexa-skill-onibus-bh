const Alexa = require('ask-sdk-core');

const BusLine = require('../../lambda/responses/BusLineResponse');
const BHBus = require('../../lambda/api/bhbus');
const speaks = require('../../lambda/speakStrings');

describe('Test BusLineResponse', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

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
  const mockPrevisoes = {
    sucesso: true,
    previsoes: [
      {
        sgLin: '1145',
        prev: '14 Minutos',
        tpAcess: 6,
        cor: 3,
        numVeicGestor: '40734',
        apelidoLinha: 'BAIRRO DAS INDUSTRIAS',
        codItinerario: 49510,
      },
      {
        sgLin: '1505',
        prev: 'SAÍDA: 19:50',
        tpAcess: 0,
        cor: 4,
        apelidoLinha: 'VIA CONJUNTO FELICIDADE',
        codItinerario: 46057,
      },
      {
        sgLin: '1505',
        prev: 'SAÍDA: 20:30',
        tpAcess: 0,
        cor: 4,
        apelidoLinha: 'VIA CONJUNTO FELICIDADE',
        codItinerario: 46057,
      },
      {
        sgLin: '1509',
        prev: '18 Minutos',
        tpAcess: 6,
        cor: 4,
        numVeicGestor: '30668',
        apelidoLinha: 'TUPI / CALIFORNIA',
        codItinerario: 46280,
      },
    ],
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can return response problem', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      busLines: ['1145', '1505', '1509', '30'],
    });

    BHBus.buscarPrevisoes = () => {
      throw new Error('InternalError'); // Simula um erro genérico.
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'BusLine.getResponse - Error: InternalError',
    );
  });

  it('should be able can return response', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      busLines: ['1145', '1505', '1509', '30'],
    });

    BHBus.buscarPrevisoes = () => mockPrevisoes;

    const outputSpeech = testResponseBuilder
      .speak(speaks.OPTION2_BUSSTOP_PREDICTION.format('15 09', '18 Minutos'))
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_BUSSTOP_PREDICTION.format('1509', '18 Minutos'),
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response without prediction bus stop', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      busLines: ['1145', '1505', '1509', '30'],
    });

    BHBus.buscarPrevisoes = () => ({
      sucesso: true,
      previsoes: [],
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.OPTION2_NO_PREDICTION.format('15 09'))
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_NO_PREDICTION.format('1509'),
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response not understand when sessionAttributes return null', async () => {
    getSessionAttributes.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(speaks.OPTION2_BUSLINE_NOT_UNDERSTAND)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_BUSLINE_NOT_UNDERSTAND,
      )
      .reprompt(speaks.OPTION2_BUSLINE_NOT_UNDERSTAND)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response sorry when bus line is not includes in bus stop', async () => {
    handlerInput.requestEnvelope.request.intent.slots.bus_line_string.value =
      '81 07';
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      busLines: ['1145', '1505', '1509', '30'],
    });

    BHBus.buscarPrevisoes = () => mockPrevisoes;

    const speakOutput =
      speaks.SORRY_BUSLINE_NOT_STOP.format('81 07') + speaks.PLEASE_REPEAT;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.SORRY_BUSLINE_NOT_STOP.format('8107') + speaks.PLEASE_REPEAT,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response sorry when bus line is not includes in bus stop coming from option three', async () => {
    handlerInput.requestEnvelope.request.intent.slots.bus_line_string.value =
      '81 07';
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      especificBusLine: true,
      busLines: ['1145', '1505', '1509', '30'],
    });

    BHBus.buscarPrevisoes = () => mockPrevisoes;

    const speakOutput =
      speaks.SORRY_BUSLINE_NOT_STOP.format('81 07') +
      speaks.OPTION3_CHOOSE_OPTION2;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.SORRY_BUSLINE_NOT_STOP.format('8107') +
          speaks.OPTION3_CHOOSE_OPTION2,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await BusLine.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
