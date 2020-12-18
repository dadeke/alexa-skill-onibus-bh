const Alexa = require('ask-sdk-core');

const GeoSupported = require('../../lambda/responses/GeoSupportedResponse');
const speaks = require('../../lambda/speakStrings');

describe('Test GeoSupportedResponse', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        timestamp: Date.now(),
      },
      context: {
        System: {
          device: {
            supportedInterfaces: {
              Geolocation: true,
            },
          },
          user: {
            permissions: {
              scopes: {
                'alexa::devices:all:geolocation:read': {
                  status: 'GRANTED',
                },
              },
            },
          },
        },
        Geolocation: {
          coordinate: {
            accuracyInMeters: 55,
            latitudeInDegrees: '-19.925374',
            longitudeInDegrees: '-43.998182',
          },
          locationServices: {
            access: 'ENABLED',
            status: 'RUNNING',
          },
          timestamp: Date.now(),
        },
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Geolocation = true;
    handlerInput.requestEnvelope.context.System.user.permissions.scopes = {
      'alexa::devices:all:geolocation:read': {
        status: 'GRANTED',
      },
    };
    handlerInput.requestEnvelope.context.Geolocation = {
      coordinate: {
        accuracyInMeters: 55,
        latitudeInDegrees: '-19.925374',
        longitudeInDegrees: '-43.998182',
      },
      locationServices: {
        access: 'ENABLED',
        status: 'RUNNING',
      },
      timestamp: Date.now(),
    };
    handlerInput.requestEnvelope.context.Geolocation.timestamp = Date.now();
  });

  it('should be able can return response with problem', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate = undefined;
    handlerInput.requestEnvelope.context.System.user.permissions.scopes = undefined;

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      "GeoSupported.getResponse - TypeError: Cannot read property 'alexa::devices:all:geolocation:read' of undefined",
    );
  });

  it('should be able can return response with device does not support geolocation updates', async () => {
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Geolocation = false;

    const outputSpeech = testResponseBuilder
      .speak(speaks.UNSUPPORTED_DEVICE_MSG)
      .withStandardCard(speaks.SKILL_NAME, speaks.UNSUPPORTED_DEVICE_MSG)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return response with location inaccurate', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate.accuracyInMeters = 101;

    const outputSpeech = testResponseBuilder
      .speak(speaks.LOCATION_INACCURATE)
      .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_INACCURATE)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'GeoSupported.getResponse - LOCATION_INACCURATE',
    );
  });

  it('should be able can return response with location error', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate = undefined;

    const outputSpeech = testResponseBuilder
      .speak(speaks.LOCATION_ERROR)
      .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_ERROR)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'GeoSupported.getResponse - LOCATION_ERROR',
    );
  });

  it('should be able can return response with location not running', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate = undefined;
    handlerInput.requestEnvelope.context.Geolocation.locationServices.status =
      'UNKNOWN';

    const outputSpeech = testResponseBuilder
      .speak(speaks.LOCATION_NOT_RUNNING)
      .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_NOT_RUNNING)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'GeoSupported.getResponse - LOCATION_NOT_RUNNING',
    );
  });

  it('should be able can return response with location disabled', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate = undefined;
    handlerInput.requestEnvelope.context.Geolocation.locationServices.access =
      'DISABLED';

    const outputSpeech = testResponseBuilder
      .speak(speaks.LOCATION_DISABLED)
      .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_DISABLED)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'GeoSupported.getResponse - LOCATION_DISABLED',
    );
  });

  it('should be able can return response with location disabled when Geolocation is undefined', async () => {
    handlerInput.requestEnvelope.context.Geolocation = undefined;

    const outputSpeech = testResponseBuilder
      .speak(speaks.LOCATION_DISABLED)
      .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_DISABLED)
      .withShouldEndSession(true)
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'GeoSupported.getResponse - geoObject is undefined',
    );
  });

  it('should be able can return response with ask for permissions consent card', async () => {
    handlerInput.requestEnvelope.context.Geolocation.coordinate = undefined;
    handlerInput.requestEnvelope.context.System.user.permissions.scopes = {
      'alexa::devices:all:geolocation:read': {
        status: 'DENIED',
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.PERMISSION_CARD_MSG)
      .withAskForPermissionsConsentCard(['alexa::devices:all:geolocation:read'])
      .getResponse();

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return GeoData with freshness, latitude and longitude', async () => {
    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual({
      freshness: 1,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able can return GeoData with freshness in more than 1 minute', async () => {
    handlerInput.requestEnvelope.context.Geolocation.timestamp =
      Date.now() - 5 * 60 * 1000; // Subtrai 5 minutos do Geolocation timestamp.

    const response = await GeoSupported.getResponse(handlerInput);

    expect(response).toEqual({
      freshness: 5,
      latitude: '-19.925374',
      longitude: '-43.998182',
    });
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
