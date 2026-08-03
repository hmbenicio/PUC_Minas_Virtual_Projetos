# 🛍️ AlfaStore - Documentação da API para Frontend

**Versão:** 2.0.0  
**Última Atualização:** 28 de Novembro de 2025  
**URL Base (Produção):** `https://loja-api-c9ec.onrender.com/api/v1`  
**URL Base (Desenvolvimento):** `http://localhost:3000/api/v1`

---

## 📋 Índice

1. [Introdução](#1-introdução)
2. [Autenticação](#2-autenticação)
3. [Estrutura de Erros](#3-estrutura-de-erros)
4. [Usuários](#4-usuários)
5. [Produtos](#5-produtos)
6. [Pagamentos](#6-pagamentos)
7. [Referência Rápida](#7-referência-rápida)

---

## 1. Introdução

Esta documentação detalha todos os endpoints disponíveis na API da **AlfaStore** para integração com o frontend. A API segue o padrão RESTful e utiliza JSON para troca de dados.

### 1.1 Headers Padrão

Todas as requisições devem incluir:

```http
Content-Type: application/json
```

Para rotas protegidas, adicione também:

```http
Authorization: Bearer <seu_token_jwt>
```

### 1.2 Níveis de Acesso (Roles)

| Role | Descrição |
|------|-----------|
| `cliente` | Padrão. Gerencia seu próprio perfil e visualiza produtos. |
| `admin` | Privilegiado. Gerencia todos os usuários, produtos e pode criar outros admins. |

> ⚠️ **Nota:** Admins são criados exclusivamente via rota autenticada ou script interno.

---

## 2. Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação. O token tem validade de **8 horas**.

### 2.1 Fluxo de Autenticação

```
1. POST /users/login → Retorna { user, token }
2. Armazene o token de forma segura (localStorage, cookie httpOnly, etc.)
3. Envie o token em todas as requisições protegidas via Header Authorization
```

### 2.2 `POST /users/login` - Fazer Login

Autentica um usuário e retorna o token de acesso.

**Acesso:** `Público`

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "minhasenha123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "60d5ecb1e7f3c6a4b8fbe9a1",
    "nome": "João da Silva",
    "email": "joao.silva@example.com",
    "cpf": "123.456.789-00",
    "telefone": "31999998888",
    "role": "cliente",
    "endereco": {
      "rua": "Rua das Flores",
      "numero": "123",
      "cidade": "Belo Horizonte",
      "estado": "MG",
      "cep": "30130-000"
    },
    "consentimentoDados": {
      "termosDeUso": true,
      "politicaDePrivacidade": true,
      "dataConsentimento": "2025-11-28T10:00:00.000Z"
    },
    "createdAt": "2025-11-28T10:00:00.000Z",
    "updatedAt": "2025-11-28T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros Possíveis:**

| Status | Mensagem | Causa |
|--------|----------|-------|
| 400 | Email e senha são obrigatórios | Campos ausentes |
| 401 | Credenciais inválidas | Email não existe ou senha incorreta |

---

## 3. Estrutura de Erros

### 3.1 Erro de Validação (400 Bad Request)

Quando os dados enviados não passam na validação (Zod):

```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "code": "invalid_string",
      "validation": "email",
      "message": "Formato de email inválido.",
      "path": ["body", "email"]
    },
    {
      "code": "too_small",
      "minimum": 8,
      "message": "Senha é obrigatória e deve ter no mínimo 8 caracteres.",
      "path": ["body", "senha"]
    }
  ]
}
```

### 3.2 Erro de Autenticação (401 Unauthorized)

Quando o token está ausente, expirado ou inválido:

```json
{
  "status": "error",
  "statusCode": 401,
  "message": "Token inválido ou expirado."
}
```

### 3.3 Erro de Autorização (403 Forbidden)

Quando o usuário não tem permissão para a ação:

```json
{
  "status": "error",
  "statusCode": 403,
  "message": "Acesso negado. Você só pode visualizar seus próprios dados."
}
```

### 3.4 Recurso Não Encontrado (404 Not Found)

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Usuário não encontrado"
}
```

---

## 4. Usuários

### 4.1 `POST /users` - Cadastrar Novo Usuário

Cria uma conta de cliente.

**Acesso:** `Público`

**Request Body:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "telefone": "31999998888",
  "senha": "minhasenha123",
  "endereco": {
    "rua": "Avenida Central",
    "numero": "456",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "cep": "30130-000"
  },
  "consentimentoDados": {
    "termosDeUso": true,
    "politicaDePrivacidade": true
  }
}
```

**Validações:**

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `nome` | string | ✅ | Mínimo 3 caracteres |
| `email` | string | ✅ | Formato de email válido |
| `cpf` | string | ✅ | Formato `XXX.XXX.XXX-XX` |
| `telefone` | string | ✅ | 10-11 dígitos (apenas números) |
| `senha` | string | ✅ | Mínimo 8 caracteres |
| `endereco.rua` | string | ✅ | Mínimo 3 caracteres |
| `endereco.numero` | string | ✅ | - |
| `endereco.cidade` | string | ✅ | - |
| `endereco.estado` | string | ✅ | Exatamente 2 caracteres (sigla) |
| `endereco.cep` | string | ✅ | Formato `XXXXX-XXX` |
| `consentimentoDados.termosDeUso` | boolean | ✅ | Deve ser `true` |
| `consentimentoDados.politicaDePrivacidade` | boolean | ✅ | Deve ser `true` |

**Response (201 Created):**
```json
{
  "_id": "60d5ecb1e7f3c6a4b8fbe9a1",
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "telefone": "31999998888",
  "role": "cliente",
  "endereco": {
    "rua": "Avenida Central",
    "numero": "456",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "cep": "30130-000"
  },
  "consentimentoDados": {
    "termosDeUso": true,
    "politicaDePrivacidade": true,
    "dataConsentimento": "2025-11-28T10:00:00.000Z"
  },
  "createdAt": "2025-11-28T10:00:00.000Z",
  "updatedAt": "2025-11-28T10:00:00.000Z"
}
```

---

### 4.2 `POST /admin/users` - Admin Cria Usuário

Permite que um admin crie um usuário (cliente ou outro admin).

**Acesso:** `Privado (Admin)`

**Headers:** `Authorization: Bearer <token_admin>`

**Request Body:**
```json
{
  "nome": "Novo Admin",
  "email": "admin.novo@email.com",
  "cpf": "987.654.321-00",
  "telefone": "31988887777",
  "senha": "senhaSegura123",
  "role": "admin",
  "endereco": {
    "rua": "Rua Admin",
    "numero": "100",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-000"
  }
}
```

> 💡 **Nota:** Os campos `consentimentoDados` são opcionais quando um admin cria o usuário. O campo `role` aceita `"cliente"` ou `"admin"`.

**Response (201 Created):** Mesmo formato do cadastro público.

---

### 4.3 `GET /users` - Listar Todos os Usuários

**Acesso:** `Privado (Admin)`

**Headers:** `Authorization: Bearer <token_admin>`

**Response (200 OK):**
```json
[
  {
    "_id": "60d5ecb1e7f3c6a4b8fbe9a1",
    "nome": "Admin Master",
    "email": "admin@alfastore.com",
    "cpf": "111.222.333-44",
    "telefone": "31999999999",
    "role": "admin",
    "endereco": { ... },
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-11-28T10:00:00.000Z"
  },
  {
    "_id": "60d5ecb2e7f3c6a4b8fbe9a2",
    "nome": "Maria Cliente",
    "email": "maria@email.com",
    "role": "cliente",
    ...
  }
]
```

---

### 4.4 `GET /users/:id` - Obter Usuário por ID

**Acesso:** `Privado (Dono do perfil ou Admin)`

**Headers:** `Authorization: Bearer <token>`

**Parâmetros URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID MongoDB do usuário |

**Response (200 OK):** Objeto completo do usuário.

**Erros:**
- `403` - Cliente tentando ver perfil de outro usuário
- `404` - ID não encontrado

---

### 4.5 `PUT /users/:id` - Atualizar Usuário

**Acesso:** `Privado (Dono do perfil ou Admin)`

**Headers:** `Authorization: Bearer <token>`

**Request Body (campos opcionais):**
```json
{
  "nome": "Novo Nome",
  "telefone": "31988887777",
  "endereco": {
    "rua": "Nova Rua",
    "numero": "999"
  },
  "role": "admin"
}
```

> ⚠️ **Nota:** Apenas admins podem alterar o campo `role`.

**Validações para Update:**

| Campo | Tipo | Regras |
|-------|------|--------|
| `nome` | string | Mínimo 3 caracteres |
| `telefone` | string | 10-11 dígitos |
| `endereco` | object | Campos parciais permitidos |
| `role` | string | `"cliente"` ou `"admin"` (apenas admin) |

**Response (200 OK):** Objeto atualizado do usuário.

---

### 4.6 `PATCH /users/change-password` - Alterar Própria Senha

Permite que o usuário logado altere sua própria senha.

**Acesso:** `Privado (Usuário logado)`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "senhaAtual": "minhasenhaantiga",
  "novaSenha": "minhanovasenha123"
}
```

**Validações:**

| Campo | Tipo | Regras |
|-------|------|--------|
| `senhaAtual` | string | Obrigatório |
| `novaSenha` | string | Mínimo 8 caracteres |

**Response (200 OK):**
```json
{
  "message": "Senha alterada com sucesso!"
}
```

---

### 4.7 `POST /users/forgot-password` - Esqueci Minha Senha

Envia um e-mail com link para redefinição de senha.

**Acesso:** `Público`

**Request Body:**
```json
{
  "email": "usuario@email.com"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Token enviado para o e-mail!"
}
```

> 💡 O e-mail enviado contém um link no formato: `{FRONTEND_URL}/reset-password/{token}`

---

### 4.8 `PUT /users/reset-password/:token` - Redefinir Senha

Redefine a senha utilizando o token recebido por e-mail.

**Acesso:** `Público`

**Parâmetros URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `token` | string | Token recebido por e-mail |

**Request Body:**
```json
{
  "novaSenha": "minhanovasenha123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Senha alterada com sucesso! Faça login com a nova senha."
}
```

---

### 4.9 `DELETE /users/:id` - Deletar Usuário

**Acesso:** `Privado (Dono do perfil ou Admin)`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

> ⚠️ **Nota:** Um admin não pode ser deletado.

---

## 5. Produtos

### 5.1 `GET /products` - Listar Todos os Produtos

**Acesso:** `Público`

**Response (200 OK):**
```json
[
  {
    "_id": "60d5ecb1e7f3c6a4b8fbe9a1",
    "nome": "Sandália Conforto Premium",
    "tipo": "F",
    "tamanho": "38",
    "estampa": true,
    "preco": 129.90,
    "quantidade": 50,
    "promo": true,
    "precoPromo": 99.90,
    "imagem": "https://exemplo.com/imagem.jpg",
    "ads": "Lançamento de verão!",
    "createdAt": "2025-11-28T10:00:00.000Z",
    "updatedAt": "2025-11-28T10:00:00.000Z"
  },
  ...
]
```

**Tipos de Produto:**

| Código | Descrição |
|--------|-----------|
| `M` | Masculino |
| `F` | Feminino |
| `I` | Infantil |
| `E` | Esportivo |

---

### 5.2 `GET /products/:id` - Obter Produto por ID

**Acesso:** `Público`

**Response (200 OK):** Objeto do produto.

**Erro (404):** Produto não encontrado.

---

### 5.3 `POST /products` - Criar Produto

**Acesso:** `Privado (Admin)`

**Headers:** `Authorization: Bearer <token_admin>`

**Request Body:**
```json
{
  "nome": "Sandália Sport Max",
  "tipo": "E",
  "tamanho": "42",
  "estampa": false,
  "preco": 199.90,
  "quantidade": 30,
  "promo": true,
  "precoPromo": 149.90,
  "imagem": "https://exemplo.com/sport-max.jpg",
  "ads": "Ideal para corridas!"
}
```

**Validações:**

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `nome` | string | ✅ | Mínimo 3 caracteres |
| `tipo` | string | ✅ | `M`, `F`, `I` ou `E` |
| `tamanho` | string | ✅ | - |
| `estampa` | boolean | ✅ | - |
| `preco` | number | ✅ | Valor positivo |
| `quantidade` | number | ✅ | Inteiro >= 0 |
| `promo` | boolean | ❌ | Default: `false` |
| `precoPromo` | number | ❌* | Positivo, menor que `preco` |
| `imagem` | string | ❌ | URL da imagem |
| `ads` | string | ❌ | Texto promocional |

> ⚠️ *Se `promo` for `true`, `precoPromo` é obrigatório.

**Response (201 Created):** Objeto do produto criado.

---

### 5.4 `PUT /products/:id` - Atualizar Produto

**Acesso:** `Privado (Admin)`

**Headers:** `Authorization: Bearer <token_admin>`

**Request Body:** Campos opcionais conforme tabela acima.

**Response (200 OK):** Objeto do produto atualizado.

---

### 5.5 `DELETE /products/:id` - Deletar Produto

**Acesso:** `Privado (Admin)`

**Headers:** `Authorization: Bearer <token_admin>`

**Response (200 OK):**
```json
{
  "message": "Produto deletado com sucesso"
}
```

---

## 6. Pagamentos

Integração com **Mercado Pago** para processamento de pagamentos.

### 6.1 `POST /payments/preferences` - Criar Preferência de Pagamento

Cria uma preferência de checkout para redirecionar o usuário ao Mercado Pago.

**Acesso:** `Privado (Usuário logado)`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "id": "product_123",
      "title": "Sandália Conforto Premium",
      "description": "Sandália feminina tamanho 38",
      "quantity": 2,
      "unit_price": 99.90,
      "currency_id": "BRL",
      "picture_url": "https://exemplo.com/imagem.jpg",
      "category_id": "calçados"
    }
  ],
  "external_reference": "order_abc123",
  "payer": {
    "email": "cliente@email.com",
    "name": "Maria",
    "surname": "Silva",
    "identification": {
      "type": "CPF",
      "number": "12345678900"
    },
    "phone": {
      "area_code": "31",
      "number": "999998888"
    },
    "address": {
      "zip_code": "30130-000",
      "street_name": "Avenida Central",
      "street_number": "456",
      "neighborhood": "Centro",
      "city": "Belo Horizonte",
      "state": "MG"
    }
  },
  "shipments": {
    "receiver_address": {
      "zip_code": "30130-000",
      "street_name": "Avenida Central",
      "street_number": "456",
      "neighborhood": "Centro",
      "city_name": "Belo Horizonte",
      "state_name": "MG"
    }
  },
  "back_urls": {
    "success": "https://alfastore.com/pagamento/sucesso",
    "failure": "https://alfastore.com/pagamento/falha",
    "pending": "https://alfastore.com/pagamento/pendente"
  },
  "notification_url": "https://alfastore.com/webhooks/mercadopago",
  "statement_descriptor": "ALFASTORE",
  "binary_mode": false,
  "auto_return": "approved",
  "installments": 12
}
```

**Validações de Items:**

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `items` | array | ✅ | Mínimo 1 item |
| `items[].title` | string | ✅ | Mínimo 1 caractere |
| `items[].quantity` | number | ✅ | Inteiro positivo |
| `items[].unit_price` | number | ✅ | Valor positivo |
| `items[].currency_id` | string | ❌ | Default: `BRL` |
| `items[].picture_url` | string | ❌ | URL válida |
| `external_reference` | string | ✅ | Identificador do pedido |

**Response (201 Created):**
```json
{
  "id": "1234567890",
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1234567890",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=1234567890",
  "collector_id": 12345678,
  "items": [...],
  "payer": {...},
  "back_urls": {...},
  "external_reference": "order_abc123",
  ...
}
```

> 💡 Redirecione o usuário para `init_point` (produção) ou `sandbox_init_point` (testes).

---

## 7. Referência Rápida

### 7.1 Todas as Rotas

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| **USUÁRIOS** ||||
| `POST` | `/users` | Público | Cadastrar cliente |
| `POST` | `/users/login` | Público | Fazer login |
| `POST` | `/users/forgot-password` | Público | Solicitar reset de senha |
| `PUT` | `/users/reset-password/:token` | Público | Redefinir senha |
| `GET` | `/users` | Admin | Listar todos usuários |
| `POST` | `/admin/users` | Admin | Criar usuário (cliente/admin) |
| `GET` | `/users/:id` | Dono/Admin | Ver perfil |
| `PUT` | `/users/:id` | Dono/Admin | Atualizar perfil |
| `PATCH` | `/users/change-password` | Logado | Alterar própria senha |
| `DELETE` | `/users/:id` | Dono/Admin | Deletar conta |
| **PRODUTOS** ||||
| `GET` | `/products` | Público | Listar produtos |
| `GET` | `/products/:id` | Público | Ver produto |
| `POST` | `/products` | Admin | Criar produto |
| `PUT` | `/products/:id` | Admin | Atualizar produto |
| `DELETE` | `/products/:id` | Admin | Deletar produto |
| **PAGAMENTOS** ||||
| `POST` | `/payments/preferences` | Logado | Criar preferência MP |

### 7.2 Códigos de Status HTTP

| Status | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Erro de validação |
| `401` | Não autenticado |
| `403` | Não autorizado (sem permissão) |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

### 7.3 Usuário Admin de Teste

Para testes durante o desenvolvimento:

| Campo | Valor |
|-------|-------|
| **E-mail** | `bernardo@teste.com` |
| **Senha** | `minhasenhasecreta123` |

---

## 📌 Dicas para Integração

### Armazenamento do Token

```javascript
// Após login bem-sucedido
localStorage.setItem('alfastore_token', response.token);
localStorage.setItem('alfastore_user', JSON.stringify(response.user));

// Para requisições autenticadas
const token = localStorage.getItem('alfastore_token');
fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Tratamento de Erros

```javascript
try {
  const response = await fetch('/api/v1/users', options);
  
  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 400) {
      // Exibir erros de validação nos campos do formulário
      error.errors.forEach(err => {
        const field = err.path[err.path.length - 1];
        // Mostrar mensagem no campo correspondente
      });
    } else if (response.status === 401) {
      // Redirecionar para login
      window.location.href = '/login';
    } else if (response.status === 403) {
      // Exibir mensagem de acesso negado
    }
  }
} catch (error) {
  // Erro de rede
}
```

### Verificação de Permissão

```javascript
const user = JSON.parse(localStorage.getItem('alfastore_user'));

// Verificar se é admin
const isAdmin = user?.role === 'admin';

// Verificar se é dono do recurso
const isOwner = user?._id === resourceOwnerId;

// Pode editar?
const canEdit = isAdmin || isOwner;
```

---

**Desenvolvido com ❤️ pela equipe AlfaStore**
