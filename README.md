
## Skill da Alexa: Ônibus BH ##

[![Build Status](https://travis-ci.com/dadeke/alexa-skill-onibus-bh.svg?branch=main)](https://travis-ci.com/github/dadeke/alexa-skill-onibus-bh)
[![Coverage Status](https://codecov.io/gh/dadeke/alexa-skill-onibus-bh/branch/main/graph/badge.svg)](https://codecov.io/gh/dadeke/alexa-skill-onibus-bh)
[![ESLint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Airbnb Style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Jest](https://img.shields.io/badge/jest-26.6.3-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Stargazers](https://img.shields.io/github/stars/dadeke/alexa-skill-onibus-bh?style=social)](https://github.com/dadeke/alexa-skill-onibus-bh/stargazers)

Repositório do código fonte da skill da Alexa: [Ônibus BH](https://www.amazon.com.br/DD-Tecnologia-%C3%94nibus-BH/dp/B08QVDBMTF/).

Compatível com o "Import skill" do Alexa Developer Console.
[![Compatível com o Import skill](https://i.imgur.com/65L4f3f.png)](https://developer.amazon.com/alexa/console/ask/create-new-skill)

[Diagrama conversacional](#diagrama-conversacional)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Changelog](#changelog)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Licença](#licença)

A skill Ônibus BH tem o objetivo principal de tornar mais acessível para os deficientes visuais, os pontos de ônibus da BHTrans em Belo Horizonte, MG.

Ela possui a capacidade de informar:

- Os três pontos de ônibus mais próximos conforme a geolocalização do dispositivo.
- Quais as linhas de ônibus da BHTrans que param no local conforme a geolocalização.
- A previsão de parada de uma linha de ônibus específica no local.

Diga "Alexa, abrir Ônibus BH". Ela irá cumprimentá-lo e apresentar as opções.  
Para ouvir as instruções, basta dizer a qualquer momento "ajuda".

Aviso: Ainda não está reconhecendo com precisão os pontos dentro das estações do MOVE.

Esta skill pode tentar distinguir a sua voz da voz de outras pessoas e lhe chamar pelo nome.  
Este recurso é fornecido pela própria Alexa.  
Maiores informações, basta dizer: "Alexa, aprenda a minha voz" ou acesse o aplicativo Alexa em Configurações > Meu perfil > Voz.

----------------

Gostou da skill Ônibus BH? Por favor, deixe uma avaliação! Muito obrigado!

Para enviar sugestões ou feedbacks sobre esta skill, entre em contato através do endereço: http://onibusbh.dd.tec.br ou através do e-mail: oi@dd.tec.br

----------------

Você pode visualizar o histórico de atualizações e contribuir para o código fonte desta skill aqui  GitHub.


Todas as informações sobre o transporte coletivo são produzidas pela BHTrans.  
Elas podem ser obtidas no site da Prefeitura Municipal de Belo Horizonte em Dados Abertos através do endereço:  
https://prefeitura.pbh.gov.br/bhtrans/informacoes/dados/dados-abertos

--------------

## Diagrama conversacional ##
(Clique na imagem para acessar o diagrama.)
[<p align="center">![Diagrama conversacional](https://i.imgur.com/AmdDWlw.png)</p>](https://whimsical.com/onibus-bh-VXPayi8sy9RyxE6wCtmzLt)

## Changelog ##

### 0.1.2 - 06/01/2021 ###
- Adicionado a frase de invocação "Alexa, opção três do Ônibus BH" na descrição.

### 0.1.1 - 04/01/2021 ###
- Adicionados ajustes na opção dois.
- Adicionado redefinição do cache de resposta em alguns pontos específicos.

### 0.1.0 - 31/12/2020 ###
- Adicionado a opção três: "Previsão de parada"
- Adicionados textos de fala aleatórios ao dar boas vindas.

### 0.0.4 - 23/12/2020 ###
- Adicionado aviso com relação as estações do MOVE.
- Correção de respostas irrelevantes.
- Adicionados textos de fala aleatórios ao dar tchau.

### 0.0.3 - 16/12/2020 ###
- Publicado a primeira versão experimental.

## Licença ##

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.txt) para mais detalhes.

----------------

"Esforcem-se para ter uma vida tranquila, cuidar dos seus próprios negócios e trabalhar com as próprias mãos..." 1 Tessalonicenses 4:11 NVI
