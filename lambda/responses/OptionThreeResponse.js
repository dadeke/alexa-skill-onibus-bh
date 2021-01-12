const speaks = require('../speakStrings');
const { getSpeakMinute, setLastAccess } = require('../util');

const GeoSupported = require('./GeoSupportedResponse');

const BHBus = require('../api/bhbus');
const GMaps = require('../api/googlemaps');

const OptionThree = {
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
            .speak(speaks.SORRY_NOT_NEXTSTOPS)
            .withStandardCard(speaks.SKILL_NAME, speaks.SORRY_NOT_NEXTSTOPS)
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
          const speakOutput =
            speaks.NOT_BUSSTOP.format(
              getSpeakMinute(
                freshness,
                speaks.OPTION1_MINUTE,
                speaks.OPTION1_MINUTES,
              ),
            ) + speaks.CHOOSE_OPTION1;

          // Dados de sessão para pular para opção 1 caso o passageiro
          // responda "sim".
          const { attributesManager } = handlerInput;
          const sessionAttributes =
            attributesManager.getSessionAttributes() || {};
          sessionAttributes.optionNumber = '1';
          attributesManager.setSessionAttributes(sessionAttributes);

          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withStandardCard(speaks.SKILL_NAME, speakOutput)
            .reprompt(speaks.CHOOSE_OPTION1)
            .getResponse();
        }

        let busLines = await BHBus.retornaLinhasQueAtendemParada(
          busStops[0].cod,
        );
        busLines = busLines.linhas.map(item => item.num_linha);

        const { attributesManager } = handlerInput;
        const sessionAttributes =
          attributesManager.getSessionAttributes() || {};
        // Limpar response cache.
        sessionAttributes.OptionOneResponseCache = undefined;
        sessionAttributes.OptionTwoResponseCache = undefined;
        sessionAttributes.BusLinesResponseCache = undefined;
        sessionAttributes.BusLinesResponseCardCache = undefined;
        // Dados de sessão para continuar seguindo o fluxo da opção 3.
        sessionAttributes.optionNumber = '3';
        sessionAttributes.codBusStop = busStops[0].cod;
        sessionAttributes.especificBusLine = true;
        sessionAttributes.busLines = busLines;
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speaks.WHAT_BUSLINE)
          .withStandardCard(speaks.SKILL_NAME, speaks.WHAT_BUSLINE)
          .reprompt(speaks.WHAT_BUSLINE)
          .getResponse();
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `OptionThree.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = OptionThree;
