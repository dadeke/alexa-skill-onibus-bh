const Alexa = require('ask-sdk-core');

const BusLine = require('../../lambda/responses/BusLineResponse');
const SetBusLineIntentHandler = require('../../lambda/handlers/SetBusLineIntentHandler');

describe('Sequence 06. Test scenario: SetBusLineIntent', () => {
  const getResponse = jest.fn();
  BusLine.getResponse = getResponse;

  const handlerInput = {
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetBusLineIntent',
          slots: {
            bus_line_string: {
              value: '15 09',
            },
          },
        },
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };

  beforeEach(() => {
    handlerInput.requestEnvelope.request.intent.name = 'SetBusLineIntent';
  });

  it('should be able can not handle SetBusLineIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetBusLineIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can handle SetBusLineIntent', () => {
    expect(SetBusLineIntentHandler.canHandle(handlerInput)).toEqual(true);
  });

  it('should be able can return response', async () => {
    await SetBusLineIntentHandler.handle(handlerInput);

    expect(getResponse).toHaveBeenCalled();
  });
});
