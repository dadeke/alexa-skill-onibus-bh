const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const GeoSupported = require('./GeoSupportedResponse');

const BHBus = require('../api/bhbus');
const GMaps = require('../api/googlemaps');

function formatSpeak(freshness, busStops, dmElements) {
  let speakFreshness = `${freshness} `;
  if (freshness > 1) {
    speakFreshness += speaks.OPTION1_MINUTES;
  } else {
    speakFreshness += speaks.OPTION1_MINUTE;
  }

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

const OptionOne = {
  async getResponse(handlerInput) {
    try {
      const response = await GeoSupported.getResponse(handlerInput);

      if (response.freshness !== undefined) {
        const { freshness, latitude, longitude } = response;

        let busStops = await BHBus.buscarParadasProximas(latitude, longitude);
        // Pegar até no máximo 3 paradas.
        busStops = busStops.paradas.slice(0, 3);
        // console.log('busStops:', busStops);

        if (busStops.length === 0) {
          await setLastAccess(handlerInput);

          return handlerInput.responseBuilder
            .speak(speaks.OPTION1_SORRY)
            .withStandardCard(speaks.SKILL_NAME, speaks.OPTION1_SORRY)
            .withShouldEndSession(true)
            .getResponse();
        }

        let dmElements = await GMaps.getDistanceMatrix(
          latitude,
          longitude,
          busStops,
        );
        // Pegar apenas os elementos.
        // console.log('dmElements all:', dmElements);
        dmElements = dmElements.rows[0].elements;
        // console.log('dmElements clean:', dmElements);

        let speakOutput = formatSpeak(freshness, busStops, dmElements);
        speakOutput += speaks.OPTION1_CAUTION;

        // Dados de sessão para repetir a opção 1 caso o passageiro fale
        // "sim" ou "repetir".
        const { attributesManager } = handlerInput;
        const sessionAttributes =
          attributesManager.getSessionAttributes() || {};
        sessionAttributes.OptionOneResponseCache = speakOutput;
        attributesManager.setSessionAttributes(sessionAttributes);

        speakOutput += speaks.OPTION1_REPEAT;

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutput)
          .reprompt(speaks.OPTION1_REPEAT)
          .getResponse();
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `OptionOne.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = OptionOne;
