const axios = require('axios');
const AxiosMock = require('axios-mock-adapter');

const GMaps = require('../../lambda/api/googlemaps');

const urlAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const urlRegex = new RegExp(`${urlAPI}/*`);

const apiMock = new AxiosMock(axios);

describe('Test only code Google Maps API', () => {
  const mockConsoleError = jest.fn();
  // eslint-disable-next-line no-console
  console.error = mockConsoleError;

  const apiMockResponse = {
    destination_addresses: [
      'R. Prof. Baeta Neves, 185 - Alto dos Pinheiros, Belo Horizonte - MG, 30530-020, Brasil',
      'Rua Deusdedith de Assis, 196 - Dom Bosco, Belo Horizonte - MG, 30850-450, Brasil',
      'Rua Deusdedith de Assis, 221 - Dom Bosco, Belo Horizonte - MG, 30850-450, Brasil',
    ],
    origin_addresses: [
      'Av. Santa Matilde, 530 - Dom Cabral, Belo Horizonte - MG, 30530-010, Brasil',
    ],
    rows: [
      {
        elements: [
          {
            distance: {
              text: '0,7 km',
              value: 662,
            },
            duration: {
              text: '11 minutos',
              value: 632,
            },
            status: 'OK',
          },
          {
            distance: {
              text: '1,3 km',
              value: 1305,
            },
            duration: {
              text: '20 minutos',
              value: 1184,
            },
            status: 'OK',
          },
          {
            distance: {
              text: '1,3 km',
              value: 1257,
            },
            duration: {
              text: '19 minutos',
              value: 1130,
            },
            status: 'OK',
          },
        ],
      },
    ],
    status: 'OK',
  };
  const busstops = [
    {
      desc: 'RUA PROFESSOR BEATA NEVES, 185',
    },
    {
      desc: 'RUA DEUSDEDITH DE ASSIS, 196',
    },
    {
      desc: 'RUA DEUSDEDITH DE ASSIS, 221',
    },
  ];

  it('should be able call getDistanceMatrix with success', async () => {
    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await GMaps.getDistanceMatrix('-19.925374', '-43.998182', busstops);

    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should be able call getDistanceMatrix with return error', async () => {
    apiMock.onGet(urlRegex).networkError();

    await GMaps.getDistanceMatrix('-19.925374', '-43.998182', busstops);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'getDistanceMatrix - Error: Network Error',
    );
  });

  it('should be able call getDistanceMatrix with return error in data', async () => {
    apiMockResponse.status = 'ERROR';

    apiMock.onGet(urlRegex).reply(200, apiMockResponse);

    await GMaps.getDistanceMatrix('-19.925374', '-43.998182', busstops);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'getDistanceMatrix - Error: "status" is not OK',
    );
  });

  it('should be able call getDistanceMatrix with return error when status code is not 200', async () => {
    apiMock.onGet(urlRegex).reply(500);

    await GMaps.getDistanceMatrix('-19.925374', '-43.998182', busstops);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'getDistanceMatrix - Error: HTTP status code <500>',
    );
  });
});
