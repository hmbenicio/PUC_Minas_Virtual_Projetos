# Especificações do Projeto

Definição do problema e ideia de solução a partir da perspectiva do usuário.

## Usuários

| Tipo de Usuário   | Descrição                                     | Responsabilidades                                                                                         |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Administrador** | Gerencia a aplicação e os usuários.           | Gerenciar usuários, configurar o sistema, cadastrar/editar produtos, acessar todos os relatórios.         |
| **Funcionário**   | Usa a aplicação para suas tarefas principais. | Gerenciar estoque, visualizar relatórios operacionais.                                                    |
| **Cliente**       | Usa a aplicação para suas tarefas principais. | Navegar pelos produtos, adicionar ao carrinho, acompanhar pedidos, acessar histórico e solicitar suporte. |

## Arquitetura e Tecnologias

### Visão Geral

O projeto consiste em uma plataforma de catálogo de chinelos Havaianas, essa desenvolvida com uma arquitetura moderna e tecnologias escaláveis, visando alta performance, segurança e uma excelente experiência de usuário.

### Arquitetura

A arquitetura da solução é baseada no modelo cliente-servidor, com uma separação clara de responsabilidades entre o frontend e o backend.

### Frontend

O frontend é responsável pela interface com o usuário, sendo uma aplicação web rica e interativa.

- **Linguagem:** TypeScript (TSX)
- **Framework/Biblioteca:** React com Next.js
- **Principais Funcionalidades:**
  - Interface de usuário dinâmica e responsiva.
  - Renderização no lado do servidor (SSR) e/ou geração de site estático (SSG) para melhor SEO e performance.
  - Comunicação com o backend através de APIs RESTful.

### Backend

O backend é responsável por toda a lógica de negócio, gerenciamento de dados e segurança da aplicação.

- **Linguagem:** TypeScript
- **Framework:** Express.js
- **Banco de Dados:** MongoDB (NoSQL)
- **Autenticação:** JWT (JSON Web Tokens)
- **Gerenciador de Pacotes:** NPM
- **Contêinerização:** Docker
- **Principais Funcionalidades:**
  - Exposição de APIs RESTful para o frontend.
  - Processamento de requisições.
  - Interação com o banco de dados para persistência e consulta de dados.
  - Autenticação e autorização de usuários.

## Diagrama de Componentes

<img width="1536" height="1024" alt="Arquitetura de Plataforma E-commerce" src="https://github.com/user-attachments/assets/640d5f52-0283-40fe-bc31-fd36ccced9f4" />

## Tecnologias Utilizadas

### Frontend

- **React:** Biblioteca JavaScript para a construção de interfaces de usuário.
- **Next.js:** Framework React para produção, com funcionalidades como SSR, SSG, roteamento, entre outras.
- **TypeScript (TSX):** Superset do JavaScript que adiciona tipagem estática ao código, aumentando a robustez e a manutenibilidade.

### Backend

- **Node.js:** Ambiente de execução JavaScript no lado do servidor.
- **Express.js:** Framework minimalista para Node.js, utilizado para a criação de APIs.
- **TypeScript:** Traz os benefícios da tipagem estática para o desenvolvimento backend.
- **MongoDB:** Banco de dados NoSQL orientado a documentos, oferecendo flexibilidade e escalabilidade.
- **JWT (JSON Web Tokens):** Padrão aberto para a criação de tokens de acesso que permitem a autenticação segura de usuários.
- **Docker:** Plataforma para o desenvolvimento, o deploy e a execução de aplicações em contêineres, garantindo a consistência dos ambientes.
- **NPM (Node Package Manager):** Gerenciador de pacotes padrão para o Node.js, utilizado para instalar e gerenciar as dependências do projeto.

## Project Model Canvas

<div align="center"><img width="1848" height="747" alt="image" src="https://github.com/user-attachments/assets/d33fc50c-460c-4f8e-9d20-30bea91f1e9a" /> </div>

