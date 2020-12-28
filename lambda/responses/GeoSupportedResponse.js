const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const ACCURACY_THRESHOLD = 100; // Precisão de 100 metros necessária.

const GeoSupported = {
  async getResponse(handlerInput) {
    try {
      const { context, request } = handlerInput.requestEnvelope;
      const isGeoSupported =
        context.System.device.supportedInterfaces.Geolocation;

      if (isGeoSupported) {
        const geoObject = context.Geolocation;
        // Log do objeto de geo-coordenadas.
        // console.log(JSON.stringify(geoObject));

        if (!geoObject || !geoObject.coordinate) {
          // Verificar se há permissão para obter atualizações de localização.
          const skillPermissionGranted =
            context.System.user.permissions.scopes[
              'alexa::devices:all:geolocation:read'
            ].status === 'GRANTED';

          if (!skillPermissionGranted) {
            return handlerInput.responseBuilder
              .speak(speaks.PERMISSION_CARD_MSG)
              .withAskForPermissionsConsentCard([
                'alexa::devices:all:geolocation:read',
              ])
              .getResponse();
          }

          if (!geoObject) {
            // eslint-disable-next-line no-console
            console.error(
              'Error:',
              'GeoSupported.getResponse - geoObject is undefined',
            );

            await setLastAccess(handlerInput);

            return handlerInput.responseBuilder
              .speak(speaks.LOCATION_DISABLED)
              .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_DISABLED)
              .withShouldEndSession(true)
              .getResponse();
          }

          if (geoObject.locationServices.access !== 'ENABLED') {
            // eslint-disable-next-line no-console
            console.error(
              'Error:',
              'GeoSupported.getResponse - LOCATION_DISABLED',
            );

            await setLastAccess(handlerInput);

            return handlerInput.responseBuilder
              .speak(speaks.LOCATION_DISABLED)
              .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_DISABLED)
              .withShouldEndSession(true)
              .getResponse();
          }

          if (geoObject.locationServices.status !== 'RUNNING') {
            // eslint-disable-next-line no-console
            console.error(
              'Error:',
              'GeoSupported.getResponse - LOCATION_NOT_RUNNING',
            );

            await setLastAccess(handlerInput);

            return handlerInput.responseBuilder
              .speak(speaks.LOCATION_NOT_RUNNING)
              .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_NOT_RUNNING)
              .withShouldEndSession(true)
              .getResponse();
          }

          // eslint-disable-next-line no-console
          console.error('Error:', 'GeoSupported.getResponse - LOCATION_ERROR');

          await setLastAccess(handlerInput);

          return handlerInput.responseBuilder
            .speak(speaks.LOCATION_ERROR)
            .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_ERROR)
            .withShouldEndSession(true)
            .getResponse();
        }

        // Retornar os dados de geolocalização apenas se a precisão for menor
        // ou igual a 100 metros.
        if (
          geoObject &&
          geoObject.coordinate &&
          geoObject.coordinate.accuracyInMeters <= ACCURACY_THRESHOLD
        ) {
          // Tempo do frescor da geolocalização em segundos.
          let freshness =
            (new Date(request.timestamp) - new Date(geoObject.timestamp)) /
            1000;
          if (freshness <= 0) {
            // Remover o zero segundo e segundos negativos e
            // considerar como 1 minuto.
            freshness = 1;
          } else {
            // Converter para minutos.
            freshness /= 60;
            freshness = Math.round(freshness);
          }

          const GeoData = {
            freshness,
            latitude: geoObject.coordinate.latitudeInDegrees,
            longitude: geoObject.coordinate.longitudeInDegrees,
          };
          //
          // For tests
          //
          // const GeoData = {
          //   freshness: 4,
          //   latitude: '-19.924097',
          //   longitude: '-43.947789',
          // };

          return GeoData;
        }

        // eslint-disable-next-line no-console
        console.error(
          'Error:',
          'GeoSupported.getResponse - LOCATION_INACCURATE',
        );

        await setLastAccess(handlerInput);

        return handlerInput.responseBuilder
          .speak(speaks.LOCATION_INACCURATE)
          .withStandardCard(speaks.SKILL_NAME, speaks.LOCATION_INACCURATE)
          .withShouldEndSession(true)
          .getResponse();
      }

      await setLastAccess(handlerInput);

      return handlerInput.responseBuilder
        .speak(speaks.UNSUPPORTED_DEVICE_MSG)
        .withStandardCard(speaks.SKILL_NAME, speaks.UNSUPPORTED_DEVICE_MSG)
        .withShouldEndSession(true)
        .getResponse();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `GeoSupported.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = GeoSupported;
