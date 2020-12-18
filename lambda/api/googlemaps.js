const axios = require('axios');

const urlAPI = 'https://maps.googleapis.com/maps/api';
const apiKey = '[YOUR API KEY]';
const mode = 'walking';
const units = 'metric';
const region = 'br';
// Fixar a cidade a fim de não buscar informações de outras cidades.
const city = ', Belo Horizonte, MG';

function getResponse(endPoint) {
  return new Promise((resolve, reject) => {
    axios
      .get(endPoint, {
        headers: {
          'Accept-Language': 'pt-BR',
        },
      })
      .then(response => {
        if (response.data.status !== 'OK') {
          reject(Error('"status" is not OK'));
        }

        resolve(response.data);
      })
      .catch(error => {
        if (error.response) {
          reject(Error(`HTTP status code <${error.response.status}>`));
        }

        reject(error);
      });
  });
}

module.exports.getDistanceMatrix = async (latitude, longitude, busstops) => {
  let response = null;

  try {
    const origins = `${latitude},${longitude}`;
    let destinations = busstops.map(busstop => busstop.desc + city);
    destinations = destinations.join('|');

    const endPoint =
      `${urlAPI}/distancematrix/json` +
      `?origins=${origins}` +
      `&destinations=${destinations}` +
      `&mode=${mode}` +
      `&units=${units}` +
      `&region=${region}` +
      `&key=${apiKey}`;

    response = await getResponse(endPoint);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`getDistanceMatrix - ${error}`);
  }

  return response;
};
