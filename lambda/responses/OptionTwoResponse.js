const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

const GeoSupported = require('./GeoSupportedResponse');

const BHBus = require('../api/bhbus');
const GMaps = require('../api/googlemaps');

function formatSpeakNot(freshness) {
  let speakFreshness = `${freshness} `;
  if (freshness > 1) {
    speakFreshness += speaks.OPTION1_MINUTES;
  } else {
    speakFreshness += speaks.OPTION1_MINUTE;
  }

  return speaks.OPTION2_NOT_BUSSTOP.format(speakFreshness);
}

function formatSpeakYes(freshness, busStops) {
  let speakFreshness = `${freshness} `;
  if (freshness > 1) {
    speakFreshness += speaks.OPTION1_MINUTES;
  } else {
    speakFreshness += speaks.OPTION1_MINUTE;
  }

  const speakLocation = busStops[0].desc;

  return speaks.OPTION2_YES_BUSSTOP.format(speakFreshness, speakLocation);
}

const OptionTwo = {
  async getResponse(handlerInput) {
    try {
      const response = await GeoSupported.getResponse(handlerInput);

      if (response.freshness !== undefined) {
        const { freshness, latitude, longitude } = response;

        let busStops = await BHBus.buscarParadasProximas(latitude, longitude);
        // Pegar apenas a parada mais próxima.
        busStops = busStops.paradas.slice(0, 1);
        // console.log('busStops:', busStops);

        if (busStops.length === 0) {
          return handlerInput.responseBuilder
            .speak(speaks.OPTION1_SORRY)
            .withStandardCard(speaks.SKILL_NAME, speaks.OPTION1_SORRY)
            .withShouldEndSession(true)
            .getResponse();
        }

        const dmElements = await GMaps.getDistanceMatrix(
          latitude,
          longitude,
          busStops,
        );
        // Pegar apenas o elemento da parada mais próxima.
        const dmElement = dmElements.rows[0].elements[0];
        // console.log('dmElements:', dmElements);

        // Verificar se está próximo da parada de ônibus em
        // no mínimo 100 metros.
        if (dmElement.distance.value > 100) {
          const speakOutput = formatSpeakNot(freshness);

          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withStandardCard(speaks.SKILL_NAME, speakOutput)
            .withShouldEndSession(true)
            .getResponse();
        }

        const speakOutput = formatSpeakYes(freshness, busStops);

        // Dados de sessão para continuar seguindo o fluxo da opção 2
        // caso o passageiro responda "sim" ou caso ele
        // peça para "repetir".
        const { attributesManager } = handlerInput;
        const sessionAttributes =
          attributesManager.getSessionAttributes() || {};
        sessionAttributes.optionNumber = '2';
        sessionAttributes.codBusStop = busStops[0].cod;
        sessionAttributes.OptionTwoResponseCache = speakOutput;
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutput)
          .reprompt(speakOutput)
          .getResponse();
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `OptionTwo.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = OptionTwo;
