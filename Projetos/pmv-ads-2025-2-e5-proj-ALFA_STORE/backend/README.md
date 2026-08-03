# 🛍️ AlfaStore API (Backend)

Bem-vindo ao repositório do backend da **AlfaStore**, uma API robusta e escalável para e-commerce de calçados, desenvolvida com foco em segurança, performance e boas práticas de engenharia de software.

Este projeto gerencia usuários, autenticação, controle de acesso (RBAC) e catálogo de produtos, servindo como a espinha dorsal para o frontend da loja.

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| **Runtime** | Node.js |
| **Linguagem** | TypeScript |
| **Framework** | Express.js v5 |
| **Database** | MongoDB (via Mongoose ODM) |
| **Validação** | Zod |
| **Autenticação** | JWT (JSON Web Tokens) |
| **Segurança** | Bcrypt, Helmet, CORS, Rate Limiting, HPP, Mongo Sanitize |
| **Pagamentos** | Mercado Pago SDK |
| **E-mail** | Nodemailer (SMTP) |
| **Containerização** | Docker & Docker Compose |

---

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura em camadas (Controller-Service-Model) para garantir a separação de responsabilidades.

```
src/
├── config/         # Configurações do banco de dados e ambiente
├── controllers/    # Lógica de entrada/saída (Request/Response)
├── middlewares/    # Interceptadores (Auth, Admin, Error Handling, Validation)
├── models/         # Schemas do Mongoose (User, Product)
├── routes/         # Definição das rotas da API
├── scripts/        # Scripts utilitários (ex: criar admin inicial, testar email)
├── services/       # Lógica de negócio pesada e acesso ao BD
├── utils/          # Funções auxiliares (Templates de email, Transporter)
└── validators/     # Schemas de validação Zod
```

### Fluxo de Requisição

```
Request → Routes → Middlewares → Controllers → Services → Models → MongoDB
```

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Define endpoints, aplica middlewares e roteia para controllers |
| **Middlewares** | Autenticação, Autorização, Validação, Tratamento de Erros |
| **Controllers** | Lida com request/response HTTP, chama services, retorna respostas |
| **Services** | Lógica de negócio, operações no banco, integrações externas (email) |
| **Models** | Schemas Mongoose definindo estrutura dos documentos MongoDB |
| **Validators** | Schemas Zod para validação de dados das requisições |

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- Docker (Opcional, mas recomendado)
- Conta no MongoDB Atlas (ou Mongo local)

### 1. Clonar e Instalar

```bash
git clone <url-do-repositorio>
cd loja-backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e preencha conforme o exemplo:

```env
# Servidor
PORT=3000

# Banco de Dados
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/loja-db

# Segurança (Gere um hash longo e seguro)
JWT_SECRET=sua_chave_secreta_super_segura

# Configuração de E-mail (SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USERNAME=seu_login_smtp
EMAIL_PASSWORD=sua_senha_smtp
EMAIL_FROM=noreply@alfastore.com

# Frontend (Para links nos e-mails)
FRONTEND_URL=http://localhost:5173
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `PORT` | Não | Porta do servidor (padrão: 3000) |
| `MONGO_URI` | **Sim** | String de conexão MongoDB |
| `JWT_SECRET` | **Sim** | Chave secreta para assinatura JWT |
| `FRONTEND_URL` | Não | URL do frontend para links em e-mails (padrão: `http://localhost:5173`) |
| `EMAIL_HOST` | Não* | Host SMTP |
| `EMAIL_PORT` | Não | Porta SMTP (padrão: 587) |
| `EMAIL_USERNAME` | Não* | Usuário SMTP |
| `EMAIL_PASSWORD` | Não* | Senha/API key SMTP |
| `EMAIL_FROM` | Não | E-mail remetente (padrão: `noreply@loja.com`) |
| `CORS_ORIGIN` | Não | Origens permitidas separadas por vírgula (padrão: `http://localhost:5173,https://www.alfaofc.com.br`) |
| `NODE_ENV` | Não | Ambiente (`development` ou `production`) |
| `MERCADO_PAGO_ACCESS_TOKEN` | **Sim*** | Token de acesso do Mercado Pago |

\* Obrigatórias para funcionalidade de e-mail funcionar.
\** Obrigatória apenas se usar funcionalidade de pagamentos.

### 3. Rodar a Aplicação

**Modo Desenvolvimento:**

```bash
npm run dev
```

**Modo Produção (Build):**

```bash
npm run build
npm start
```

**Via Docker:**

```bash
docker-compose up --build
```

---

