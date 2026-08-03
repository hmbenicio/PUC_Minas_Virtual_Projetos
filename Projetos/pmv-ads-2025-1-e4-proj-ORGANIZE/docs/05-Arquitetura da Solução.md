# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![Blank diagram](https://github.com/user-attachments/assets/9bad1671-77d9-4676-ad82-7f8063a08078)

Web: Feito em JS com o framework React
Mobile: Feito em JS com o framework React Native
Gateway: Hospedado na Azure
Backend: Conatainer docker hospedado no dockerhub feito com JS e framework Node Express
Banco de dados: NoSql feito com mongoDb e hospedado no servidor nativo Atlas


## Diagrama de Classes

O diagrama de classes ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

![organiZe_UML](https://github.com/user-attachments/assets/002b5c3d-bcd1-4a47-8867-54e63b024395)


## Documentação do Banco de Dados MongoDB

Este documento descreve a estrutura e o esquema do banco de dados não relacional utilizado por nosso projeto, baseado em MongoDB. O MongoDB é um banco de dados NoSQL que armazena dados em documentos JSON (ou BSON, internamente), permitindo uma estrutura flexível e escalável para armazenar e consultar dados.

## Esquema do Banco de Dados
### Coleção: users
Armazena as informações dos usuários do sistema.

Estrutura do Documento

```Json
{
  "_id": "objectId('65f1b2f9b2a4f1ac9c38b9a1')",
  "name": "Alice Silva",
  "email": "alice.silva@example.com",
  "passwordHash": "hash_da_senha",
  "createdAt": "2024-03-17T12:00:00Z",
  "updatedAt": "2024-03-17T12:00:00Z"
}
```

#### Descrição dos Campos
> - <strong>_id:</strong> Identificador único do usuário gerado automaticamente pelo MongoDB.
> - <strong>name:</strong> Nome completo do usuário.
> - <strong>email:</strong> Endereço de email do usuário.
> - <strong>password:</strong> Hash da senha do usuário.
> - <strong>createdAt:</strong> Data e hora de criação do usuário.
> - <strong>updatedAt:</strong> Data e hora da última atualização dos dados do usuário.

### Coleção: tasks
Armazena as informações das tarefas criadas pelos usuários.

```Json
{
  "_id": "objectId('65f1b3f9b2a4f1ac9c38b9a2')",
  "title": "Finalizar relatório",
  "description": "Relatório mensal de desempenho",
  "status": "pendente",
  "dueDate": "2024-03-20T18:00:00Z",
  "createdBy": "objectId('65f1b2f9b2a4f1ac9c38b9a1')",
  "assignedTo": "objectId('65f1b2f9b2a4f1ac9c38b9a3')",
  "taskGroup": "objectId('65f1b4f9b2a4f1ac9c38b9a4')",
  "createdAt": "2024-03-17T12:30:00Z"
}
```

#### Descrição dos Campos
> - <strong>_id:</strong> Identificador único da tarefa gerado pelo MongoDB.
> - <strong>title:</strong> Título da tarefa.
> - <strong>description:</strong> Descrição detalhada da tarefa.
> - <strong>status:</strong> Estado atual da tarefa (exemplo: "pendente", "em andamento", "concluída").
> - <strong>dueDate:</strong> Data e hora limite para conclusão da tarefa.
> - <strong>createdBy:</strong> ID do usuário que criou a tarefa.
> - <strong>assignedTo:</strong> ID do usuário responsável pela tarefa.
> - <strong>taskGroup:</strong> ID do grupo ao qual a tarefa pertence (caso esteja dentro de um grupo).
> - <strong>createdAt:</strong> Data e hora de criação da tarefa.

### Coleção: taskGroups
Armazena as informações dos grupos de tarefas e seus membros.

Estrutura do Documento

```Json
{
  "_id": "objectId('65f1b4f9b2a4f1ac9c38b9a4')",
  "name": "Projeto X",
  "description": "Grupo de tarefas do Projeto X",
  "createdBy": "objectId('65f1b2f9b2a4f1ac9c38b9a1')",
  "tasks": [
    "objectId('65f1b3f9b2a4f1ac9c38b9a2')"
  ],
  "createdAt": "2024-03-17T12:45:00Z"
}
```

#### Descrição dos Campos
> - <strong>_id:</strong> Identificador único do grupo de tarefas gerado pelo MongoDB.
> - <strong>name:</strong> Nome do grupo de tarefas.
> - <strong>description:</strong> Descrição do grupo.
> - <strong>createdBy:</strong> ID do usuário que criou o grupo.
> - <strong>tasks:</strong> Lista de IDs das tarefas associadas ao grupo.
> - <strong>createdAt:</strong> Data e hora de criação do grupo.

### Coleção: taskGroupMembers
Armazena a relação entre usuários e grupos de tarefas, incluindo suas permissões.

Estrutura do Documento

```Json
{
  "_id": "objectId('65f1b5f9b2a4f1ac9c38b9a5')",
  "user": "objectId('65f1b2f9b2a4f1ac9c38b9a1')",
  "taskGroup": "objectId('65f1b4f9b2a4f1ac9c38b9a4')",
  "role": "admin",
  "addedAt": "2024-03-17T13:00:00Z"
}
```

#### Descrição dos Campos
> - <strong>_id:</strong> Identificador único do relacionamento entre usuário e grupo.
> - <strong>user:</strong> ID do usuário que faz parte do grupo.
> - <strong>taskGroup:</strong> ID do grupo de tarefas ao qual o usuário pertence.
> - <strong>role:</strong> Nível de permissão do usuário dentro do grupo (admin, editor, viewer).
> - <strong>addedAt:</strong> Data e hora em que o usuário foi adicionado ao grupo.


<!-- ### Boas Práticas

Validação de Dados: Implementar validação de esquema e restrições na aplicação para garantir a consistência dos dados.

Monitoramento e Logs: Utilize ferramentas de monitoramento e logging para acompanhar a saúde do banco de dados e diagnosticar problemas.

Escalabilidade: Considere estratégias de sharding e replicação para lidar com crescimento do banco de dados e alta disponibilidade.

### Material de Apoio da Etapa

Na etapa 2, em máterial de apoio, estão disponíveis vídeos com a configuração do mongo.db e a utilização com Bson no C#


## Modelo ER (Somente se tiver mais de um banco e outro for relacional)

O Modelo ER representa através de um diagrama como as entidades (coisas, objetos) se relacionam entre si na aplicação interativa.

As referências abaixo irão auxiliá-lo na geração do artefato “Modelo ER”.

> - [Como fazer um diagrama entidade relacionamento | Lucidchart](https://www.lucidchart.com/pages/pt/como-fazer-um-diagrama-entidade-relacionamento)

## Esquema Relacional (Somente se tiver mais de um banco e outro for relacional)

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.
 
As referências abaixo irão auxiliá-lo na geração do artefato “Esquema Relacional”.

> - [Criando um modelo relacional - Documentação da IBM](https://www.ibm.com/docs/pt-br/cognos-analytics/10.2.2?topic=designer-creating-relational-model)

## Modelo Físico (Somente se tiver mais de um banco e outro for relacional)

Entregar um arquivo banco.sql contendo os scripts de criação das tabelas do banco de dados. Este arquivo deverá ser incluído dentro da pasta src\bd. -->

## Tecnologias Utilizadas

> - <strong>Web:</strong> Desenvolvido em React + NextJS no VisualStudioCode
> - <strong>Mobile:</strong> Desenvolvido em React Native no VisualStudioCode
> - <strong>Backend:</strong> Desenvolvido com NodeJS + Express no VisualStudioCode
> - <strong>Container:</strong> Docker registrado no Docker Hub
> - <strong>Hospedagem e Compute Service:</strong> Azure (WebApp, BlobStorage)
> - <strong>Banco de dados:</strong> mongodb

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)

## Qualidade de Software

Conceituar qualidade de fato é uma tarefa complexa, mas ela pode ser vista como um método gerencial que através de procedimentos disseminados por toda a organização, busca garantir um produto final que satisfaça às expectativas dos stakeholders.

No contexto de desenvolvimento de software, qualidade pode ser entendida como um conjunto de características a serem satisfeitas, de modo que o produto de software atenda às necessidades de seus usuários. Entretanto, tal nível de satisfação nem sempre é alcançado de forma espontânea, devendo ser continuamente construído. Assim, a qualidade do produto depende fortemente do seu respectivo processo de desenvolvimento.

A norma internacional ISO/IEC 25010, que é uma atualização da ISO/IEC 9126, define oito características e 30 subcaracterísticas de qualidade para produtos de software.
Com base nessas características e nas respectivas sub-características, identifique as sub-características que sua equipe utilizará como base para nortear o desenvolvimento do projeto de software considerando-se alguns aspectos simples de qualidade. Justifique as subcaracterísticas escolhidas pelo time e elenque as métricas que permitirão a equipe avaliar os objetos de interesse.

> **Links Úteis**:
>
> - [ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models](https://www.iso.org/standard/35733.html/)
> - [Análise sobre a ISO 9126 – NBR 13596](https://www.tiespecialistas.com.br/analise-sobre-iso-9126-nbr-13596/)
> - [Qualidade de Software - Engenharia de Software 29](https://www.devmedia.com.br/qualidade-de-software-engenharia-de-software-29/18209/)
