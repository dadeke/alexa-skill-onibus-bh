/**
 * Formata string.
 * Equivalente ao "printf()" C/PHP ou ao "String.Format()"
 * para programadores C#/Java.
 */
// eslint-disable-next-line no-extend-native
String.prototype.format = function formatString() {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  return this.replace(/\{(\d+)\}/g, (text, key) => args[key]);
};

/**
 * Textos das falas da skill.
 */
const speaks = {
  // Menu principal
  SKILL_NAME: 'Ônibus BH',
  GREETING: 'Olá {0}. ',
  GREETING_PERSON: 'Olá <alexa:name type="first" personId="{0}"/> {1}. ',
  GOOD_MORNING: 'bom dia',
  GOOD_AFTERNOON: 'boa tarde',
  GOOD_EVENING: 'boa noite', // Em Português do Brasil
  WELCOME: 'Seja bem vindo ao Ônibus BH! ',
  WELCOME_BACK: 'Bem vindo de volta! ',
  OPTIONS:
    'Por favor, escolha uma das opções ou peça ajuda: ' +
    'Opção 1) "Pontos mais próximos." ' +
    'Opção 2) "Estou no ponto de ônibus?" ' +
    'Qual é a opção escolhida?',
  OPTIONS_CARD:
    'Por favor, escolha uma das opções ou peça ajuda: \n\u200b\n' +
    'Opção 1) "Pontos mais próximos." \n\u200b\n' +
    'Opção 2) "Estou no ponto de ônibus?" \n\u200b\n' +
    'Qual é a opção escolhida?',
  // Opção 1
  OPTION1:
    '{0} da BH TRANS mais {1} conforme a geolocalização do seu dispositivo ' +
    'há {2} atrás {3}: ',
  OPTION1_BUSSTOPS: 'Os {0} pontos de ônibus',
  OPTION1_BUSSTOP: 'O ponto de ônibus ',
  OPTION1_NEXTSTOPS: 'próximos',
  OPTION1_NEXTSTOP: 'próximo',
  OPTION1_MINUTES: 'minutos',
  OPTION1_MINUTE: 'minuto',
  OPTION1_ARE: 'são',
  OPTION1_IS: 'é',
  OPTION1_LOCATION: '"{0}", está há {1} de distância, {2} de caminhada',
  OPTION1_CAUTION:
    'Atenção! Tenha cuidado com possíveis ' +
    'obstáculos. Pergunte alguém qual é a direção correta. ',
  OPTION1_SORRY:
    'Desculpe. Conforme a geolocalização do seu dispositivo, ' +
    'no momento não foi possível encontrar pontos de ônibus da BH TRANS ' +
    'mais próximos.',
  OPTION1_REPEAT: 'Gostaria que eu repetisse?',
  // Opção 2
  OPTION2_NOT_BUSSTOP:
    'Conforme a geolocalização do seu dispositivo há {0} atrás, ' +
    'precisão num raio de 100 metros, você não está em um ponto de ônibus ' +
    'da BH TRANS .',
  OPTION2_YES_BUSSTOP:
    'Conforme a geolocalização do seu dispositivo há {0} atrás, ' +
    'precisão num raio de 100 metros, você está no ponto de ônibus ' +
    'da BH TRANS, "{1}". ' +
    'Deseja ouvir quais linhas param nesse ponto?',
  OPTION2_BUSLINENUMBERS:
    'Nesse ponto param as linhas de ônibus da BH TRANS: {0}. ' +
    'Deseja ouvir a previsão de parada de uma linha específica?',
  OPTION2_WHATBUSLINE: 'Qual é o número da linha de ônibus?',
  OPTION2_BUSSTOP_PREDICTION:
    'Linha de ônibus {0}, próxima previsão de parada, {1}.',
  OPTION2_NO_PREDICTION:
    'Linha de ônibus {0}, sem previsões de parada no momento.',
  OPTION2_BUSSTOP_SORRY:
    'Desculpe. Não localizei a linha de ônibus número {0} ' +
    'nesse ponto de ônibus. Por favor, poderia repetir?',
  OPTION2_BUSLINE_NOT_UNDERSTAND:
    'Desculpe, eu não entendi o número da linha de ônibus. ' +
    'Diga a palavra "número" antes da linha de ônibus para ' +
    'que eu possa localizá-la. Por exemplo: "número 55 06 A". ' +
    'Por favor, poderia repetir?',
  // Ajuda
  HELP: 'Qual das opções você deseja ouvir as instruções: opção 1? ou opção 2?',
  HELP_OPTION1:
    'Opção 1) Eu posso dizer até três pontos de ônibus da BH TRANS ' +
    'mais próximos conforme a geolocalização do seu dispositivo. ',
  HELP_OPTION2:
    'Opção 2) Eu posso dizer se você está em um ponto de ônibus da BH TRANS ' +
    'conforme a geolocalização do seu dispositivo com precisão ' +
    'num raio de 100 metros. ',
  CHOOSE_OPTION: 'Deseja escolher essa opção?',
  // Sobre a geolocalização
  UNSUPPORTED_DEVICE_MSG:
    'Desculpe. Este dispositivo não suporta atualizações de geolocalização. ' +
    'Por favor, me chame através do aplicativo Alexa para obter dados de ' +
    'geolocalização.',
  PERMISSION_CARD_MSG:
    'A skill Ônibus BH gostaria de usar sua geolocalização. ' +
    'Para ativar o compartilhamento de localização GPS, por favor, acesse ' +
    'seu aplicativo Alexa e siga as instruções.',
  LOCATION_DISABLED:
    'Desculpe. Estou tendo dificuldades para acessar sua geolocalização. ' +
    'Por favor, vá nas configurações do seu dispositivo, ' +
    'ative o compartilhamento de localização GPS e tente novamente.',
  LOCATION_NOT_RUNNING:
    'Desculpe. Estou tendo dificuldades para acessar sua geolocalização. ' +
    'Por favor, aguarde um momento e tente novamente mais tarde. ',
  LOCATION_ERROR:
    'Desculpe. Ocorreu um erro ao acessar sua geolocalização. ' +
    'Por favor, aguarde um momento e tente novamente mais tarde.',
  LOCATION_INACCURATE:
    'Desculpe. Não foi possível encontrar uma geolocalização precisa. ' +
    'Por favor, aguarde um momento e tente novamente mais tarde.',
  // Genéricos
  AND: ' e ',
  REPEATING: 'Repetindo. ',
  REPEAT_AGAIN: 'Gostaria que eu repetisse novamente?',
  ALL_RIGHT: 'Tudo bem!',
  NOT_UNDERSTAND: 'Desculpe, não consegui entender. Por favor, fale novamente.',
  PROBLEM:
    'Desculpe. Ocorreu um problema ao conectar-se ao serviço. ' +
    'Por favor, aguarde um momento e tente novamente mais tarde.',
};

module.exports = speaks;