## 🔑 Autenticação e Autorização

A API utiliza **JWT** no header `Authorization`.

**Formato:** `Bearer <token>`

### Níveis de Acesso (Roles)

| Role | Descrição |
|------|-----------|
| `cliente` | Padrão. Pode gerenciar apenas seu próprio perfil e visualizar produtos. |
| `admin` | Privilegiado. Pode gerenciar todos os usuários, produtos e criar outros admins. |

> ⚠️ **Nota:** Não é possível criar um admin via rota pública de registro. Utilize o script de seed ou a rota autenticada de admin.

### Fluxo de Autenticação

1. Usuário envia `email` e `senha` para `/api/v1/users/login`
2. Senha é verificada com `bcrypt.compare()`
3. JWT é assinado com `JWT_SECRET` contendo o `id` do usuário
4. Token é retornado no corpo da resposta

### Middlewares de Segurança

| Middleware | Função |
|------------|--------|
| `helmet` | Define headers HTTP seguros (XSS, clickjacking, sniffing, etc) |
| `cors` | Controla origens permitidas para requisições |
| `rateLimit` | Limita requisições por IP (proteção contra brute force) |
| `mongoSanitize` | Previne NoSQL Injection |
| `hpp` | Previne HTTP Parameter Pollution |
| `authMiddleware` | Valida o token JWT e anexa o usuário à requisição |
| `adminMiddleware` | Verifica se `req.user.role === 'admin'` |
| `validate()` | Valida body/params com schemas Zod |

---

## 📚 Documentação das Rotas

**URL Base:** `/api/v1`

### 👤 Usuários (`/users`)

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/users` | Público | Registro de novo cliente. |
| `POST` | `/users/login` | Público | Autenticação (Retorna Token). |
| `POST` | `/users/forgot-password` | Público | Solicita e-mail de recuperação de senha. |
| `PUT` | `/users/reset-password/:token` | Público | Redefine a senha usando o token recebido. |
| `GET` | `/users` | Admin | Lista todos os usuários. |
| `POST` | `/admin/users` | Admin | Cria usuário (Cliente ou Admin). |
| `GET` | `/users/:id` | Dono/Admin | Vê detalhes de um perfil. |
| `PUT` | `/users/:id` | Dono/Admin | Atualiza dados (Admin pode alterar role). |
| `PATCH` | `/users/change-password` | Logado | Altera a própria senha (exige senha atual). |
| `DELETE` | `/users/:id` | Dono/Admin | Deleta a conta (Admin não pode ser deletado). |

### 👟 Produtos (`/products`)

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/products` | Público | Lista todas as sandálias. |
| `GET` | `/products/:id` | Público | Detalhes de uma sandália. |
| `POST` | `/products` | Admin | Cria novo produto. |
| `PUT` | `/products/:id` | Admin | Atualiza produto. |
| `DELETE` | `/products/:id` | Admin | Remove produto. |

### 💳 Pagamentos (`/payments`)

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/payments/preferences` | Logado | Cria preferência de checkout do Mercado Pago. |

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Retorna "API da Loja rodando!" |

---

## 🛡️ Regras de Validação Importantes

### Produtos

| Campo | Regras |
|-------|--------|
| `tipo` | Deve ser `'M'`, `'F'`, `'I'` ou `'E'`. |
| `tamanho` | String (ex: `"37"`, `"39/40"`). |
| `promo` | Se `true`, `precoPromo` é obrigatório e deve ser menor que `preco`. |
| `preco` | Número positivo. |
| `quantidade` | Inteiro não-negativo. |

### Usuários

| Campo | Regras |
|-------|--------|
| `cpf` | Formato `000.000.000-00`. |
| `senha` | Mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&). |
| `email` | Formato de e-mail válido. |
| `telefone` | 10-11 dígitos numéricos. |
| `cep` | Formato `XXXXX-XXX`. |
| `termosDeUso` | Deve ser `true`. |
| `politicaDePrivacidade` | Deve ser `true`. |

> 🔒 **Proteção:** Usuários com role `admin` são protegidos contra exclusão via API.

---

## 🧪 Testes Automatizados

O projeto utiliza **Jest** com **Supertest** para testes de integração das rotas da API e **MongoDB Memory Server** para simular o banco de dados em memória.

### Estrutura dos Testes

```
src/__tests__/
├── setup.ts              # Configuração global (MongoDB em memória)
├── testApp.ts            # Instância do Express para testes
└── routes/
    ├── health.routes.test.ts    # Testes do health check
    ├── user.routes.test.ts      # Testes de rotas de usuários
    ├── product.routes.test.ts   # Testes de rotas de produtos
    └── payment.routes.test.ts   # Testes de rotas de pagamentos
