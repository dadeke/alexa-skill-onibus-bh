const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');

/* *
 * FallbackIntent é acionado quando um usuário diz algo que não foi mapeado
 * para quaisquer intenções em sua skill.
 * Também deve ser definido no modelo de idioma (se o local suportar)
 * Este manipulador pode ser adicionado com segurança, mas será ignorado
 * em localidades em que ainda não é suportado.
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(speaks.NOT_UNDERSTAND)
      .withStandardCard(speaks.SKILL_NAME, speaks.NOT_UNDERSTAND)
      .reprompt(speaks.NOT_UNDERSTAND)
      .getResponse();
  },
};

module.exports = FallbackIntentHandler;
