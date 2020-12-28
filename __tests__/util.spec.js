const Util = require('../lambda/util');

const personId = 'amzn1.ask.person.XXXXXXXX';

describe('Test Util', () => {
  const mockConsoleError = jest.fn();
  const getSessionAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
      },
      context: {
        System: {},
      },
    },
  };

  beforeEach(() => {
    handlerInput.requestEnvelope.context.System.person = undefined;
  });

  it('should be able call getNumberRand with success', () => {
    const number = Util.getNumberRand(2);

    expect(number === 0 || number === 1 || number === 2).toBe(true);
  });

  it('should be able call addSpaceBetweenFourDigits with success', () => {
    const responseA = Util.addSpaceBetweenFourDigits('1509');
    const responseB = Util.addSpaceBetweenFourDigits('5506A');
    const responseC = Util.addSpaceBetweenFourDigits('63');

    expect(responseA).toEqual('15 09');
    expect(responseB).toEqual('55 06 A');
    expect(responseC).toEqual('63');
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call addSpaceBetweenFourDigits with error when stringNumber is undefined', () => {
    let currentError = {
      message: null,
    };
    const errorMessage =
      'addSpaceBetweenFourDigits - ' +
      "TypeError: Cannot read property 'length' of undefined";

    try {
      Util.addSpaceBetweenFourDigits(undefined);
    } catch (error) {
      currentError = error;
    }

    expect(mockConsoleError).toHaveBeenCalledWith(errorMessage);
    expect(currentError.message).toEqual(errorMessage);
  });

  it('should be able call setLastAccess with success', () => {
    Util.setLastAccess(handlerInput);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call setLastAccess personalized with success', () => {
    handlerInput.requestEnvelope.context.System.person = { personId };

    Util.setLastAccess(handlerInput);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call setLastAccess with error', () => {
    // Simula um erro genérico ao persistir os dados.
    savePersistentAttributes.mockImplementation(() => {
      throw new Error('InternalError');
    });

    Util.setLastAccess(handlerInput);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'setLastAccess - Error: InternalError',
    );
  });
});
