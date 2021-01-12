const Alexa = require('ask-sdk-core');

const OptionOneResponse = require('../../lambda/responses/OptionOneResponse');
const Util = require('../../lambda/util');
const GeoSupported = require('../../lambda/responses/GeoSupportedResponse');
const BHBus = require('../../lambda/api/bhbus');
const GMaps = require('../../lambda/api/googlemaps');
const speaks = require('../../lambda/speakStrings');

function testFormatSpeak(freshness, busStops, dmElements) {
  const speakFreshness = Util.getSpeakMinute(
    freshness,
    speaks.OPTION1_MINUTE,
    speaks.OPTION1_MINUTES,
  );

  let speak = null;
  if (busStops.length > 1) {
    speak = speaks.OPTION1.format(
      speaks.OPTION1_BUSSTOPS.format(busStops.length),
      speaks.OPTION1_NEXTSTOPS,
      speakFreshness,
      speaks.OPTION1_ARE,
    );
  } else {
    speak = speaks.OPTION1.format(
      speaks.OPTION1_BUSSTOP,
      speaks.OPTION1_NEXTSTOP,
      speakFreshness,
      speaks.OPTION1_IS,
    );
  }

  let speakLocations = [];
  for (let index = 0; index < dmElements.length; index += 1) {
    speakLocations.push(
      speaks.OPTION1_LOCATION.format(
        busStops[index].desc,
        dmElements[index].distance.text,
        dmElements[index].duration.text,
      ),
    );
  }
  speakLocations = speakLocations.join(', ');

  return `${speak + speakLocations}. `;
}

describe('Test OptionOneResponse', () => {
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
      {
        cod: 8986,
        desc: 'AVE VEREADOR CICERO ILDEFONSO, 639',
      },
      {
        cod: 11060,
        desc: 'AVE SANTA MATILDE, 403',
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
            },
            duration: {
              text: '1 min',
            },
          },
          {
            distance: {
              text: '65 m',
            },
            duration: {
              text: '1 min',
            },
          },
          {
            distance: {
              text: '0,1 km',
            },
            duration: {
              text: '1 min',
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

    const response = await OptionOneResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'OptionOne.getResponse - Error: InternalError',
    );
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

    const speakOutput =
      testFormatSpeak(
        freshness,
        mockParadasProximas.paradas,
        mockDistanceMatrix.rows[0].elements,
      ) +
      speaks.OPTION1_CAUTION +
      speaks.OPTION1_REPEAT;
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.OPTION1_REPEAT)
      .getResponse();

    const response = await OptionOneResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with freshness in 1 minute and only one bus stop', async () => {
    const freshness = 1;
    const mockOneParadasProximas = {
      sucesso: true,
      paradas: [
        {
          cod: 11103,
          desc: 'AVE SANTA MATILDE, 486',
        },
      ],
    };
    const mockOneDistanceMatrix = {
      rows: [
        {
          elements: [
            {
              distance: {
                text: '75 m',
              },
              duration: {
                text: '1 min',
              },
            },
          ],
        },
      ],
    };

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockOneParadasProximas;
    GMaps.getDistanceMatrix = () => mockOneDistanceMatrix;

    const speakOutput =
      testFormatSpeak(
        freshness,
        mockOneParadasProximas.paradas,
        mockOneDistanceMatrix.rows[0].elements,
      ) +
      speaks.OPTION1_CAUTION +
      speaks.OPTION1_REPEAT;
    // console.log(speakOutput);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withStandardCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.OPTION1_REPEAT)
      .getResponse();

    const response = await OptionOneResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
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

    const response = await OptionOneResponse.getResponse(handlerInput);
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

    const response = await OptionOneResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response problem when setSessionAttributes return error', async () => {
    setSessionAttributes.mockImplementation(() => {
      throw new Error('InternalError'); // Simula um erro genérico.
    });

    const freshness = 2;

    GeoSupported.getResponse = () => ({
      freshness,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    BHBus.buscarParadasProximas = () => mockParadasProximas;
    GMaps.getDistanceMatrix = () => mockDistanceMatrix;

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await OptionOneResponse.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'OptionOne.getResponse - Error: InternalError',
    );
  });
});