> **Links Úteis**:
> [Project Model Canvas - Alfastore](https://app.projectcanvas.online/public-project/LlPt2wfMbXX90723ywJeGghsb7C5Fbtms9+ARRXAJRw=)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

Para mais informações, consulte os microfundamentos Fundamentos de Engenharia de Software e Engenharia de Requisitos de Software.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                                                             | Prioridade |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | Permitir o cadastro de usuários no site                                                                                                            | ALTA       |
| RF-002 | Permitir login dos usuários cadastrados                                                                                                            | ALTA       |
| RF-003 | Permitir a criação de perfis "cliente" e "admin"                                                                                                   | ALTA       |
| RF-004 | Permitir a edição de informações pessoais dos usuários                                                                                             | ALTA       |
| RF-005 | Permitir a exclusão de um usuário do site, restrita tal funcionalidade única e exclusivamente ao(s) administrador(es) ou ao próprio dono do perfil | ALTA       |
| RF-006 | Permitir que o(s) usuário(s) do tipo "admin" possuam acesso e gerenciamento pleno de todos os usuários cadastrados                                 | ALTA       |
| RF-007 | Permitir que o(s) usuário(s) do tipo "admin" realizem o CRUD de produtos no site                                                                   | ALTA       |
| RF-008 | Permitir que o(s) usuário(s) do tipo "admin" tenham acesso ao estoque de produtos no site                                                          | ALTA       |
| RF-009 | Permitir que o(s) usuário(s) possam filtrar produtos de acordo com sua categoria                                                                   | BAIXA      |
| RF-010 | Permitir que o(s) usuário(s) possam ser redirecionados à compra dos produtos com estoque com pagamento via Mercado Pago                            | ALTA       |
| RF-011 | Permitir a adição de promoção aos produtos                                                                                                         | ALTA       |
| RF-012 | Permitir a busca de endereço através do CEP por meio da API ViaCep                                                                                 | MÉDIA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                             | Prioridade |
| ------- | ------------------------------------------------------------------ | ---------- |
| RNF-001 | O sistema deve ser responsivo para rodar em um dispositivos móvel  | MÉDIA      |
| RNF-002 | Deve processar requisições do usuário em no máximo 3s              | BAIXA      |
| RNF-003 | Deve salvar no banco de dados as informações de gestão de estoque  | ALTA       |
| RNF-004 | Deve salvar no banco de dados as informações de gestão de usuarios | ALTA       |

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID  | Restrição                                             | -   |
| --- | ----------------------------------------------------- | --- |
| 01  | O projeto deverá ser entregue até o final do semestre | -   |
| 02  | Não pode ser desenvolvido sem um módulo de backend    | -   |

## Diagrama de Caso de Uso

 <div align="center"><img src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-2-e5-proj-empext-t5-pmv-ads-2025-2-e5-ecommerce-alfastore/blob/main/documentos/img/diagramaCasoUso.png" width="600" title="Diagrama-caso-uso"></div>

## Modelo da Base de Dados (MongoDB)

Atualmente, nossa base de dados possui uma única coleção principal: `users`. Esta coleção armazena todas as informações relacionadas aos usuários da plataforma, incluindo dados pessoais, credenciais e permissões.

### Coleção: `users`

| Campo                      | Tipo de Dado | Obrigatório | Index    | Descrição                                                                                 |
| :------------------------- | :----------- | :---------- | :------- | :---------------------------------------------------------------------------------------- |
| `_id`                      | ObjectId     | Sim (auto)  | `unique` | Identificador único do documento, gerado automaticamente pelo MongoDB.                    |
| `nome`                     | String       | Sim         | -        | Nome completo do usuário.                                                                 |
| `email`                    | String       | Sim         | `unique` | E-mail do usuário. Utilizado para login e deve ser único.                                 |
| `cpf`                      | String       | Sim         | `unique` | CPF do usuário. Deve ser único.                                                           |
| `endereco`                 | Object       | Sim         | -        | Objeto aninhado contendo os detalhes do endereço do usuário.                              |
| ` ➞ rua`                   | String       | Sim         | -        | Nome da rua.                                                                              |
| ` ➞ numero`                | String       | Sim         | -        | Número do imóvel.                                                                         |
| ` ➞ cidade`                | String       | Sim         | -        | Cidade do endereço.                                                                       |
| ` ➞ estado`                | String       | Sim         | -        | Sigla do estado (ex: "MG").                                                               |
| ` ➞ cep`                   | String       | Sim         | -        | CEP do endereço.                                                                          |
| `telefone`                 | String       | Sim         | -        | Número de telefone com DDD.                                                               |
| `senha`                    | String       | Sim         | -        | Hash da senha do usuário (armazenada com Bcrypt, nunca em texto plano).                   |
| `role`                     | String       | Sim         | -        | Nível de acesso do usuário. Aceita os valores `cliente` ou `admin`. O padrão é `cliente`. |
| `consentimentoDados`       | Object       | Sim         | -        | Objeto aninhado que armazena o consentimento do usuário com os termos.                    |
| ` ➞ termosDeUso`           | Boolean      | Sim         | -        | Confirmação de aceite dos Termos de Uso.                                                  |
| ` ➞ politicaDePrivacidade` | Boolean      | Sim         | -        | Confirmação de aceite da Política de Privacidade.                                         |
| ` ➞ dataConsentimento`     | Date         | Sim         | -        | Data e hora em que o consentimento foi dado.                                              |
| `createdAt`                | Timestamp    | Sim (auto)  | -        | Data e hora de criação do documento, gerenciado automaticamente pelo Mongoose.            |
| `updatedAt`                | Timestamp    | Sim (auto)  | -        | Data e hora da última atualização do documento, gerenciado pelo Mongoose.                 |

---

### Exemplo de Documento na Coleção `users`

Abaixo está um exemplo de como um documento de usuário é armazenado no MongoDB, ilustrando a estrutura definida acima.

```json
{
  "_id": ObjectId("60d5ecb1e7f3c6a4b8fbe9a1"),
  "nome": "Jafe Admin",
  "email": "Jafe@teste.com",
  "cpf": "123.456.789-10",
  "endereco": {
    "rua": "Rua do Teste",
    "numero": "123",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "cep": "31200-000"
  },
  "telefone": "31999998888",
  "senha": "$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345",
  "role": "admin",
  "consentimentoDados": {
    "termosDeUso": true,
    "politicaDePrivacidade": true,
    "dataConsentimento": ISODate("2025-09-02T18:30:00.000Z")
  },
  "createdAt": ISODate("2025-09-02T18:30:00.000Z"),
  "updatedAt": ISODate("2025-09-02T18:45:15.000Z")
}
```
