# Codigo Fonte - AlfaStore
Monorepo do e-commerce AlfaStore com **frontend em Next.js** e **API Node.js/Express em TypeScript**. Aqui estao as orientacoes para configurar, rodar e publicar o projeto.

## Estrutura
- `frontend/` - Next.js (app router) integrado ao checkout do Mercado Pago em `/api/payments/mercadopago`.
- `backend/`  - API REST com Express 5, MongoDB (Mongoose), JWT, Zod e Mercado Pago.
- `nginx/`    - Reverse proxy para producao com TLS.
- `docker-compose.yml` - Sobe o frontend em modo producao detras do Nginx.

## Requisitos
- Node.js 18+ e npm
- MongoDB (local ou Atlas)
- Conta e credenciais do Mercado Pago
- Docker e Docker Compose (opcional para deploy)

## Variaveis de ambiente
### Backend (`backend/.env` - use `.env.example` como base)
- `MONGO_URI` (obrigatoria) - string de conexao MongoDB.
- `JWT_SECRET` (obrigatoria) - chave usada nos tokens.
- `FRONTEND_URL` / `FRONTEND_BASE_URL` - links usados em e-mails.
- `CORS_ORIGIN` - origens permitidas separadas por virgula.
- Credenciais SMTP (`EMAIL_HOST`, `EMAIL_USERNAME`, etc.) para envio de e-mails.
- Credenciais Mercado Pago (`MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_PUBLIC_KEY`, `..._SUCCESS_URL`, etc.).

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_BACKEND_URL` - URL base da API (ex.: `http://localhost:3001/api/v1` ou endpoint em producao).
- `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` - public key do Mercado Pago.
- `MERCADO_PAGO_ACCESS_TOKEN` - access token do mesmo vendedor.
- `FRONTEND_BASE_URL`, `MERCADO_PAGO_NOTIFICATION_URL`, `MERCADO_PAGO_STATEMENT_DESCRIPTOR` - ajustes de checkout.

## Como rodar em desenvolvimento
### Backend
```bash
cd backend
cp .env.example .env  # configure valores reais
npm install
npm run dev           # inicia a API (porta padrao 3000)
```
> Se o frontend tambem usar a porta 3000, defina `PORT=3001` no `.env` e aponte `NEXT_PUBLIC_BACKEND_URL` para essa porta.

### Frontend
```bash
cd frontend
# crie/edite .env.local com as chaves acima
npm install
npm run dev           # Next.js em http://localhost:3000
```
> Certifique-se de que `NEXT_PUBLIC_BACKEND_URL` aponta para o backend ativo.

## Build e producao
- Backend: `npm run build` e depois `npm start` em `backend/`.
- Frontend: `npm run build` e `npm start` em `frontend/` (Next em modo producao).
- Docker: `docker-compose up --build` gera a imagem do frontend e publica via Nginx (requer certificados TLS nos caminhos montados no compose). O backend deve estar acessivel via `NEXT_PUBLIC_BACKEND_URL`.

## Historico de versoes
### [0.1.0] - 12/2025
#### Adicionado
- Primeira versao do monorepo com API Express + MongoDB e frontend Next.js integrado ao Mercado Pago.
