# Order API

Desafio tecnico para vaga da Jitterbit.
API REST em Node.js com Express e MongoDB para:

- cadastro/login de usuarios com JWT
- CRUD de pedidos protegidos por autenticacao

## Tecnologias

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Hash de senha (`bcryptjs`)
- Variaveis de ambiente (`dotenv`)

## Estrutura do projeto

```text
.
|-- server.js
|-- src/
|   |-- app.js
|   |-- controllers/
|   |   `-- orderController.js
|   |-- middleware/
|   |   `-- auth.js
|   |-- models/
|   |   |-- Order.js
|   |   `-- User.js
|   `-- routes/
|       |-- authRoute.js
|       `-- orderRoute.js
`-- package.json
```

## Pre-requisitos

- Node.js 18+
- MongoDB local ou remoto

## Instalacao

```bash
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/orders
JWT_SECRET=dev_jwt_secret
```

Observacoes:

- se `PORT` nao for informado, usa `3000`
- se `MONGO_URI` nao for informado, usa `mongodb://127.0.0.1:27017/orders`
- se `JWT_SECRET` nao for informado, usa `dev_jwt_secret`

## Como rodar

Modo normal:

```bash
npm start
```

Modo desenvolvimento (com nodemon):

```bash
npm run dev
```

## Scripts disponiveis

- `npm start`: inicia a API
- `npm run dev`: inicia com recarregamento automatico
- `npm test`: placeholder (sem testes automatizados configurados)

## Base URL

```text
http://localhost:3000
```

## Autenticacao

As rotas de pedido usam middleware JWT e exigem header:

```http
Authorization: Bearer <token>
```

O token eh obtido na rota `POST /auth/login`.

## Endpoints

### Auth

#### Registrar usuario

- Metodo: `POST`
- Rota: `/auth/register`
- Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

- Respostas comuns:
- `201` usuario criado
- `400` campos obrigatorios ausentes
- `409` usuario ja existe

#### Login

- Metodo: `POST`
- Rota: `/auth/login`
- Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

- Resposta `200`:

```json
{
  "token": "<jwt-token>"
}
```

- Respostas comuns:
- `400` campos obrigatorios ausentes
- `401` credenciais invalidas

### Orders (protegidas por JWT)

#### Criar pedido

- Metodo: `POST`
- Rota: `/order/`
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "numeroPedido": "1001",
  "valorTotal": 199.9,
  "dataCriacao": "2026-03-09T10:00:00.000Z",
  "items": [
    {
      "idItem": 1,
      "quantidadeItem": 2,
      "valorItem": 49.95
    }
  ]
}
```

- Respostas comuns:
- `201` pedido criado
- `400` payload invalido
- `401` token ausente/invalido
- `409` numero de pedido duplicado

#### Listar pedidos

- Metodo: `GET`
- Rota: `/order/list`
- Header: `Authorization: Bearer <token>`

#### Buscar pedido por id

- Metodo: `GET`
- Rota: `/order/:id`
- Header: `Authorization: Bearer <token>`

Exemplo: `/order/1001`

#### Atualizar pedido

- Metodo: `PUT`
- Rota: `/order/:id`
- Header: `Authorization: Bearer <token>`
- Body (envie um ou mais campos):

```json
{
  "valorTotal": 220,
  "dataCriacao": "2026-03-10T10:00:00.000Z",
  "items": [
    {
      "idItem": 2,
      "quantidadeItem": 1,
      "valorItem": 220
    }
  ]
}
```

- Respostas comuns:
- `200` pedido atualizado
- `400` nada valido para atualizar
- `404` pedido nao encontrado

#### Remover pedido

- Metodo: `DELETE`
- Rota: `/order/:id`
- Header: `Authorization: Bearer <token>`

- Respostas comuns:
- `204` removido com sucesso
- `404` pedido nao encontrado

## Exemplo rapido com cURL

1. Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d "{\"username\":\"admin\",\"password\":\"123456\"}"
```

2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d "{\"username\":\"admin\",\"password\":\"123456\"}"
```

3. Criar pedido (trocar `<TOKEN>`)

```bash
curl -X POST http://localhost:3000/order/ \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN>" \
	-d "{\"numeroPedido\":\"1001\",\"valorTotal\":199.9,\"dataCriacao\":\"2026-03-09T10:00:00.000Z\",\"items\":[{\"idItem\":1,\"quantidadeItem\":2,\"valorItem\":49.95}]}"
```
