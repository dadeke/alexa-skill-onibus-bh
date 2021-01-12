const Alexa = require('ask-sdk-core');

const OptionThreeResponse = require('../../lambda/responses/OptionThreeResponse');
const Util = require('../../lambda/util');
const GeoSupported = require('../../lambda/responses/GeoSupportedResponse');
const BHBus = require('../../lambda/api/bhbus');
const GMaps = require('../../lambda/api/googlemaps');
const speaks = require('../../lambda/speakStrings');

describe('Test OptionThreeResponse', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  Util.setLastAccess = jest.fn();
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
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const mockParadasProximas = {
    sucesso: true,
    paradas: [
      {
        cod: 8711,
        desc: 'AVE AMAZONAS, 1518',
      },
    ],
  };
  const mockDistanceMatrix = {
    rows: [
      {
        elements: [
          {
            distance: {
              text: '5 m',
              value: 5,
            },
          },
        ],
      },
    ],
    status: 'OK',
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
    ],
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can return response problem', async () => {
    GeoSupported.getResponse = () => {
      throw new Error('InternalError'); // Simula um erro genérico.
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await OptionThreeResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'OptionThree.getResponse - Error: InternalError',
    );
  });

  it('should be able can return another response when freshness return undefined', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.UNSUPPORTED_DEVICE_MSG)
      .withStandardCard(speaks.SKILL_NAME, speaks.UNSUPPORTED_DEVICE_MSG)
      .withShouldEndSession(true)
      .getResponse();

    GeoSupported.getResponse = () => outputSpeech;
    BHBus.buscarParadasProximas = () => {};
    GMaps.getDistanceMatrix = () => {};

    const response = await OptionThreeResponse.getResponse(handlerInput);
    // console.log(response);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response sorry when without bus stop', async () => {
    const freshness = 1;
    const mockOneParadasProximas = {
      sucesso: true,
      paradas: [],
    };

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockOneParadasProximas;
    GMaps.getDistanceMatrix = () => {};

    const outputSpeech = testResponseBuilder
      .speak(speaks.SORRY_NOT_NEXTSTOPS)
      .withStandardCard(speaks.SKILL_NAME, speaks.SORRY_NOT_NEXTSTOPS)
      .withShouldEndSession(true)
      .getResponse();

    const response = await OptionThreeResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response', async () => {
    const freshness = 2;

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockParadasProximas;
    GMaps.getDistanceMatrix = () => mockDistanceMatrix;
    BHBus.retornaLinhasQueAtendemParada = () => mockLinhasQueAtendemParada;

    const outputSpeech = testResponseBuilder
      .speak(speaks.WHAT_BUSLINE)
      .withStandardCard(speaks.SKILL_NAME, speaks.WHAT_BUSLINE)
      .reprompt(speaks.WHAT_BUSLINE)
      .getResponse();

    const response = await OptionThreeResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response is not bus stop', async () => {
    const freshness = 2;

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockParadasProximas;
    GMaps.getDistanceMatrix = () => ({
      rows: [
        {
          elements: [
            {
              distance: {
                value: 101,
              },
            },
          ],
        },
      ],
      status: 'OK',
    });

    const speakOutput =
      speaks.NOT_BUSSTOP.format(
        Util.getSpeakMinute(
          freshness,
          speaks.OPTION1_MINUTE,
          speaks.OPTION1_MINUTES,
        ),
      ) + speaks.CHOOSE_OPTION1;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION1)
      .getResponse();

    const response = await OptionThreeResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
