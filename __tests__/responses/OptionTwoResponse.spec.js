const Alexa = require('ask-sdk-core');

const OptionTwoResponse = require('../../lambda/responses/OptionTwoResponse');
const Util = require('../../lambda/util');
const GeoSupported = require('../../lambda/responses/GeoSupportedResponse');
const BHBus = require('../../lambda/api/bhbus');
const GMaps = require('../../lambda/api/googlemaps');
const speaks = require('../../lambda/speakStrings');

describe('Test OptionTwoResponse', () => {
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
        cod: 11103,
        desc: 'AVE SANTA MATILDE, 486',
      },
    ],
  };
  const mockDistanceMatrix = {
    rows: [
      {
        elements: [
          {
            distance: {
              text: '75 m',
              value: 75,
            },
          },
        ],
      },
    ],
    status: 'OK',
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

    const response = await OptionTwoResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'OptionTwo.getResponse - Error: InternalError',
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

    const response = await OptionTwoResponse.getResponse(handlerInput);
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

    const response = await OptionTwoResponse.getResponse(handlerInput);

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

    const speakOutput = speaks.OPTION2_YES_BUSSTOP.format(
      Util.getSpeakMinute(
        freshness,
        speaks.OPTION1_MINUTE,
        speaks.OPTION1_MINUTES,
      ),
      mockParadasProximas.paradas[0].desc,
    );
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speakOutput)
      .getResponse();

    const response = await OptionTwoResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with freshness in 1 minute', async () => {
    const freshness = 1;

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockParadasProximas;
    GMaps.getDistanceMatrix = () => mockDistanceMatrix;

    const speakOutput = speaks.OPTION2_YES_BUSSTOP.format(
      Util.getSpeakMinute(
        freshness,
        speaks.OPTION1_MINUTE,
        speaks.OPTION1_MINUTES,
      ),
      mockParadasProximas.paradas[0].desc,
    );
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speakOutput)
      .getResponse();

    const response = await OptionTwoResponse.getResponse(handlerInput);

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
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION1)
      .getResponse();

    const response = await OptionTwoResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response is not bus stop with freshness in 1 minute', async () => {
    const freshness = 1;

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
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.CHOOSE_OPTION1)
      .getResponse();

    const response = await OptionTwoResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
