const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');
const { addSpaceBetweenFourDigits, setLastAccess } = require('../util');

const BHBus = require('../api/bhbus');

const BusLine = {
  async getResponse(handlerInput) {
    try {
      let busLine = Alexa.getSlotValue(
        handlerInput.requestEnvelope,
        'bus_line_string',
      );
      // console.log('typeof busLine:', typeof busLine);

      const { attributesManager } = handlerInput;
      const sessionAttributes = attributesManager.getSessionAttributes() || {};
      const codBusStop = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'codBusStop',
      )
        ? sessionAttributes.codBusStop
        : false;
      const busLines = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'busLines',
      )
        ? sessionAttributes.busLines
        : false;

      let speakOutput = null;
      let speakOutputCard = null;
      if (
        busLine !== undefined &&
        busLine !== '?' &&
        codBusStop !== false &&
        busLines !== false
      ) {
        // Ajustes no número linha de ônibus.
        busLine = busLine.toUpperCase();
        busLine = busLine.replace(/[^A-Z0-9]/gi, '');
        // console.log('busLine:', busLine);

        const busLineSpeak = addSpaceBetweenFourDigits(busLine);
        // console.log('busLineSpeak:', busLineSpeak);

        // Verifica se o número da linha de ônibus que o passageiro falou,
        // realmente existe neste ponto de parada da BH TRANS.
        if (!busLines.includes(busLine)) {
          speakOutput = speaks.OPTION2_BUSSTOP_SORRY.format(busLineSpeak);
          speakOutputCard = speaks.OPTION2_BUSSTOP_SORRY.format(busLine);

          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
            .reprompt(speakOutput)
            .getResponse();
        }

        let busStopPredictions = await BHBus.buscarPrevisoes(codBusStop);
        busStopPredictions = busStopPredictions.previsoes;
        // console.log('busStopPredictions:', busStopPredictions);

        // Filtra apenas a previsão da linha de ônibus especificada.
        let predictionBusLine = busStopPredictions.filter(
          prediction => prediction.sgLin === busLine && prediction,
        );
        // console.log('predictionBusLine:', predictionBusLine);

        if (predictionBusLine.length >= 1) {
          predictionBusLine = predictionBusLine[0].prev;
          speakOutput = speaks.OPTION2_BUSSTOP_PREDICTION.format(
            busLineSpeak,
            predictionBusLine,
          );
          speakOutputCard = speaks.OPTION2_BUSSTOP_PREDICTION.format(
            busLine,
            predictionBusLine,
          );
        } else {
          speakOutput = speaks.OPTION2_NO_PREDICTION.format(busLineSpeak);
          speakOutputCard = speaks.OPTION2_NO_PREDICTION.format(busLine);
        }

        await setLastAccess(handlerInput);

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
          .withShouldEndSession(true)
          .getResponse();
      }

      // Linhas de ônibus com 4 dígitos e uma letra, o passageiro
      // precisa falar a palavra "número".
      // Por exemplo: 5506A => "número 55 06 A"
      // Infelizmente a Alexa ainda não consegue reconhecer a palavra "meia"
      // como sendo o número "seis" no número das linhas de ônibus, mas
      // futuramente isto poderá ser revisado.
      speakOutput = speaks.OPTION2_BUSLINE_NOT_UNDERSTAND;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withStandardCard(speaks.SKILL_NAME, speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `BusLine.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = BusLine;
