# Cloud Energy Monitor

Projeto de estudo e portfólio desenvolvido para explorar arquitetura serverless e serviços da AWS utilizando TypeScript.

## Índice

- [Objetivo](#objetivo)
- [Tecnologias](#tecnologias)
- [Estrutura atual](#estrutura-atual)
- [Arquitetura atual](#arquitetura-atual)
- [Status](#status)
  - [Aula 1 — Configuração inicial e criação da API](#aula-1---configuração-inicial-e-criação-da-api)
  - [Aula 2 — Organização da aplicação e inicialização do servidor](#aula-2---organização-da-aplicação-e-inicialização-do-servidor)
  - [Aula 3 — Domínio e primeiros endpoints de energia](#aula-3---domínio-e-primeiros-endpoints-de-energia)
  - [Aula 4 — Separação da camada de serviço](#aula-4--separação-da-camada-de-serviço)
  - [Aula 5 — Criação da camada de repositório](#aula-5--criação-da-camada-de-repositório)
  - [Aula 6 — Testes, mocking e persistência com DynamoDB](#aula-6--testes-mocking-e-persistência-com-dynamodb)
  - [Aula 7 — Validação, tratamento de erros e testes de integração HTTP](#aula-7--validação-tratamento-de-erros-e-testes-de-integração-http)
  - [Aula 8 — AWS Lambda](#aula-8--aws-lambda)
  - [Aula 9 — API Gateway + AWS Lambda](#aula-9--api-gateway--aws-lambda)
  - [Aula 10 — Configuração por ambiente e preparação para AWS](#aula-10--configuração-por-ambiente-e-preparação-para-aws)
  - [Aula 11 — AWS CDK e Infrastructure as Code](#aula-11--aws-cdk-e-infrastructure-as-code)
  - [Aula 12 — Modelagem da infraestrutura serverless com CDK](#aula-12--modelagem-da-infraestrutura-serverless-com-cdk)
- [Próxima aula](#próxima-aula)
  - [Aula 13 — Processamento assíncrono com Amazon SQS](#aula-13--processamento-assíncrono-com-amazon-sqs)
  - [Próximas etapas](#próximas-etapas)
  - [Resumo das aulas](#resumo-das-aulas)
- [Iniciando](#iniciando)
  - [DynamoDB Local](#dynamodb-local)
    - [Criar a tabela](#criar-a-tabela)
    - [Inserir dados de exemplo](#inserir-dados-de-exemplo)
  - [Testes](#testes)
  - [Scan e Query](#scan-e-query)
  - [Paginação](#paginação)
- [API atual](#api-atual)
  - [Health Check](#health-check)
  - [Energy Readings](#energy-readings)
  - [Energy Readings com paginação](#energy-readings-com-paginação)
  - [Energy Readings por dispositivo](#energy-readings-por-dispositivo)
- [Execução local](#execução-local)
  - [Para desenvolvimento](#para-desenvolvimento)
  - [Scripts](#scripts)

## Objetivo

Construir uma aplicação capaz de registrar e consultar dados de consumo de energia, evoluindo gradualmente de uma aplicação local para uma arquitetura baseada em serviços AWS.

O projeto será desenvolvido inicialmente de forma local, permitindo estudar os conceitos e a arquitetura sem depender de infraestrutura AWS paga.

## Tecnologias

- **Node.js 24.19.0** — ambiente de execução utilizado para a aplicação e para os recursos em TypeScript.
- **TypeScript 7.0.2** — linguagem utilizada no desenvolvimento da aplicação, dos Lambda Handlers e da infraestrutura com AWS CDK.
- **Express 5.2.1** — framework HTTP utilizado na primeira fase da aplicação, permitindo desenvolver e testar a API localmente.
- **Vitest** — framework utilizado para os testes automatizados das camadas da aplicação.
- **Supertest** — utilizado para testar as rotas HTTP da aplicação.
- **AWS SDK for JavaScript** — utilizado para comunicação da aplicação com o DynamoDB.
- **AWS API Gateway** — utilizado na infraestrutura serverless para disponibilizar os endpoints HTTP e encaminhar as requisições para o Lambda.
- **DynamoDB Local** — utilizado como banco de dados local durante o desenvolvimento e os testes, evitando a necessidade de utilizar uma tabela DynamoDB real na AWS.
- **AWS Lambda** — utilizado como função serverless responsável por receber os eventos HTTP e executar a lógica da aplicação.
- **AWS IAM** — utilizado para definir as permissões necessárias para que a função Lambda possa acessar o DynamoDB e executar seus recursos.
- **AWS CloudFormation** — utilizado como camada de infraestrutura gerada pelo AWS CDK. O `cdk synth` gera um template CloudFormation que representa os recursos definidos na Stack.
- **Amazon CloudWatch Logs** — utilizado para registrar os logs de execução da função Lambda. O Log Group da Lambda é criado na infraestrutura gerada pelo CDK.
- **AWS CDK** — utilizado para definir a infraestrutura AWS como código, permitindo modelar DynamoDB, Lambda, API Gateway, IAM e recursos relacionados utilizando TypeScript.
- **Amazon SQS** — mensageria assíncrona entre Producer e Consumer
- **Docker** — utilizado para executar o DynamoDB Local em um container.
- **Git** — utilizado para controle de versão do projeto.
- **VS Code** — editor utilizado no desenvolvimento da aplicação.

> Os serviços AWS listados como planejados ainda não fazem parte da implementação atual.

## Estrutura atual
```text
cloud-energy-monitor/
├── infra/
│   ├── bin/
│   │   └── infra.ts
│   ├── lib/
│   │   └── infra-stack.ts
│   ├── test/
│   │   └── infra.test.ts
│   ├── cdk.json
│   ├── jest.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── tsconfig.json
├── src/
│   ├── config/
│   │   ├── create-table.ts
│   │   ├── dynamodb.ts
│   │   ├── insert-reading.ts
│   │   ├── list-readings.ts
│   │   └── query-readings.ts
│   ├── data/
│   │   └── energy-readings.ts
│   ├── domain/
│   │   └── energy-reading.ts
|   ├── handlers/
│   │   ├── energy-consumer.handler.test.ts
│   │   ├── energy-consumer.handler.ts
│   │   ├── energy-producer.handler.ts
│   │   ├── energy.handler.test.ts
│   │   ├── energy.handler.ts
│   │   └── test-handler.ts
│   ├── repositories/
│   │   ├── energy.repository.ts
│   │   └── energy.repository.test.ts
│   ├── routes/
│   │   ├── energy.routes.test.ts
│   │   └── energy.routes.ts
│   ├── services/
│   │   ├── energy-queue.service.ts
│   │   ├── energy.service.test.ts
│   │   └── energy.service.ts
│   ├── index.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
└── vitest.config.ts
```
> Os diretórios `node_modules/` e `dist/` são gerados localmente e não são versionados pelo Git.

> A pasta `infra/` contém o projeto AWS CDK responsável pela definição da infraestrutura como código. A aplicação permanece separada da infraestrutura, permitindo estudar e evoluir cada parte de forma independente.

## Arquitetura atual

### Fase 1 — API tradicional

```text
HTTP Request
     ↓
   Route
     ↓
  Service
     ↓
 Repository
     ↓
DynamoDB Local
```

> A aplicação recebe a requisição HTTP diretamente pelo Express, passa pela Route, Service e Repository e chega ao DynamoDB Local.

### Fase 2 — Introdução do Lambda

```text
HTTP Request
     ↓
Lambda Handler
     ↓
  Service
     ↓
 Repository
     ↓
DynamoDB Local
```

> o Handler passa a representar a entrada da aplicação no modelo serverless e ainda estamos executando tudo localmente.

### Fase 3 — API Gateway + Lambda

```text
HTTP Request
     ↓
 API Gateway
     ↓
   Lambda
     ↓
  Service
     ↓
 Repository
     ↓
DynamoDB Local
```

> Começa a ter uma arquitetura mais próxima de uma aplicação serverless.

O projeto utiliza uma separação simples de responsabilidades:

- **Route**: recebe as requisições HTTP e retorna as respostas.
- **Service**: concentra a lógica da aplicação.
- **Repository**: responsável pelo acesso aos dados.
- **DynamoDB**: responsável pela persistência das leituras.
- **Lambda Handler**: recebe o evento enviado ao Lambda, interpreta os dados da requisição, chama o Service e transforma o resultado em uma resposta HTTP.

> **DynamoDB Local foi utilizado para desenvolvimento e testes, sem necessidade de utilizar recursos pagos da AWS.**

> **O Handler passa a atuar como uma alternativa à Route na arquitetura serverless, mantendo as camadas de Service e Repository separadas e reutilizáveis.**

### Processamento assíncrono

A aplicação utiliza Amazon SQS para desacoplar o recebimento das leituras de energia do processamento das mensagens.

A fila utilizada pelo projeto é:

```text
cloud-energy-monitor-queue
```

O Producer é responsável por enviar mensagens para a fila.

O Consumer é responsável por receber as mensagens encaminhadas pelo SQS.

A integração entre SQS e Lambda é definida utilizando AWS CDK.

O projeto utiliza uma fila Amazon SQS para desacoplar o recebimento das leituras de energia do processamento das mensagens.

O fluxo é:

1. A API recebe uma nova leitura através do endpoint `POST /api/energy`.
2. A `Energy Producer Lambda` envia a mensagem para a fila SQS.
3. A fila mantém a mensagem até que ela seja processada.
4. A `Energy Consumer Lambda` é acionada pelo evento da fila.
5. O Consumer recebe e processa as mensagens individualmente.

### Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/energy` | Retorna as leituras de energia |
| GET | `/api/energy/{deviceId}` | Retorna as leituras de um dispositivo |
| POST | `/api/energy` | Envia uma nova leitura de energia para processamento assíncrono |

### Infraestrutura

A infraestrutura do projeto é definida utilizando AWS CDK e contempla:

- DynamoDB para armazenamento das leituras de energia
- Amazon SQS para processamento assíncrono
- AWS Lambda para processamento da API, Producer e Consumer
- API Gateway para exposição dos endpoints HTTP

A infraestrutura do projeto é definida utilizando AWS CDK.

Os componentes definidos são:

- DynamoDB
- Amazon SQS
- AWS Lambda
- Amazon API Gateway

A tabela DynamoDB utiliza:

- `deviceId` como chave de partição
- `timestamp` como chave de ordenação numérica
- `PAY_PER_REQUEST` como modo de cobrança

A fila SQS utiliza:

- Visibility Timeout de 30 segundos
- Retenção de mensagens por 4 dias

A infraestrutura pode ser sintetizada utilizando:
A infraestrutura do projeto é definida utilizando AWS CDK.

Os componentes definidos são:

DynamoDB
Amazon SQS
AWS Lambda
Amazon API Gateway

A tabela DynamoDB utiliza:

deviceId como chave de partição
timestamp como chave de ordenação numérica
PAY_PER_REQUEST como modo de cobrança

A fila SQS utiliza:

Visibility Timeout de 30 segundos
Retenção de mensagens por 4 dias

A infraestrutura pode ser sintetizada utilizando:

```bash
cd infra
npx cdk synth
```

O comando gera o template CloudFormation sem necessidade de realizar o deploy dos recursos.

### Testes

Os testes automatizados são executados com Vitest.

Atualmente o projeto possui:

- 22 testes
- 5 arquivos de teste
- Todos os testes passando

Para executar:

```text
npm test
```

## Status

**Em desenvolvimento — Aula 13 concluído.**

### Aula 1 - Configuração inicial e criação da API

- [x] Configuração do Node.js
- [x] Configuração do TypeScript
- [x] Configuração do VS Code
- [x] ESLint instalado
- [x] Prettier instalado
- [x] Estrutura inicial do projeto
- [x] Branch main
- [x] .gitignore
- [x] README inicial
- [x] Primeiro commit
- [x] Primeiro código executável
- [x] Configuração inicial do Git
- [x] API HTTP com Express
- [x] Endpoint GET /health
- [x] Teste da API com curl
- [x] Projeto compilando e executando localmente

### Aula 2 - Organização da aplicação e inicialização do servidor

- [x] Separação entre configuração da aplicação e inicialização do servidor
- [x] Criação do `src/server.ts`
- [x] `src/index.ts` responsável pela configuração e exportação do Express
- [x] `src/server.ts` responsável pela inicialização do servidor HTTP
- [x] Atualização dos scripts `start` e `dev` para utilizar `dist/server.js`
- [x] Remoção do Fastify, mantendo Express como framework HTTP
- [x] Compilação do projeto com TypeScript
- [x] Teste da aplicação localmente
- [x] Validação do endpoint `GET /health` com `curl`
- [x] Commit das alterações

### Aula 3 - Domínio e primeiros endpoints de energia

- [x] Criação do domínio EnergyReading
- [x] Definição dos dados de uma leitura de consumo
- [x] Criação de dados simulados em memória
- [x] Criação da rota GET /api/energy
- [x] Separação entre domínio, dados e rotas
- [x] Integração da rota de energia ao Express
- [x] Compilação do projeto com TypeScript
- [x] Validação do endpoint GET /health
- [x] Validação do endpoint GET /api/energy com curl
- [x] Commit das alterações
- [x] Push das alterações para o GitHub

### Aula 4 — Separação da camada de serviço

- [x] Criada a pasta`src/services` para separar o acesso aos dados da camada de rotas.
- [x] Criado `energy.service.ts` com a função `getEnergyReadings()`.
- [x] Atualizada a rota `GET /api/energy` para utilizar o service.
- [x] Mantida a fonte de dados em memória em `src/data/energy-readings.ts`.
- [x] Executado `npm run build` com sucesso.
- [x] Testado `GET /api/energy` com `curl`, retornando as leituras de energia esperadas.

### Aula 5 — Criação da camada de repositório

- [x] Criada a pasta `src/repositories`.
- [x] Criado `energy.repository.ts` para centralizar o acesso aos dados de energia.
- [x] Removido o acesso direto aos dados do `energy.service.ts`.
- [x] Definido o retorno do Repository como `EnergyReading[]`.
- [x] Utilizado `import type` para importação do domínio conforme `verbatimModuleSyntax`.
- [x] Retorno do Repository protegido com uma cópia do array em memória.
- [x] Definido o retorno do Service como `EnergyReading[]`.
- [x] Executado `npm run build` com sucesso.
- [x] Validado `GET /api/energy` com `curl`.
- [x] Validado `GET /health` com `curl`.
- [x] Commit e push das alterações para o GitHub.

### Aula 6 — Testes, mocking e persistência com DynamoDB

#### Testes e mocking

- [x] Configuração do Vitest para testes automatizados.
- [x] Criação de testes unitários para o Repository.
- [x] Criação de testes unitários para o Service.
- [x] Utilização de mocking com Vitest para isolar o Service do Repository.
- [x] Validação do comportamento das camadas de Repository e Service.
- [x] Execução dos testes automatizados com `npm test`.
- [x] Configuração do Vitest para ignorar os arquivos compilados em dist/
- [x] Todos os testes passando com sucesso.

#### DynamoDB

- [x] Execução do DynamoDB Local utilizando Docker.
- [x] Instalação do AWS SDK for JavaScript.
- [x] Configuração do `DynamoDBClient`.
- [x] Configuração do DynamoDB Document Client.
- [x] Criação da tabela `CloudEnergyReadings`.
- [x] Definição de `deviceId` como chave de partição.
- [x] Inserção de leituras de consumo no DynamoDB.
- [x] Consulta das leituras utilizando `Scan`.
- [x] Consulta das leituras de um dispositivo utilizando `Query`.
- [x] Integração do DynamoDB com a camada de Repository.
- [x] Integração do Repository com a camada de Service.
- [x] Exposição das consultas através da API REST.
- [x] Validação dos endpoints utilizando `curl`.

### Aula 7 — Validação, tratamento de erros e testes de integração HTTP

#### Validação
- [x] Validação do parâmetro limit
- [x] Limite mínimo de 1
- [x] Limite máximo de 100
- [x] Validação do parâmetro lastKey
- [x] Tratamento de lastKey inválido
- [x] Retorno de HTTP 400 Bad Request para parâmetros inválidos

#### Tratamento de erros

- [x] Tratamento de erros no acesso ao DynamoDB
- [x] Tratamento de erros na Route
- [x] Retorno de HTTP 500 Internal Server Error
- [x] Mensagem de erro genérica para o cliente
- [x] Registro do erro no console durante o desenvolvimento

#### Testes HTTP

- [x] Instalação do Supertest
- [x] Instalação dos tipos @types/supertest
- [x] Testes das rotas HTTP
- [x] Teste do endpoint GET /api/energy
- [x] Teste de paginação
- [x] Teste de limit inválido
- [x] Teste de lastKey inválido
- [x] Teste de erro interno
- [x] Teste do endpoint GET /api/energy/:deviceId
- [x] Teste de erro na consulta por dispositivo
- [x] Execução de todos os testes automatizados

### Aula 8 — AWS Lambda

- [x] Entendimento do conceito de AWS Lambda
- [x] Entendimento do conceito de Lambda Handler
- [x] Entendimento de como Lambda se encaixa na arquitetura do projeto
- [x] Instalação de `@types/aws-lambda`
- [x] Criação do Lambda Handler
- [x] Recebimento de uma requisição pelo Handler
- [x] Retorno de resposta HTTP pelo Handler
- [x] Integração do Handler com o Service
- [x] Manutenção do Repository e DynamoDB Local
- [x] Execução do Lambda localmente
- [x] Criação de testes automatizados para o Handler
- [x] Teste de resposta HTTP 200
- [x] Teste de parâmetro `limit` inválido
- [x] Teste de `lastKey` inválido
- [x] Teste de erro interno do Service
- [x] Execução de todos os testes automatizados

### Aula 9 — API Gateway + AWS Lambda

- [x] Entendimento do conceito de Amazon API Gateway
- [x] Entendimento do conceito de API HTTP
- [x] Entendimento da comunicação entre API Gateway e AWS Lambda
- [x] Entendimento do conceito de evento HTTP recebido pelo Lambda
- [x] Trabalho com `queryStringParameters`
- [x] Trabalho com `pathParameters`
- [x] Adaptação do Lambda Handler para diferentes requisições HTTP
- [x] Implementação de `GET /api/energy` através do Lambda Handler
- [x] Implementação de `GET /api/energy/:deviceId` através do Lambda Handler
- [x] Tratamento do parâmetro `limit`
- [x] Tratamento do parâmetro `lastKey`
- [x] Tratamento de `deviceId` através de `pathParameters`
- [x] Manutenção da separação Handler → Service → Repository → DynamoDB
- [x] Execução e validação do Lambda localmente
- [x] Criação de testes automatizados para o Lambda Handler
- [x] Teste de respostas HTTP 200
- [x] Teste de parâmetros inválidos
- [x] Teste de `deviceId`
- [x] Teste de erros internos
- [x] Execução de todos os testes automatizados
- [x] Compilação do projeto com TypeScript
- [x] Validação dos endpoints utilizando dados persistidos no DynamoDB Local

> Nesta aula, o fluxo de API Gateway + Lambda foi estudado e reproduzido localmente. A integração com o Amazon API Gateway e demais recursos da AWS não foi provisionada em uma conta AWS real devido à limitação de recursos financeiros para assumir possíveis custos de infraestrutura.

> O projeto continua utilizando o DynamoDB Local e execução local do Lambda para permitir o estudo da arquitetura serverless sem gerar custos na AWS.

### Aula 10 — Configuração por ambiente e preparação para AWS

- [x] Entendimento de configuração por ambiente
- [x] Identificação das configurações específicas do ambiente local
- [x] Remoção de configurações fixas do código
- [x] Introdução de variáveis de ambiente
- [x] Configuração do endpoint do DynamoDB por variável de ambiente
- [x] Configuração da região AWS por variável de ambiente
- [x] Configuração das credenciais através do ambiente
- [x] Diferenciação entre ambiente local e ambiente AWS
- [x] Criação de configuração adequada para desenvolvimento local
- [x] Revisão da configuração do `DynamoDBClient`
- [x] Remoção de credenciais e endpoints diretamente do código
- [x] Criação do arquivo `.env.example`
- [x] Configuração do `.env` para execução local
- [x] Inclusão do `.env` no `.gitignore`
- [x] Validação da aplicação após a alteração
- [x] Execução dos testes automatizados
- [x] Compilação do projeto com TypeScript
- [x] Validação dos endpoints localmente
- [x] Documentação das alterações no README

### Aula 11 — AWS CDK e Infrastructure as Code

- [x] Entendimento do conceito de Infrastructure as Code (IaC)
- [x] Entendimento do papel do AWS CDK
- [x] Entendimento da diferença entre aplicação e infraestrutura
- [x] Instalação e configuração do AWS CDK
- [x] Verificação da versão do CDK
- [x] Criação do projeto CDK dentro da pasta `infra/`
- [x] Entendimento da estrutura de um projeto CDK
- [x] Criação do arquivo `infra/bin/infra.ts`
- [x] Criação da Stack `InfraStack`
- [x] Criação do arquivo `infra/lib/infra-stack.ts`
- [x] Criação da estrutura de testes da infraestrutura
- [x] Entendimento do conceito de Stack
- [x] Entendimento do conceito de Construct
- [x] Entendimento do processo de síntese do CDK
- [x] Execução do `cdk synth`
- [x] Geração do template CloudFormation
- [x] Análise dos arquivos gerados em `infra/cdk.out/`
- [x] Entendimento da relação entre AWS CDK e AWS CloudFormation
- [x] Separação entre código da aplicação e código da infraestrutura
- [x] Manutenção da aplicação executável localmente
- [x] Manutenção do DynamoDB Local para desenvolvimento e testes
- [x] Validação da configuração do projeto
- [x] Documentação das alterações no README

> Nesta aula foi introduzido o AWS CDK como ferramenta de Infrastructure as Code. O CDK foi configurado em uma pasta separada (`infra/`), mantendo a infraestrutura desacoplada do código da aplicação.

> O projeto continua sendo executado localmente. O `cdk deploy` não faz parte do fluxo atual, pois o objetivo é estudar a definição e síntese da infraestrutura sem provisionar recursos reais e sem gerar custos na AWS.

> O DynamoDB utilizado durante o desenvolvimento continua sendo o DynamoDB Local executado através do Docker.

### Aula 12 — Modelagem da infraestrutura serverless com CDK

- [x] Entendimento de como representar recursos AWS utilizando Constructs.
- [x] Entendimento da relação entre Stack e recursos da infraestrutura.
- [x] Modelagem da tabela DynamoDB `CloudEnergyReadings` utilizando CDK.
- [x] Definição de `deviceId` como Partition Key.
- [x] Definição de `timestamp` como Sort Key.
- [x] Configuração da tabela DynamoDB com `PAY_PER_REQUEST`.
- [x] Modelagem da função AWS Lambda utilizando CDK.
- [x] Configuração do runtime Node.js 24.x para a Lambda.
- [x] Configuração do Lambda Handler `handlers/energy.handler`.
- [x] Criação das permissões IAM necessárias para a Lambda consultar o DynamoDB.
- [x] Modelagem da integração entre API Gateway e Lambda.
- [x] Criação da API `CloudEnergyApi`.
- [x] Configuração dos endpoints `GET /api/energy` e `GET /api/energy/{deviceId}`.
- [x] Configuração das permissões para que o API Gateway invoque a Lambda.
- [x] Criação do Log Group da Lambda no Amazon CloudWatch Logs.
- [x] Entendimento da geração de recursos AWS pelo AWS CDK.
- [x] Execução do `cdk synth`.
- [x] Análise do template CloudFormation gerado pelo CDK.
- [x] Identificação dos recursos DynamoDB, Lambda, IAM, API Gateway e CloudWatch Logs no template.
- [x] Validação da infraestrutura definida pelo CDK.
- [x] Manutenção do DynamoDB Local para execução e testes da aplicação.
- [x] Manutenção da aplicação executável localmente.
- [x] Documentação das alterações no README.

> Nesta aula, a infraestrutura serverless foi efetivamente modelada utilizando AWS CDK. A Stack passou a representar a tabela DynamoDB, a função Lambda, as permissões IAM, o API Gateway e o Log Group utilizado pelo Amazon CloudWatch Logs.

> O `cdk synth` foi utilizado para transformar a definição feita em TypeScript em um template AWS CloudFormation. O template gerado em `infra/cdk.out/InfraStack.template.json` foi analisado para verificar os recursos que seriam criados pela infraestrutura.

> A infraestrutura continua sendo apenas sintetizada localmente. O `cdk deploy` não foi executado e os recursos reais da AWS não foram provisionados.

### Aula 13 — Processamento assíncrono com Amazon SQS

- [x] Conteúdos estudados
- [x] Entender o conceito de processamento assíncrono.
- [x] Entender o funcionamento do Amazon SQS.
- [x] Entender a diferença entre processamento síncrono e assíncrono.
- [x] Entender o conceito de fila de mensagens.
- [x] Modelar uma fila SQS utilizando AWS CDK.
- [x] Estudar o envio de mensagens para uma fila.
- [x] Estudar o consumo de mensagens por uma aplicação.
- [x] Entender a integração entre SQS e AWS Lambda.
- [x] Relacionar API Gateway → Lambda → SQS.
- [x] Executar cdk synth.
- [x] Analisar o template CloudFormation gerado.
- [x] Manter o desenvolvimento sem provisionar recursos pagos na AWS.
- [x] Documentar as alterações no README.

> Nesta aula foi introduzido o processamento assíncrono utilizando Amazon SQS.

## Próxima aula

### Aula 14 — Integração e testes do fluxo assíncrono

- [ ] Revisar o fluxo **API Gateway → Lambda Producer → SQS → Lambda Consumer**.
- [ ] Entender o papel de cada Lambda no processamento assíncrono.
- [ ] Entender como o API Gateway encaminha uma requisição `POST` para o Producer.
- [ ] Entender como o Producer envia uma mensagem para o SQS.
- [ ] Entender como o SQS aciona o Consumer Lambda.
- [ ] Validar o payload enviado para a fila.
- [ ] Validar o recebimento de mensagens pelo Consumer Lambda.
- [ ] Criar testes unitários para o **Energy Queue Service**.
- [ ] Criar testes unitários para o **Energy Producer Handler**.
- [ ] Criar testes unitários para o **Energy Consumer Handler**.
- [ ] Utilizar mocks para testar o envio de mensagens sem acessar a AWS.
- [ ] Garantir que os testes sejam executados localmente.
- [ ] Executar `npx tsc --noEmit`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm test`.
- [ ] Garantir que o projeto finalize com **0 erros de TypeScript e todos os testes passando**.
- [ ] Executar `cdk synth` para validar a infraestrutura.
- [ ] Revisar as alterações realizadas na infraestrutura.
- [ ] Documentar a integração assíncrona no README.
- [ ] Manter a arquitetura simples e compatível com um projeto de nível Júnior.

### Próximas etapas

- [ ] Estudar observabilidade com Amazon CloudWatch.
- [ ] Adicionar CI/CD.
- [ ] Melhorar a documentação da API.
- [ ] Evoluir gradualmente a arquitetura serverless.
- [ ] Documentar a arquitetura final.

### Resumo das aulas

- ✓ Aula 1 → Configuração inicial e criação da API
- ✓ Aula 2 → Organização da aplicação e inicialização do servidor
- ✓ Aula 3 → Domínio e primeiros endpoints de energia
- ✓ Aula 4 → Separação da camada de serviço
- ✓ Aula 5 → Criação da camada de repositório
- ✓ Aula 6 → Testes, mocking e persistência com DynamoDB
- ✓ Aula 7 → Validação, tratamento de erros e testes de integração HTTP
- ✓ Aula 8 → AWS Lambda
- ✓ Aula 9 → API Gateway + Lambda
- ✓ Aula 10 → Configuração por ambiente e preparação para AWS
- ✓ Aula 11 → AWS CDK e Infrastructure as Code
- ✓ Aula 12 → Modelagem da infraestrutura serverless com CDK
- ✓ Aula 13 → Processamento assíncrono com Amazon SQS
- Aula 14 → Integração entre SQS e Lambda
- Aula 15 → Observabilidade com Amazon CloudWatch
- Aula 16 → Melhorias de arquitetura
- Aula 17 → CI/CD
- Aula 18 → Revisão da infraestrutura e aplicação
- Aula 19 → Testes e documentação
- Aula 20 → Projeto final

## Iniciando

### DynamoDB Local

O projeto utiliza o DynamoDB Local para desenvolvimento e testes, permitindo estudar a integração com o DynamoDB sem utilizar uma tabela real na AWS.

#### Configuração do ambiente

Crie o arquivo `.env` a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

O arquivo .env contém as configurações utilizadas pelo ambiente local e não deve ser versionado pelo Git.

#### Inicie o container:

```bash
docker start dynamodb-local
```

Caso o container ainda não exista, crie-o:

```bash
docker run -d \
  --name dynamodb-local \
  -p 8000:8000 \
  amazon/dynamodb-local
```

Depois, crie a tabela:

```bash
npx tsx src/config/create-table.ts
```

Para inserir as leituras de exemplo:

```bash
npx tsx src/config/insert-reading.ts
```

Esses comandos são necessários apenas para preparar o ambiente local. A tabela permanece disponível enquanto o container estiver ativo.

Para verificar o container:

```bash
docker ps
```

O container deve apresentar a porta:

```text
0.0.0.0:8000->8000/tcp
```

#### Criar a tabela

Após iniciar o DynamoDB Local, execute:

```bash
npx tsx src/config/create-table.ts
```

O script cria a tabela:

```text
CloudEnergyReadings
```

A tabela utiliza:

```text
Partition Key: deviceId
Sort Key: timestamp
```

O script também verifica o status da tabela após a criação.

#### Inserir dados de exemplo

Para inserir as leituras utilizadas durante o desenvolvimento e os testes manuais:

```bash
npx tsx src/config/insert-reading.ts
```

O script insere as leituras definidas em:

```text
src/config/insert-reading.ts
```

Esses comandos são utilizados para preparar o ambiente local antes de executar a aplicação e realizar testes manuais com o DynamoDB.

> Os scripts de configuração são executados manualmente neste momento. A automação dessa inicialização poderá ser estudada posteriormente caso seja útil para o projeto.

### Testes

Execute todos os testes automatizados com:

```bash
npm test
```

Os testes atuais estão organizados por camada:

```text
src/
├── repositories/
│   └── energy.repository.test.ts
├── routes/
│   └── energy.routes.test.ts
└── services/
    └── energy.service.test.ts
```

Os testes cobrem atualmente:

- Service
- Repository
- Routes
- Paginação
- Validação de parâmetros
- Tratamento de erros
- Respostas HTTP
- Consulta por dispositivo
- Integração do Repository com o DynamoDB Local

### Scan e Query

O projeto utiliza operações básicas do DynamoDB de acordo com o tipo de consulta:

> **Scan** é utilizado para percorrer os itens disponíveis na tabela, sem informar uma chave específica para a consulta.

> **Query** permite consultar itens a partir da chave de partição, sendo utilizado no projeto para buscar as leituras de um dispositivo específico.

No Cloud Energy Monitor:

- `GET /api/energy` utiliza `Scan` para consultar as leituras da tabela.
- `GET /api/energy/:deviceId` utiliza `Query` para consultar as leituras de um dispositivo utilizando `deviceId` como chave de partição.

### Paginação

O projeto também possui uma implementação inicial de paginação utilizando os recursos disponíveis no DynamoDB.

Foram estudados os seguintes conceitos:

- `Limit`: define a quantidade máxima de itens retornados em uma consulta.
- `LastEvaluatedKey`: informa que existem mais itens disponíveis para consulta e indica a chave utilizada para continuar a busca.
- `ExclusiveStartKey`: permite continuar uma consulta a partir da chave informada.

Fluxo simplificado:

```text
Primeira consulta
      ↓
DynamoDB
      ↓
Itens + LastEvaluatedKey
      ↓
Próxima consulta
      ↓
ExclusiveStartKey
      ↓
Próximos itens
```

No projeto, a paginação foi adicionada ao endpoint:

`GET /api/energy?limit=2`

Exemplo de resposta:

```json
{
  "readings": [
    {
      "deviceId": "device-002",
      "consumptionKwh": 2.18,
      "timestamp": "2026-08-15T12:05:00Z"
    },
    {
      "deviceId": "device-001",
      "consumptionKwh": 1.75,
      "timestamp": "2026-08-15T12:00:00Z"
    }
  ],
  "lastEvaluatedKey": {
    "deviceId": "device-001",
    "timestamp": "2026-08-15T12:00:00Z"
  }
}
```

A aplicação utiliza essa chave para trabalhar com consultas paginadas e continuar a busca pelos próximos registros.

> A paginação foi estudada e implementada utilizando o DynamoDB Local, permitindo praticar o conceito sem utilizar recursos pagos da AWS.

## API atual

### Health Check

**GET `/health`**

Endpoint utilizado para verificar se a aplicação está funcionando.

Resposta:

```json
{
  "status": "ok",
  "application": "Cloud Energy Monitor"
}
```

Teste:

```bash
curl http://localhost:3000/health
```

### Energy Readings

**GET `/api/energy`**

Retorna as leituras de consumo de energia armazenadas no DynamoDB.

Exemplo:

```bash
curl http://localhost:3000/api/energy
```

A resposta contém as leituras retornadas e, quando houver mais resultados, uma chave para continuar a consulta.

### Energy Readings com paginação

**GET** `/api/energy?limit=2`

Retorna até duas leituras.

```bash
curl "http://localhost:3000/api/energy?limit=2"
```

Quando houver mais registros, a resposta conterá uma propriedade `lastKey`.

Para buscar a próxima página, envie a chave retornada:

```bash
curl "http://localhost:3000/api/energy?limit=2&lastKey=CHAVE_RETORNADA"
```

O parâmetro limit aceita valores inteiros entre 1 e 100.

### Energy Readings por dispositivo

**GET** `/api/energy/:deviceId`

Retorna as leituras associadas a um dispositivo específico.

Exemplo:

```bash
curl http://localhost:3000/api/energy/device-002
```

Resposta:
```json
[
  {
    "deviceId": "device-002",
    "consumptionKwh": 2.18,
    "timestamp": "2026-08-15T12:05:00Z"
  }
]
```

## Execução local

### Instalar as dependências:

```bash
npm install
```

### Iniciar o DynamoDB Local

```bash
docker start dynamodb-local
```

### Criar a tabela

```bash
npx tsx src/config/create-table.ts
```

### Inserir os dados de exemplo

```bash
npx tsx src/config/insert-reading.ts
```

### Compilar o projeto:

```bash
npm run build
```

### Iniciar a aplicação:

```bash
npm start
```

### Para desenvolvimento:
```bash
npm run dev
```

A API ficará disponível em:

```bash
http://localhost:3000
```

### Scripts

| Comando | Função |
|---|---|
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Executa a aplicação compilada |
| `npm run dev` | Executa a aplicação compilada com Node.js Watch |
| `npm test` | Executa os testes automatizados |