```

### Scripts de Teste

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch (re-executa ao salvar) |
| `npm run test:coverage` | Executa testes com relatório de cobertura |
| `npm run test:ci` | Executa testes em modo CI (para pipelines) |

### Cobertura de Testes

#### Rotas de Usuários (`/users`)

| Cenário | Tipo | Endpoint | Status Esperado |
|---------|------|----------|-----------------|
| Registro com dados válidos | ✅ Sucesso | POST `/users` | 201 |
| Registro com email inválido | ❌ Falha | POST `/users` | 400 |
| Registro com CPF inválido | ❌ Falha | POST `/users` | 400 |
| Registro com senha fraca | ❌ Falha | POST `/users` | 400 |
| Registro sem aceitar termos | ❌ Falha | POST `/users` | 400 |
| Login com credenciais válidas | ✅ Sucesso | POST `/users/login` | 200 |
| Login com senha incorreta | ❌ Falha | POST `/users/login` | 401 |
| Login com email inexistente | ❌ Falha | POST `/users/login` | 401 |
| Buscar próprio perfil | ✅ Sucesso | GET `/users/:id` | 200 |
| Buscar perfil de outro usuário | ❌ Falha | GET `/users/:id` | 403 |
| Atualizar próprio perfil | ✅ Sucesso | PUT `/users/:id` | 200 |
| Alterar senha com sucesso | ✅ Sucesso | PATCH `/users/change-password` | 200 |
| Alterar senha com senha atual errada | ❌ Falha | PATCH `/users/change-password` | 500 |
| Deletar própria conta | ✅ Sucesso | DELETE `/users/:id` | 200 |
| Deletar conta de outro usuário | ❌ Falha | DELETE `/users/:id` | 403 |

#### Rotas de Produtos (`/products`)

| Cenário | Tipo | Endpoint | Status Esperado |
|---------|------|----------|-----------------|
| Listar produtos (público) | ✅ Sucesso | GET `/products` | 200 |
| Buscar produto por ID (público) | ✅ Sucesso | GET `/products/:id` | 200 |
| Buscar produto inexistente | ❌ Falha | GET `/products/:id` | 404 |
| Admin cria produto | ✅ Sucesso | POST `/products` | 201 |
| Cliente tenta criar produto | ❌ Falha | POST `/products` | 403 |
| Criar produto com preço negativo | ❌ Falha | POST `/products` | 400 |
| Criar produto promo sem precoPromo | ❌ Falha | POST `/products` | 400 |
| Admin atualiza produto | ✅ Sucesso | PUT `/products/:id` | 200 |
| Admin deleta produto | ✅ Sucesso | DELETE `/products/:id` | 200 |

#### Rotas de Pagamentos (`/payments`)

| Cenário | Tipo | Endpoint | Status Esperado |
|---------|------|----------|-----------------|
| Criar preferência autenticado | ✅ Sucesso | POST `/payments/preferences` | 201 |
| Criar preferência sem autenticação | ❌ Falha | POST `/payments/preferences` | 401 |
| Criar preferência sem items | ❌ Falha | POST `/payments/preferences` | 400 |
| Criar preferência com preço negativo | ❌ Falha | POST `/payments/preferences` | 400 |
| Token do MercadoPago não configurado | ❌ Falha | POST `/payments/preferences` | 503 |
| Erro genérico do MercadoPago | ❌ Falha | POST `/payments/preferences` | 500 |

### Executando os Testes

```bash
# Rodar todos os testes
npm test

# Rodar com cobertura
npm run test:coverage

# Rodar em modo watch (desenvolvimento)
npm run test:watch
```

### Exemplo de Saída

```
 PASS  src/__tests__/routes/health.routes.test.ts
 PASS  src/__tests__/routes/user.routes.test.ts
 PASS  src/__tests__/routes/product.routes.test.ts
 PASS  src/__tests__/routes/payment.routes.test.ts

