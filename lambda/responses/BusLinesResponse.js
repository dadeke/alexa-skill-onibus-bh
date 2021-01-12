const speaks = require('../speakStrings');
const { addSpaceBetweenFourDigits, setLastAccess } = require('../util');

const BHBus = require('../api/bhbus');

function formatSpeakBusLineNumbers(busLines) {
  let speak = null;

  if (busLines.length > 1) {
    const listBusLines = [];
    for (let index = 0; index < busLines.length - 1; index += 1) {
      let busLine = busLines[index];
      if (busLine.length >= 4) {
        busLine = addSpaceBetweenFourDigits(busLine);
      }

      listBusLines.push(busLine);
    }
    speak = listBusLines.join(', ');
    speak +=
      speaks.AND + addSpaceBetweenFourDigits(busLines[busLines.length - 1]);
  } else {
    speak = addSpaceBetweenFourDigits(busLines[0]);
  }

  return speak;
}

function formatSpeakBusLineNumbersCard(busLines) {
  let speak = null;

  if (busLines.length > 1) {
    const listBusLines = [];
    for (let index = 0; index < busLines.length - 1; index += 1) {
      listBusLines.push(busLines[index]);
    }
    speak = listBusLines.join(', ');
    speak += speaks.AND + busLines[busLines.length - 1];
  } else {
    [speak] = busLines;
  }

  return speak;
}

const BusLines = {
  async getResponse(handlerInput) {
    try {
      const { attributesManager } = handlerInput;
      const sessionAttributes = attributesManager.getSessionAttributes() || {};
      const codBusStop = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'codBusStop',
      )
        ? sessionAttributes.codBusStop
        : false;
      let busLines = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'busLines',
      )
        ? sessionAttributes.busLines
        : false;

      if (codBusStop !== false) {
        if (busLines === false) {
          busLines = await BHBus.retornaLinhasQueAtendemParada(codBusStop);
          busLines = busLines.linhas.map(item => item.num_linha);
          // console.log('busLines:', busLines);
        }

        const busLinesOutput = formatSpeakBusLineNumbers(busLines);
        const busLinesCardOutput = formatSpeakBusLineNumbersCard(busLines);

        let speakOutput = speaks.OPTION2_BUSLINENUMBERS.format(busLinesOutput);
        let speakOutputCard = speaks.OPTION2_BUSLINENUMBERS.format(
          busLinesCardOutput,
        );

        if (busLines.length === 1) {
          speakOutput += speaks.OPTION2_THIS_BUSLINE;
          speakOutputCard += speaks.OPTION2_THIS_BUSLINE;
        } else {
          speakOutput += speaks.OPTION2_SPECIFY_BUSLINE;
          speakOutputCard += speaks.OPTION2_SPECIFY_BUSLINE;
        }

        // Dados de sessão para continuar seguindo o fluxo da opção 2 caso
        // o passageiro responda "Sim".
        sessionAttributes.optionNumber = '2';
        sessionAttributes.codBusStop = codBusStop;
        sessionAttributes.especificBusLine = false;
        sessionAttributes.busLines = busLines;
        sessionAttributes.BusLinesResponseCache = speakOutput;
        sessionAttributes.BusLinesResponseCardCache = speakOutputCard;
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withStandardCard(speaks.SKILL_NAME, speakOutputCard)
          .reprompt(speakOutput)
          .getResponse();
      }

      throw new Error('codBusStop not found');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', `BusLines.getResponse - ${error}`);
    }

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = BusLines;
