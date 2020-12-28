/* *
 * Utilidades compartilhadas.
 * */

/**
 * Retorna um número randômico de 0 até o número máximo especificado.
 */
module.exports.getNumberRand = function getNumberRand(maxNumber) {
  return Math.floor(Math.random() * (maxNumber + 1));
};

/* *
 * Adiciona um espaço em branco apenas nos números das linhas de ônibus
 * que possuem mais de 4 dígitos a fim de que a fala da Alexa
 * fique mais popular. Exemplo: 1509 => 15 09, 5506A => 55 06 A
 * */
module.exports.addSpaceBetweenFourDigits = function addSpaceBetweenFourDigits(
  stringNumber,
) {
  try {
    if (stringNumber.length < 4) {
      return stringNumber;
    }

    let modifiedStringNumber = `${stringNumber[0] + stringNumber[1]} ${
      stringNumber[2] + stringNumber[3]
    }`;

    // Linhas de ônibus com 4 dígitos e uma letra.
    // Exemplo: 5506A => 55 06 A
    if (stringNumber.length === 5) {
      modifiedStringNumber += ` ${stringNumber[4]}`;
    }

    return modifiedStringNumber;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`addSpaceBetweenFourDigits - ${error}`);

    throw new Error(`addSpaceBetweenFourDigits - ${error}`);
  }
};

/* *
 * Persistir que passageiro já acessou a fim de falar o "Bem vindo de volta!".
 * Utilizar o ID perfil de voz caso o mesmo esteja disponível.
 * */
module.exports.setLastAccess = async function setLastAccess(handlerInput) {
  try {
    const { person } = handlerInput.requestEnvelope.context.System;

    let personId = 'default';
    if (person) {
      personId = person.personId;
    }
    const personAttributes = {
      [personId]: {
        // Salva a data do último acesso do passageiro.
        lastAccess: new Date().toISOString(),
      },
    };

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    Object.assign(sessionAttributes, personAttributes);

    // Não persistir as variáveis de sessão.
    sessionAttributes.lastIntent = undefined;
    sessionAttributes.optionNumber = undefined;
    sessionAttributes.codBusStop = undefined;
    sessionAttributes.especificBusLine = undefined;
    sessionAttributes.busLines = undefined;
    sessionAttributes.OptionOneResponseCache = undefined;
    sessionAttributes.OptionTwoResponseCache = undefined;
    sessionAttributes.BusLinesResponseCache = undefined;
    sessionAttributes.BusLinesResponseCardCache = undefined;

    attributesManager.setPersistentAttributes(sessionAttributes);
    await attributesManager.savePersistentAttributes();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`setLastAccess - ${error}`);
  }
};