Test Suites: 4 passed, 4 total
Tests:       87 passed, 87 total
```

### ⚠️ Nota Importante: Ordem das Rotas no Express 5

No Express 5, a ordem de registro dos routers é importante quando usamos `router.use()` para aplicar middlewares globalmente. No arquivo `user.routes.ts`, usamos `router.use(authMiddleware)` para proteger rotas privadas. Isso pode afetar requisições em outros routers se a ordem não estiver correta.

**Ordem correta no `server.ts` e `testApp.ts`:**
```typescript
// Rotas com endpoints públicos devem vir primeiro
app.use('/api/v1', productRoutes);  // GET /products é público
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', userRoutes);     // Contém router.use(authMiddleware)
```

---

## 🛠️ Scripts Úteis

### Criar o Primeiro Administrador (Seed)

Se o banco estiver vazio e você precisar de um acesso admin inicial, configure o `.env` e rode:

```bash
npx ts-node src/scripts/create-admin.ts
```

> Edite o arquivo `src/scripts/create-admin.ts` para alterar as credenciais padrão se desejar.

### Testar Envio de E-mail

Para verificar se as credenciais SMTP estão funcionando:

```bash
npx ts-node src/scripts/test-email.ts
```

---

## 🐳 Docker & Deploy (Produção)

O projeto está pronto para contêineres. O Dockerfile agora inclui execução de testes antes do build.

### Pipeline de Build

1. Instala dependências (incluindo devDependencies)
2. **Executa testes automatizados** (se falhar, build é interrompido)
3. Compila TypeScript para JavaScript
4. Remove devDependencies para imagem menor
5. Inicia aplicação

### 1. Build da Imagem

```bash
docker build -t seu-usuario/loja-backend:1.0.0 .
```

### 2. Push para Docker Hub

```bash
docker push seu-usuario/loja-backend:1.0.0
```

### 3. Deploy (Render/AWS/VPS)

Atualize a referência da imagem no seu orquestrador. Lembre-se de configurar as variáveis de ambiente no painel do servidor de produção.

### Dockerfile

O projeto inclui um `Dockerfile` otimizado com testes integrados:

O projeto inclui um `Dockerfile` otimizado:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## 📧 Funcionalidades de E-mail

### Recursos

1. **E-mail de Boas-vindas** - Enviado no registro de usuário
2. **E-mail de Recuperação de Senha** - Enviado na solicitação de forgot-password

### Fluxo de Recuperação de Senha

1. Usuário solicita reset via `POST /users/forgot-password` com e-mail
2. Sistema gera token aleatório (32 bytes), hasheia (SHA256), armazena no BD com expiração de 10 min
3. E-mail é enviado com link: `FRONTEND_URL/reset-password/:token`
4. Usuário submete nova senha para `PUT /users/reset-password/:token`
5. Token é validado, senha é atualizada, token é limpo

---

## 🚨 Tratamento de Erros

A API utiliza um middleware global de tratamento de erros que retorna respostas padronizadas:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Descrição do erro"
}
```

### Códigos de Status

| Código | Significado |
|--------|-------------|
| `400` | Bad Request - Erro de validação |
| `401` | Unauthorized - Token inválido ou ausente |
| `403` | Forbidden - Acesso negado (permissão insuficiente) |
| `404` | Not Found - Recurso não encontrado |
| `500` | Internal Server Error - Erro interno |

---

## 📦 Dependências Principais

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `express` | ^5.1.0 | Framework web |
| `mongoose` | ^8.18.0 | ODM MongoDB |
| `jsonwebtoken` | ^9.0.2 | Autenticação JWT |
| `bcrypt` | ^6.0.0 | Hash de senhas |
| `zod` | ^4.1.5 | Validação de schemas |
| `nodemailer` | ^7.0.11 | Envio de e-mails |
| `dotenv` | ^17.2.3 | Variáveis de ambiente |
| `mercadopago` | ^2.x | SDK do Mercado Pago |
| `helmet` | ^8.x | Headers HTTP seguros |
| `cors` | ^2.x | Controle de origens |
| `express-rate-limit` | ^7.x | Rate limiting |
| `express-mongo-sanitize` | ^2.x | Proteção NoSQL Injection |
| `hpp` | ^0.2.x | Proteção HPP |
| `express-async-handler` | ^1.2.0 | Tratamento de erros async |

### Dependências de Desenvolvimento (Testes)

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `jest` | ^29.x | Framework de testes |
| `ts-jest` | ^29.x | Suporte TypeScript para Jest |
| `supertest` | ^7.x | Testes de requisições HTTP |
| `mongodb-memory-server` | ^10.x | MongoDB em memória para testes |

---

## 📝 Scripts NPM

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "start": "node dist/server.js",
  "build": "tsc",
  "test": "jest --runInBand",
  "test:watch": "jest --watch --runInBand",
  "test:coverage": "jest --coverage --runInBand",
  "test:ci": "jest --ci --coverage --runInBand"
}
```

---

Desenvolvido com 💙 pela equipe **AlfaStore**.
