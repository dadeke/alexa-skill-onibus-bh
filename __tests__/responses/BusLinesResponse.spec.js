const Alexa = require('ask-sdk-core');

const BHBus = require('../../lambda/api/bhbus');
const BusLines = require('../../lambda/responses/BusLinesResponse');
const speaks = require('../../lambda/speakStrings');

describe('Test BusLinesResponse (Plural)', () => {
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
          name: 'AMAZON.YesIntent',
        },
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const mockLinhasQueAtendemParada = {
    sucesso: true,
    mensagem: '',
    linhas: [
      {
        cod_linha: 32,
        num_linha: '1145',
        descricao: 'BAIRRO DAS INDUSTRIAS',
        cor: 4,
      },
      {
        cod_linha: 67,
        num_linha: '1505',
        descricao: 'ALTO DOS PINHEIROS/TUPI',
        cor: 4,
      },
      {
        cod_linha: 75,
        num_linha: '1509',
        descricao: 'CALIFORNIA/TUPI',
        cor: 4,
      },
      {
        cod_linha: 205,
        num_linha: '30',
        descricao: 'ESTACAO DIAMANTE/CENTRO',
        cor: 4,
      },
      // (Fictício)
      {
        cod_linha: 415,
        num_linha: '5506A',
        descricao: 'RIBEIRO DE ABREU',
        cor: 4,
      },
    ],
  };
  const mockLinhasQueAtendemParada2 = {
    sucesso: true,
    mensagem: '',
    linhas: [
      {
        cod_linha: 683,
        num_linha: '9414',
        descricao: 'SANTA INÊS / JOAO PINHEIRO',
        cor: 4,
      },
    ],
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can return response problem', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
    });

    BHBus.retornaLinhasQueAtendemParada = () => {
      throw new Error('InternalError'); // Simula um erro genérico.
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await BusLines.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'BusLines.getResponse - Error: InternalError',
    );
  });

  it('should be able can return response', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
    });

    BHBus.retornaLinhasQueAtendemParada = () => mockLinhasQueAtendemParada;

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.OPTION2_BUSLINENUMBERS.format(
          '11 45, 15 05, 15 09, 30 e 55 06 A',
        ) + speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_BUSLINENUMBERS.format('1145, 1505, 1509, 30 e 5506A') +
          speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .reprompt(
        speaks.OPTION2_BUSLINENUMBERS.format(
          '11 45, 15 05, 15 09, 30 e 55 06 A',
        ) + speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .getResponse();

    const response = await BusLines.getResponse(handlerInput);
    // console.log(response);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with only one bus line', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
    });

    BHBus.retornaLinhasQueAtendemParada = () => mockLinhasQueAtendemParada2;

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.OPTION2_BUSLINENUMBERS.format('94 14') +
          speaks.OPTION2_THIS_BUSLINE,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_BUSLINENUMBERS.format('9414') +
          speaks.OPTION2_THIS_BUSLINE,
      )
      .reprompt(
        speaks.OPTION2_BUSLINENUMBERS.format('94 14') +
          speaks.OPTION2_THIS_BUSLINE,
      )
      .getResponse();

    const response = await BusLines.getResponse(handlerInput);
    // console.log(response);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response coming from option three', async () => {
    getSessionAttributes.mockReturnValueOnce({
      codBusStop: 8711,
      busLines: ['1145', '1505', '1509', '30', '5506A'],
    });

    BHBus.retornaLinhasQueAtendemParada = () => mockLinhasQueAtendemParada;

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.OPTION2_BUSLINENUMBERS.format(
          '11 45, 15 05, 15 09, 30 e 55 06 A',
        ) + speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.OPTION2_BUSLINENUMBERS.format('1145, 1505, 1509, 30 e 5506A') +
          speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .reprompt(
        speaks.OPTION2_BUSLINENUMBERS.format(
          '11 45, 15 05, 15 09, 30 e 55 06 A',
        ) + speaks.OPTION2_SPECIFY_BUSLINE,
      )
      .getResponse();

    const response = await BusLines.getResponse(handlerInput);
    // console.log(response);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response problem when sessionAttributes return null', async () => {
    getSessionAttributes.mockReturnValueOnce(null);

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await BusLines.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'BusLines.getResponse - Error: codBusStop not found',
    );
  });
});
