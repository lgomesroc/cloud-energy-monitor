# Cloud Energy Monitor

Projeto de estudo e portfólio desenvolvido para explorar arquitetura serverless e serviços da AWS utilizando TypeScript.

## Objetivo

Construir uma aplicação capaz de registrar e consultar dados de consumo de energia, evoluindo gradualmente de uma aplicação local para uma arquitetura baseada em serviços AWS.

O projeto será desenvolvido inicialmente de forma local, permitindo estudar os conceitos e a arquitetura sem depender de infraestrutura AWS paga.

## Tecnologias

### Atualmente utilizadas

- Node.js 24.19.0
- TypeScript 7.0.2
- Express 5.2.1
- Vitest
- Supertest
- AWS SDK for JavaScript
- DynamoDB Local
- Docker
- Git
- VS Code

### Planejadas

- AWS CDK
- AWS Lambda
- API Gateway
- Amazon SQS
- Amazon CloudWatch

> Os serviços AWS listados como planejados ainda não fazem parte da implementação atual.

## Estrutura atual
```text
cloud-energy-monitor/
├── src/
│   ├── config/
│   │   ├── dynamodb.ts
│   │   ├── create-table.ts
│   │   ├── insert-reading.ts
│   │   ├── list-readings.ts
│   │   └── query-readings.ts
│   ├── data/
│   │   └── energy-readings.ts
│   ├── domain/
│   │   └── energy-reading.ts
│   ├── repositories/
│   │   ├── energy.repository.ts
│   │   └── energy.repository.test.ts
│   ├── routes/
│   │   └── energy.routes.ts
│   │   └── energy.routes.test.ts
│   ├── services/
│   │   ├── energy.service.ts
│   │   └── energy.service.test.ts
│   ├── index.ts
│   └── server.ts
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
└── vitest.config.ts
```
> Os diretórios node_modules/ e dist/ são gerados localmente e não são versionados pelo Git.

## Arquitetura atual

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

O projeto utiliza uma separação simples de responsabilidades:

- **Route**: recebe as requisições HTTP e retorna as respostas.
- **Service**: concentra a lógica da aplicação.
- **Repository**: responsável pelo acesso aos dados.
- **DynamoDB**: responsável pela persistência das leituras.

> **DynamoDB Local foi utilizado para desenvolvimento e testes, sem necessidade de utilizar recursos pagos da AWS.**

## Status

**Em desenvolvimento — Dia 7 concluído.**

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

### Aula 7 → Validação, tratamento de erros e testes de integração HTTP

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

Atualmente:
```text
Test Files  3 passed (3)
Tests       14 passed (14)
```

## Próxima aula

### Aula 8 — AWS Lambda

- [ ] Entender o que é AWS Lambda
- [ ] Entender como Lambda se encaixa no projeto
- [ ] Instalar o necessário para trabalhar com Lambda
- [ ] Criar o primeiro Lambda Handler
- [ ] Fazer o Handler receber uma requisição
- [ ] Fazer o Handler retornar uma resposta HTTP
- [ ] Integrar o Handler com o Service
- [ ] Manter o Repository e DynamoDB Local
- [ ] Executar o Lambda localmente
- [ ] Criar testes automatizados para o Handler
- [ ] Rodar todos os testes do projeto
- [ ] Atualizar a estrutura de pastas no README
- [ ] Atualizar a documentação da arquitetura

### Próximas etapas

- [ ] Revisar e melhorar a documentação da API.
- [ ] Melhorar o modelo de consulta do DynamoDB.
- [ ] Estudar AWS Lambda.
- [ ] Integrar API Gateway.
- [ ] Introduzir AWS CDK.
- [ ] Adicionar processamento assíncrono.
- [ ] Estudar Amazon SQS.
- [ ] Estudar CloudWatch.
- [ ] Adicionar CI/CD.
- [ ] Evoluir gradualmente para uma arquitetura serverless.
- [ ] Documentar a arquitetura final.

## Iniciando

### DynamoDB Local

O projeto utiliza o DynamoDB Local para desenvolvimento e testes.

O DynamoDB Local é executado através de um container Docker e permite trabalhar com a API do DynamoDB localmente, sem utilizar uma tabela real na AWS.

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

Para desenvolvimento:
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
