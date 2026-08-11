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
- Docker
- Git
- VS Code

### Planejadas
- AWS
- AWS CDK
- DynamoDB
- AWS Lambda
- API Gateway
- Amazon SQS
- Amazon CloudWatch

> Os serviços AWS listados como planejados ainda não fazem parte da implementação atual.

## Estrutura atual
```text
cloud-energy-monitor/
├── src/
│   ├── index.ts
│   └── server.ts
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
```
> Os diretórios node_modules/ e dist/ são gerados localmente e não são versionados pelo Git.

## Status

**Em desenvolvimento — Dia 2 em andamento.**

### Dia 1

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

### Dia 2

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

### Próximas etapas

- [ ] Refatorar a estrutura da aplicação
- [ ] Criar domínio de consumo de energia
- [ ] Adicionar persistência local
- [ ] Estudar DynamoDB
- [ ] Estudar AWS Lambda
- [ ] Integrar API Gateway
- [ ] Introduzir AWS CDK
- [ ] Adicionar processamento assíncrono
- [ ] Adicionar testes automatizados
- [ ] Adicionar CI/CD
- [ ] Arquitetura serverless
- [ ] Infraestrutura como código
- [ ] Documentar a arquitetura final

## API atual
### Health Check

**GET `/health`**

## Endpoint utilizado para verificar se a aplicação está funcionando.

Resposta:

```json
{
  "status": "ok",
  "application": "Cloud Energy Monitor"
}
```

## Execução local

Instale as dependências:

```bash
npm install
```
Compile o TypeScript:

```bash
npm run build
```

Inicie a aplicação:

```bash
npm start
```

A API ficará disponível em:

```bash
http://localhost:3000
```

Para testar o health check:

```bash
curl http://localhost:3000/health
```

### Scripts

| Comando | Função |
|---|---|
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Executa a aplicação compilada |
| `npm run dev` | Executa a aplicação compilada com Node.js Watch |
