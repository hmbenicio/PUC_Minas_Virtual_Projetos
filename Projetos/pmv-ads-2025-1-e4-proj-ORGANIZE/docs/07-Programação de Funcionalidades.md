# Programação de Funcionalidades

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="4-Metodologia.md"> Metodologia</a>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="5-Arquitetura da Solução.md"> Arquitetura da Solução</a>

## Relatório de Implementação do Sistema

Este documento descreve a implementação do sistema com base nos requisitos funcionais e não funcionais. Para cada requisito, são apresentados os artefatos desenvolvidos, estruturas de dados utilizadas e instruções para acesso e verificação no ambiente de hospedagem.

---

### Requisito Funcional RF-001

**Objetivo:** Permitir que os usuários criem uma conta na plataforma.

> **Responsável:** Helbert Miranda Benício

#### Descrição

O sistema deve permitir que o usuário realize o cadastro preenchendo os dados obrigatórios.

#### Artefatos Criados

- **Frontend:** `src/app/create/page.js`
- **Backend:** `controllers/UserController.js` (método `Create`)
- **Validações:** Implementadas tanto no frontend quanto no backend
- **Banco de Dados:** Coleção `users` no MongoDB

#### Estrutura de Dados

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "createdAt": "Date",
  "__v": "Number"
}
```

#### Comportamento Esperado

1. O usuário acessa a rota `/create` e visualiza o formulário de cadastro com os campos obrigatórios:

   - Nome
   - Email
   - Senha

2. Ao preencher e submeter o formulário:

   - É feita uma requisição `POST` para o endpoint `/user/create` com os dados inseridos.

3. Se os dados forem **válidos**:

   - A conta do usuário é criada na coleção `users` no MongoDB.
   - O sistema pode redirecionar o usuário para a tela de login (`/login`) ou autenticar automaticamente, conforme a lógica de negócio.
   - Uma mensagem de sucesso é exibida: `"Cadastro realizado com sucesso."`

4. Se os dados forem **inválidos**:
   - As validações do frontend impedem o envio se campos obrigatórios estiverem vazios ou incorretos.
   - Caso o backend rejeite os dados (ex: email já existente), uma mensagem de erro é exibida: `"Erro ao criar conta. Verifique os dados e tente novamente."`

---

### Requisito Funcional RF-002

**Objetivo:** Permitir a autenticação dos usuários na plataforma via e-mail e senha.

> **Responsável:** Helbert Miranda Benício

#### Descrição

O sistema deve permitir que o usuário realize o login informando seu e-mail e senha. As credenciais devem ser validadas no backend e, em caso de sucesso, um token JWT deve ser gerado e armazenado localmente para conceder acesso ao ambiente autenticado.

#### Artefatos Criados

- **Frontend:** `src/app/login/page.js`
- **Backend:** `controllers/UserController.js` (método `Login`)
  - Validações implementadas no frontend e backend
- **Banco de Dados:** Coleção `users` no MongoDB

#### Estrutura de Dados (Erro Comum Capturado)

```json
{
  "stringValue": "\"login\"",
  "valueType": "string",
  "kind": "ObjectId",
  "value": "login",
  "path": "_id",
  "reason": {},
  "name": "CastError",
  "message": "Cast to ObjectId failed for value \"login\" (type string) at path \"_id\" for model \"User\""
}
```

#### Comportamento Esperado

1. O usuário acessa a rota `/login` e visualiza o formulário com os seguintes campos obrigatórios:

   - **Email**
   - **Senha**

2. Ao preencher os campos e submeter o formulário:

   - Uma requisição `POST` é enviada para o endpoint `/user/login` com os dados fornecidos.

3. Se as credenciais forem **válidas**:

   - O backend valida os dados e gera um **token JWT**.
   - O token JWT é armazenado no `localStorage`.
   - A flag `isAuthenticated` é definida como `true`.
   - O usuário é redirecionado automaticamente para a rota protegida `/homeOn`.
   - A interface é recarregada (opcionalmente após 1 segundo) para aplicar as mudanças de autenticação na UI.

4. Se as credenciais forem **inválidas**:
   - O backend retorna uma mensagem de erro.
   - O frontend exibe um alerta ou mensagem de erro: `"Email ou senha inválidos."`
   - O formulário permanece visível para nova tentativa de login.

---

### Requisito Funcional RF-003

**Objetivo:** Permitir que os usuários façam logout na plataforma.

> **Responsável:** Helbert Miranda Benício

#### Descrição

O sistema deve permitir que o usuário encerre sua sessão por meio da interface (barra lateral), garantindo a remoção dos dados de autenticação local e bloqueando o acesso a áreas restritas.

#### Artefatos Criados

- **Frontend:** `src/components/sidebar/index.js`
- **Função de Logout:** `handleLogout()`
- **Armazenamento:** Remoção do token/flag de autenticação no `localStorage`
- **Redirecionamento:** `window.location.href = "/"`

#### Estrutura de Dados (Erro Comum Capturado)

```json
{
  "stringValue": "\"logout\"",
  "valueType": "string",
  "kind": "ObjectId",
  "value": "logout",
  "path": "_id",
  "reason": {},
  "name": "CastError",
  "message": "Cast to ObjectId failed for value \"logout\" (type string) at path \"_id\" for model \"User\""
}
```

#### Comportamento Esperado

1. Quando o usuário estiver **autenticado** (`isAuthenticated = true`), a interface da barra lateral (Sidebar) exibe o botão ou ícone de logout (ex: `LogOutIcon`).

2. Ao clicar no botão de logout:

   - A função `handleLogout()` é executada.
   - Os seguintes passos são realizados:
     - A flag `isAuthenticated` é removida ou definida como `"false"` no `localStorage`.
     - O estado de autenticação no frontend é atualizado com `setAuthenticated(false)`.
     - O usuário é redirecionado para a rota pública `/` (página inicial).

3. Após o logout:
   - A interface é atualizada para ocultar os menus e funcionalidades acessíveis apenas a usuários autenticados, como:
     - "Início"
     - "Perfil"
     - Outras páginas restritas
   - O botão ou link de **Login** volta a ser exibido na interface.
   - O acesso a rotas protegidas é bloqueado, redirecionando o usuário não autenticado para a página de login ou inicial, conforme a regra de navegação definida.

---
### Requisito Funcional RF-004

**Objetivo:** Permitir a redefinição de senha dos usuários na plataforma.	

> **Responsável:** Jonatas de Carvalho Brum

#### Descrição

O sistema deve permitir que o usuário redefina a sua senha.

#### Artefatos Criados

- **Frontend:** `src/app/password-update`
- **Backend:** `userController.passwordUpdate.js` 
- **Validações:** Implementadas tanto no frontend quanto no backend
- **Banco de Dados:** Coleção `users` no MongoDB

#### Estrutura de Dados

```json
{
  "stringValue": "\"password-update\"",
  "valueType": "string",
  "kind": "ObjectId",
  "value": "password-update",
  "path": "_id",
  "reason": {},
  "name": "CastError",
  "message": "Cast to ObjectId failed for value \"password-update\" (type string) at path \"_id\" for model \"User\""
}
```

#### Comportamento Esperado

1. O usuário acessa a rota `/create` e visualiza o formulário de cadastro com os campos obrigatórios:


   - Email
   - Senha 
   - Nova Senha

2. Ao preencher e submeter o formulário:

   - É feita uma requisição `POST` para o endpoint `/user/password-update` com os dados inseridos.

3. Se os dados forem **válidos**:

   - A conta do usuário é criada na coleção `users` no MongoDB.
   - O sistema pode redirecionar o usuário para a tela de login (`/login`) ou autenticar automaticamente, conforme a lógica de negócio.
   - Uma mensagem de sucesso é exibida: `""Senha atualizada com sucesso!"`

4. Se os dados forem **inválidos**:
   - As validações do frontend impedem o envio se campos obrigatórios estiverem vazios ou incorretos.
   - Caso o backend rejeite os dados (ex: email já existente), uma mensagem de erro é exibida: `"Erro ao conectar com o servidor."`

---

