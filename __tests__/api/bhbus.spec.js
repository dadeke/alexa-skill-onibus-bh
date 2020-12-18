const axios = require('axios');
const AxiosMock = require('axios-mock-adapter');

const BHBus = require('../../lambda/api/bhbus');

process.env.URL_API_BHWS = 'https://ws.seuwebservice.com.br';
const urlAPI = process.env.URL_API_BHWS;

const apiMock = new AxiosMock(axios);

function getMockResponse(objectMockResponse) {
  return `retornoJSON(${JSON.stringify(objectMockResponse)})`;
}

describe('Test only code BHBus API', () => {
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const mockParadasProximas = {
    sucesso: true,
    paradas: [
      {
        cod: 11103,
        siu: '31173',
        x: -43.998686,
        y: -19.924849,
        desc: 'AVE SANTA MATILDE, 486',
      },
      {
        cod: 8986,
        siu: '30471',
        x: -43.998928,
        y: -19.925565,
        desc: 'AVE VEREADOR CICERO ILDEFONSO, 639',
      },
      {
        cod: 11060,
        siu: '31172',
        x: -43.998784,
        y: -19.924622,
        desc: 'AVE SANTA MATILDE, 403',
      },
    ],
  };
  const mockLinhasQueAtendemParada = {
    sucesso: true,
    mensagem: '',
    linhas: [
      {
        cod_linha: 32,
        num_linha: '1145',
        descricao: 'BAIRRO DAS INDUSTRIAS',
        cor: 4,
      },
      {
        cod_linha: 67,
        num_linha: '1505',
        descricao: 'ALTO DOS PINHEIROS/TUPI',
        cor: 4,
      },
      {
        cod_linha: 75,
        num_linha: '1509',
        descricao: 'CALIFORNIA/TUPI',
        cor: 4,
      },
      {
        cod_linha: 205,
        num_linha: '30',
        descricao: 'ESTACAO DIAMANTE/CENTRO',
        cor: 4,
      },
    ],
  };
  const mockPrevisoes = {
    sucesso: true,
    previsoes: [
      {
        sgLin: '1145',
        prev: '14 Minutos',
        tpAcess: 6,
        cor: 3,
        numVeicGestor: '40734',
        apelidoLinha: 'BAIRRO DAS INDUSTRIAS',
        codItinerario: 49510,
      },
      {
        sgLin: '1505',
        prev: 'SAÍDA: 19:50',
        tpAcess: 0,
        cor: 4,
        apelidoLinha: 'VIA CONJUNTO FELICIDADE',
        codItinerario: 46057,
      },
      {
        sgLin: '1505',
        prev: 'SAÍDA: 20:30',
        tpAcess: 0,
        cor: 4,
        apelidoLinha: 'VIA CONJUNTO FELICIDADE',
        codItinerario: 46057,
      },
      {
        sgLin: '1509',
        prev: '18 Minutos',
        tpAcess: 6,
        cor: 4,
        numVeicGestor: '30668',
        apelidoLinha: 'TUPI / CALIFORNIA',
        codItinerario: 46280,
      },
    ],
  };

  beforeEach(() => {
    mockParadasProximas.sucesso = true;
    mockLinhasQueAtendemParada.sucesso = true;
    mockPrevisoes.sucesso = true;
  });

  it('should be able call buscarParadasProximas with success', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarParadasProximas/*`);
    const apiMockResponse = getMockResponse(mockParadasProximas);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.buscarParadasProximas('-19.925374', '-43.998182');

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call buscarParadasProximas with return error', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarParadasProximas/*`);

    apiMock.onGet(urlRegex).networkError();

    await BHBus.buscarParadasProximas('-19.925374', '-43.998182');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarParadasProximas - Error: Network Error',
    );
  });

  it('should be able call buscarParadasProximas with return error in data', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarParadasProximas/*`);

    mockParadasProximas.sucesso = false;
    const apiMockResponse = getMockResponse(mockParadasProximas);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.buscarParadasProximas('-19.925374', '-43.998182');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarParadasProximas - Error: "success" is not true',
    );
  });

  it('should be able call buscarParadasProximas with return error when status code is not 200', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarParadasProximas/*`);

    apiMock.onGet(urlRegex).reply(500);

    await BHBus.buscarParadasProximas('-19.925374', '-43.998182');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarParadasProximas - Error: HTTP status code <500>',
    );
  });

  it('should be able call retornaLinhasQueAtendemParada with success', async () => {
    const urlRegex = new RegExp(`${urlAPI}/retornaLinhasQueAtendemParada/*`);
    const apiMockResponse = getMockResponse(mockPrevisoes);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.retornaLinhasQueAtendemParada('8711');

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call retornaLinhasQueAtendemParada with return error', async () => {
    const urlRegex = new RegExp(`${urlAPI}/retornaLinhasQueAtendemParada/*`);

    apiMock.onGet(urlRegex).networkError();

    await BHBus.retornaLinhasQueAtendemParada('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'retornaLinhasQueAtendemParada - Error: Network Error',
    );
  });

  it('should be able call retornaLinhasQueAtendemParada with return error in data', async () => {
    const urlRegex = new RegExp(`${urlAPI}/retornaLinhasQueAtendemParada/*`);

    mockLinhasQueAtendemParada.sucesso = false;
    const apiMockResponse = getMockResponse(mockLinhasQueAtendemParada);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.retornaLinhasQueAtendemParada('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'retornaLinhasQueAtendemParada - Error: "success" is not true',
    );
  });

  it('should be able call retornaLinhasQueAtendemParada with return error when status code is not 200', async () => {
    const urlRegex = new RegExp(`${urlAPI}/retornaLinhasQueAtendemParada/*`);

    apiMock.onGet(urlRegex).reply(500);

    await BHBus.retornaLinhasQueAtendemParada('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'retornaLinhasQueAtendemParada - Error: HTTP status code <500>',
    );
  });

  it('should be able call buscarPrevisoes with success', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarPrevisoes/*`);
    const apiMockResponse = getMockResponse(mockLinhasQueAtendemParada);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.buscarPrevisoes('8711');

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call buscarPrevisoes with return error', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarPrevisoes/*`);

    apiMock.onGet(urlRegex).networkError();

    await BHBus.buscarPrevisoes('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarPrevisoes - Error: Network Error',
    );
  });

  it('should be able call buscarPrevisoes with return error in data', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarPrevisoes/*`);

    mockPrevisoes.sucesso = false;
    const apiMockResponse = getMockResponse(mockPrevisoes);

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await BHBus.buscarPrevisoes('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarPrevisoes - Error: "success" is not true',
    );
  });

  it('should be able call buscarPrevisoes with return error when status code is not 200', async () => {
    const urlRegex = new RegExp(`${urlAPI}/buscarPrevisoes/*`);

    apiMock.onGet(urlRegex).reply(500);

    await BHBus.buscarPrevisoes('8711');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'buscarPrevisoes - Error: HTTP status code <500>',
    );
  });
});
