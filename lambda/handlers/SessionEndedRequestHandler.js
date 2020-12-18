const Alexa = require('ask-sdk-core');

/* *
 * SessionEndedRequest notifica que uma sessão foi encerrada.
 * Este manipulador será acionado quando uma sessão atualmente aberta
 * for fechada por um dos seguintes motivos:
 * 1) O usuário diz "sair" ou "parar".
 * 2) O usuário não responde ou diz algo que não corresponde
 * uma intenção definida em seu modelo de voz.
 * 3) Ocorreu algum erro.
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      'SessionEndedRequest'
    );
  },
  handle(handlerInput) {
    // eslint-disable-next-line no-console
    console.log('Session ended:', JSON.stringify(handlerInput.requestEnvelope));

    return handlerInput.responseBuilder.getResponse();
  },
};

module.exports = SessionEndedRequestHandler;
