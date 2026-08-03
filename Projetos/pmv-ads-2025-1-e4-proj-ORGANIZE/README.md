# ORGANIZE

`Análise e desenvolvimento de Sistemas`

`Projeto`

`EIXO 4 - 2025/01`

Em um ambiente corporativo, a organização e a gestão eficiente de tarefas são essenciais para o sucesso. Muitas empresas enfrentam desafios relacionados à desorganização e à má gestão de atividades, o que pode comprometer a produtividade e os resultados. Pensando nisso, o OrgaNize foi desenvolvido para oferecer uma solução eficiente, permitindo que equipes organizem, priorizem e acompanhem suas tarefas de forma estruturada, melhorando o fluxo de trabalho e a tomada de decisões.

## Integrantes

* Bernardo Miguel Soutelo Marra
* Bianca Campos Xavier
* Guilherme Brito Fonseca e Silva
* Helbert Miranda Benício
* Jefferson Wagner Silveira e Silva
* Jonatas de Carvalho Brum

## Orientador

* Felipe Augusto Lara Soares

## Instruções de utilização

O OrgaNize possui três aplicações: interface web (`organize`), aplicativo Expo (`organize_mobile`) e API Express (`backend`). É necessário Node.js 20 ou superior e uma conexão MongoDB indicada por `DATABASE_URL` no arquivo `backend/.env`.

Na raiz do repositório completo:

```bash
npm install
npm run organize:api
npm run organize:web
npm run organize:mobile
```

Execute cada aplicação em um terminal. Por padrão, o front-end web usa `http://localhost:3000`; ajuste as URLs da API conforme o ambiente local ou o dispositivo móvel utilizado.

> Os três pacotes pertencem ao workspace da raiz e compartilham a instalação feita por `npm install`. `node_modules`, credenciais, builds e vídeos não são versionados.

# Documentação

<ol>
<li><a href="docs/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="docs/05-Arquitetura da Solução.md"> Arquitetura da Solução</a></li>
<li><a href="docs/06-Template Padrão da Aplicação.md"> Template Padrão da Aplicação</a></li>
<li><a href="docs/07-Programação de Funcionalidades.md"> Programação de Funcionalidades</a></li>
<li><a href="docs/08-Registro de Testes Unitários.md"> Registro de Testes Unitários</a></li>
<li><a href="docs/09-Registro de Testes de Integração.md"> Registro de Testes de Integração</a></li>
<li><a href="docs/10-Registro de Testes de Sistema.md"> Registro de Testes de Sistema</a></li>
<li><a href="docs/11-Registro de Contribuição.md"> Registro de Contribuição</a></li>
<li><a href="docs/12-Apresentação do Projeto.md"> Apresentação do Projeto</a></li>
<li><a href="docs/13-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>
