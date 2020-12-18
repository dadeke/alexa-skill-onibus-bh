const axios = require('axios');

const urlAPI = 'https://ws.seuwebservice.com.br';

function getResponse(endPoint) {
  return new Promise((resolve, reject) => {
    axios
      .get(endPoint)
      .then(response => {
        const regExp = /\(([^)]+)\)/;
        const bodyJSON = regExp.exec(response.data)[1];
        const bodyObject = JSON.parse(bodyJSON);

        if (!bodyObject.sucesso) {
          reject(Error('"success" is not true'));
        }

        resolve(bodyObject);
      })
      .catch(error => {
        if (error.response) {
          reject(Error(`HTTP status code <${error.response.status}>`));
        }

        reject(error);
      });
  });
}

module.exports.buscarParadasProximas = async (latitude, longitude) => {
  let response = null;

  try {
    const endPoint =
      `${urlAPI}/buscarParadasProximas/` +
      `${longitude}/${latitude}/0/retornoJSON`;

    response = await getResponse(endPoint);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`buscarParadasProximas - ${error}`);
  }

  return response;
};

module.exports.retornaLinhasQueAtendemParada = async cod => {
  let response = null;

  try {
    const endPoint = `${urlAPI}/retornaLinhasQueAtendemParada/${cod}/0/retornoJSON`;

    response = await getResponse(endPoint);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`retornaLinhasQueAtendemParada - ${error}`);
  }

  return response;
};

module.exports.buscarPrevisoes = async cod => {
  let response = null;

  try {
    const endPoint = `${urlAPI}/buscarPrevisoes/${cod}/0/retornoJSON`;

    response = await getResponse(endPoint);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`buscarPrevisoes - ${error}`);
  }

  return response;
};
