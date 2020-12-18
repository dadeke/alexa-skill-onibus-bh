const Alexa = require('ask-sdk-core');

/* *
 * O intent reflector é usado para teste e depuração do modelo de interação.
 * Ele simplesmente repetirá a intenção que o usuário disse.
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `Você acabou de ativar ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        // Adicione um novo prompt se quiser manter a sessão aberta
        // para o usuário responder.
        // .reprompt('nova pergunta')
        .getResponse()
    );
  },
};

module.exports = IntentReflectorHandler;
