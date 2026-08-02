# Arquitetura da Solução

> **Pré-requisito:** Consulte o documento [Projeto de Interface](04-Projeto%20de%20Interface.md) para compreender a integração visual com a arquitetura da aplicação.

Este documento descreve a estrutura da solução, abordando os principais componentes, modelagem de dados, tecnologias envolvidas e ambiente de hospedagem.

![Arquitetura da Solução](img/ArquiteturadaSolução.png)

---

## Diagrama de Classes

O **diagrama de classes** define a estrutura estática do sistema, especificando classes, atributos, métodos e relacionamentos.

**Exemplo:**

```mermaid
classDiagram
    class Usuario {
        +int Id
        +string Nome
        +string Email
        +bool Ativo
        +Login()
        +Logout()
    }

    class Produto {
        +int Id
        +string Nome
        +decimal Preco
    }

    Usuario "1" --> "*" Produto : "compra"
```

_Legenda:_ Um usuário pode comprar vários produtos.

---

## Modelo Entidade-Relacionamento (ER)

O **Modelo ER** descreve as entidades e seus relacionamentos, sendo essencial para o projeto do banco de dados.

**Exemplo:**

```mermaid
erDiagram
    USUARIO {
        int Id PK
        string Nome
        string Email
    }
    PRODUTO {
        int Id PK
        string Nome
        decimal Preco
    }
    COMPRA {
        int Id PK
        int UsuarioId FK
        int ProdutoId FK
        date DataCompra
    }

    USUARIO ||--o{ COMPRA : realiza
    PRODUTO ||--o{ COMPRA : pertence
```

_Legenda:_ Um usuário pode realizar várias compras; uma compra está associada a um produto.

---

## Esquema Relacional

O **esquema relacional** traduz o modelo ER para o banco de dados relacional.

**Exemplo:**

```sql
CREATE TABLE Usuario (
    Id INT PRIMARY KEY,
    Nome VARCHAR(100),
    Email VARCHAR(100)
);

CREATE TABLE Produto (
    Id INT PRIMARY KEY,
    Nome VARCHAR(100),
    Preco DECIMAL(10,2)
);

CREATE TABLE Compra (
    Id INT PRIMARY KEY,
    UsuarioId INT,
    ProdutoId INT,
    DataCompra DATE,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id),
    FOREIGN KEY (ProdutoId) REFERENCES Produto(Id)
);
```

_Observação:_ Use `NOT NULL`, índices e constraints adicionais conforme necessário.

---

## Modelo NoSQL (Banco de Dados Não Relacional)

Este documento descreve a modelagem de dados em um banco NoSQL, adotando a estrutura orientada a documentos do MongoDB, como alternativa funcional ao esquema relacional previamente definido.

---

**Exemplo:**

> **Coleção: `usuarios`**

```json
{
  "_id": ObjectId("644e8f3c9b1d2a001b3e5a7f"),
  "nome": "João da Silva",
  "email": "joao@email.com"
}
```

**Exemplo:**

> **Coleção: `produtos`**

```json
{
  "_id": ObjectId("644e8f6d9b1d2a001b3e5a81"),
  "nome": "Teclado Mecânico",
  "preco": 250.00
}
```

**Exemplo:**

> **Coleção: `compras`**

```json
{
  "_id": ObjectId("644e8f819b1d2a001b3e5a83"),
  "usuario_id": ObjectId("644e8f3c9b1d2a001b3e5a7f"),
  "produto_id": ObjectId("644e8f6d9b1d2a001b3e5a81"),
  "data_compra": "2024-03-15"
}
```

**Exemplo:**

> Com dados embutidos

```json
{
  "_id": ObjectId("644e8f819b1d2a001b3e5a83"),
  "usuario": {
    "_id": ObjectId("644e8f3c9b1d2a001b3e5a7f"),
    "nome": "João da Silva",
    "email": "joao@email.com"
  },
  "produto": {
    "_id": ObjectId("644e8f6d9b1d2a001b3e5a81"),
    "nome": "Teclado Mecânico",
    "preco": 250.00
  },
  "data_compra": "2024-03-15"
}
```

---

## Modelo Físico

O modelo físico será entregue em um arquivo `banco.sql` contendo:

- Criação de tabelas
- Índices
- Constraints de integridade
- Inserts iniciais (opcional)

**Exemplo de organização de arquivos:**

```
src/
└── bd/
    └── banco.sql
```

---

## <img align="left" alt="HTML" title="HTML" width="30px" style="padding-right: 10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" /> Estrutura de Pastas do Projeto

### <img align="left" alt="Node.js" title="Node.js" width="30px" style="padding-right: 10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" /> Backend (Node.js + Express)

| Pasta                        | Descrição                                                                 |
|-----------------------------|--------------------------------------------------------------------------|
| `/backend/src/config/`      | Configurações globais (ex: DB, variáveis de ambiente).                  |
| `/backend/src/controllers/` | Lógica dos endpoints (ex: autenticação, usuários, etc).                 |
| `/backend/src/models/`      | Modelos de dados (ex: schemas usando Mongoose, Sequelize, etc).         |
| `/backend/src/routes/`      | Definição das rotas da API.                                              |
| `/backend/src/middlewares/` | Middlewares (ex: autenticação, logs, erros).                            |
| `/backend/src/services/`    | Lógica de negócio e integração com APIs externas.                       |
| `/backend/src/utils/`       | Funções auxiliares e helpers.                                           |
| `/backend/src/validators/`  | Validação de dados (ex: com Joi, Yup).                                  |
| `/backend/tests/`           | Testes unitários e de integração.                                       |
| `/backend/App.js`         | Ponto de entrada da aplicação.                                          |


