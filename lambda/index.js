const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const DDBAdapter = require('ask-sdk-dynamodb-persistence-adapter');

const LaunchRequestHandler = require('./handlers/LaunchRequestHandler');
const SetOptionIntentHandler = require('./handlers/SetOptionIntentHandler');
const SetBusLineIntentHandler = require('./handlers/SetBusLineIntentHandler');
const RepeatIntentHandler = require('./handlers/RepeatIntentHandler');
const YesNoIntentHandler = require('./handlers/YesNoIntentHandler');
const HelpIntentHandler = require('./handlers/HelpIntentHandler');
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler');
const FallbackIntentHandler = require('./handlers/FallbackIntentHandler');
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler');
// Apenas para testes.
// const IntentReflectorHandler = require('./handlers/IntentReflectorHandler');
const ErrorHandler = require('./handlers/ErrorHandler');

/* *
 * Este handler atua como o ponto de entrada para sua skill,
 * encaminhando todas as solicitações/respostas e cargas úteis para
 * os handlers acima.
 * Certifique-se de quaisquer novos handlers ou interceptors que você
 * tenha definido, esteja incluídos mais abaixo.
 * Isto é importante! Eles são processados de cima para baixo.
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(
    new DDBAdapter.DynamoDbPersistenceAdapter({
      tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
      createTable: false,
      dynamoDBClient: new AWS.DynamoDB({
        apiVersion: 'latest',
        region: process.env.DYNAMODB_PERSISTENCE_REGION,
      }),
    }),
  )
  .addRequestHandlers(
    LaunchRequestHandler,
    RepeatIntentHandler,
    SetOptionIntentHandler,
    SetBusLineIntentHandler,
    YesNoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    // Certifique-se de que IntentReflectorHandler seja o último para que não
    // substitua seus manipuladores de intent personalizados.
    // IntentReflectorHandler, // Apenas para testes em ambiente dev.
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
