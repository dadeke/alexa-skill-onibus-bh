const Alexa = require('ask-sdk-core');

const ErrorHandler = require('../../lambda/handlers/ErrorHandler');
const speaks = require('../../lambda/speakStrings');

describe('Sequence 13. Test: ErrorHandler', () => {
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can handle', () => {
    expect(ErrorHandler.canHandle()).toEqual(true);
  });

  it('should be able can return response', async () => {
    const handlerInput = {
      responseBuilder: Alexa.ResponseFactory.init(),
    };
    const error = new Error('Test ErrorHandler');

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withStandardCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await ErrorHandler.handle(handlerInput, error);

    expect(response).toEqual(outputSpeech);
    expect(mockConsoleError).toHaveBeenCalledWith('Error handled:', '{}');
  });
});