---

### <img align="left" alt="React" title="React" width="30px" style="padding-right: 10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" /> Frontend (React)

| Pasta                          | Descrição                                                                  |
|-------------------------------|-----------------------------------------------------------------------------|
| `/frontend/src/components/`   | Componentes reutilizáveis da interface (ex: Botões, Cards, etc).           |
| `/frontend/src/pages/`        | Páginas principais (ex: Home, Login, Dashboard).                           |
| `/frontend/src/services/`     | Comunicação com APIs (via Axios ou Fetch).                                 |
| `/frontend/src/hooks/`        | Custom React Hooks.                                                        |
| `/frontend/src/contexts/`     | Context API para estados globais (ex: autenticação, tema).                 |
| `/frontend/src/assets/`       | Imagens, fontes, ícones, etc.                                              |
| `/frontend/src/utils/`        | Funções auxiliares e utilitárias.                                          |
| `/frontend/public/`           | Arquivos públicos acessados diretamente (ex: `index.html`, favicon).       |
| `/frontend/tests/`            | Testes de componentes ou páginas.                                          |
| `/frontend/styles/`           | Estilos globais (CSS/SCSS, temas, variáveis).                              |

### <img align="left" alt="React" title="React" width="30px" style="padding-right: 10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original-wordmark.svg" /> Mobile (React Native)
| Pasta                             | Descrição                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| `/mobile/src/components/`        | Componentes reutilizáveis (ex: Botões, Inputs, Modal).                   |
| `/mobile/src/screens/`           | Telas principais da aplicação (ex: LoginScreen, HomeScreen).            |
| `/mobile/src/services/`          | Requisições para a API (via Axios ou Fetch).                            |
| `/mobile/src/hooks/`             | Custom Hooks do React Native.                                           |
| `/mobile/src/contexts/`          | Gerenciamento de estados globais (ex: AuthContext).                     |
| `/mobile/src/assets/`            | Imagens, fontes, ícones.                                                |
| `/mobile/src/utils/`             | Funções utilitárias.                                                    |
| `/mobile/src/navigation/`        | Configurações de navegação (ex: React Navigation).                      |
| `/mobile/src/styles/`            | Estilos globais e temas.                                                |
| `/mobile/__tests__/`             | Testes com Jest/React Native Testing Library.                           |
| `/mobile/App.js`                 | Arquivo principal da aplicação.                                         |

---
> - Essa estrutura é uma base recomendada e pode ser adaptada conforme o tamanho e escopo do seu projeto.


## Tecnologias Utilizadas

Liste aqui todas as tecnologias adotadas:

| Categoria      | Tecnologia                           |
| -------------- | ------------------------------------ |
| Linguagem      | Node.js (Express), JavaScript (React + Next.js) |
| Banco de Dados | MongoDB                              |
| Frontend       | React + Next.js                              |
| Mobile       | React Native + Expo                              |
| Backend        | Node.js + Express                 |
| Hospedagem     | Vercel (Frontend) e Azure (Backend)  |
| Ferramentas    | Postman, Docker, VSCode, GitHub      |

**Exemplo de fluxo de interação:**

```mermaid
flowchart LR
    User[Usuário] --> Frontend
    Frontend -->|HTTP Request| Backend
    Backend -->|Query| BancoDeDados
    BancoDeDados -->|Response| Backend
    Backend -->|HTTP Response| Frontend
    Frontend --> User
```

---

## Hospedagem

**Frontend:** hospedado na [Vercel](https://vercel.com/)

**Backend:** hospedado na [Microsoft Azure](https://azure.microsoft.com/)

**Processo de Publicação:**

1. Configurar repositórios no GitHub.
2. Integrar Vercel com repositório do Frontend.
3. Configurar App Service no Azure para o Backend.
4. Definir pipelines de CI/CD.
5. Configurar variáveis de ambiente necessárias.

**Exemplo de variáveis de ambiente:**

- `MONGO_DB_URI`
- `JWT_SECRET`
- `API_URL`

---

## Qualidade de Software

A qualidade é baseada na norma **ISO/IEC 25010**, focando em:

| Característica   | Subcaracterística   | Justificativa                                        |
| ---------------- | ------------------- | ---------------------------------------------------- |
| Funcionalidade   | Acurácia Funcional  | Assegurar que as funções atendam os requisitos.      |
| Confiabilidade   | Tolerância a Falhas | Garantir estabilidade em condições adversas.         |
| Usabilidade      | Acessibilidade      | Tornar a aplicação utilizável por todos os públicos. |
| Eficiência       | Tempo de Resposta   | Minimizar atrasos na resposta ao usuário.            |
| Manutenibilidade | Modificabilidade    | Facilitar futuras correções e melhorias.             |
| Portabilidade    | Adaptabilidade      | Suporte a múltiplas plataformas e navegadores.       |

**Métricas propostas:**

- **Taxa de Erro:** quantidade de erros por semana.
- **Tempo Médio de Resposta:** máximo de 2 segundos para ações críticas.
- **Cobertura de Testes Unitários:** mínimo de 80%.
- **Índice de Acessibilidade (Lighthouse):** mínimo de 90%.

---

> **Observação Final:**  
> Este documento deve ser mantido atualizado conforme a evolução da arquitetura e tecnologias da solução.
