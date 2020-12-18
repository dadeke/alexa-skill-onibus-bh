const speaks = require('../speakStrings');
const { setLastAccess } = require('../util');

/* *
 * Tratamento de erros genéricos para capturar qualquer sintaxe ou erros
 * de roteamento.
 * Se você receber um erro informando que a cadeia do manipulador de solicitação
 * não foi encontrada, você não implementou um manipulador para o intent
 * que está sendo invocada ou incluiu isto no construtor de skills.
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    // eslint-disable-next-line no-console
    console.error('Error handled:', JSON.stringify(error));

    await setLastAccess(handlerInput);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = ErrorHandler;
