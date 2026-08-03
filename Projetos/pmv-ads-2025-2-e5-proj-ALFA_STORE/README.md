# Plataforma de catálogo digital - Alfa Havaianas

# `Análise e Desenvolvimento de Sistemas`

`Projeto: Desenvolvimento de um Sistema Sociotécnico Inovador -  Eixo 5`

`5° semestre`

O presente trabalho aborda o desenvolvimento de um mostruário digital e customizado para a empresa Alfa Havaianas, com o objetivo de promover a modernização e a transformação digital de suas operações comerciais.

A solução tecnológica proposta visa substituir os processos operacionais, atualmente manuais, por um sistema de informação integrado. Este sistema será responsável por centralizar o cadastro de clientes, gerenciar o ciclo de vida dos produtos e realizar o controle acurado do inventário, considerando a granularidade dos produtos, como modelos, cores e tamanhos.

## Integrantes

* Bernardo Miguel Soutelo Marra
* Guilherme Brito Fonseca e Silva
* Helbert Miranda Benício
* Jefferson Wagner Silveira e Silva
* Jonatas de Carvalho Brum

## Orientador

* Humberto Azevedo Nigri do Carmo

## Instruções de utilização

A Alfa Store é composta pelo front-end Next.js em `frontend` e pela API Express/TypeScript em `backend`. É necessário Node.js 20 ou superior, MongoDB e as credenciais dos serviços externos usados pela aplicação.

Na raiz do repositório completo:

```bash
npm install
Copy-Item Projetos/pmv-ads-2025-2-e5-proj-ALFA_STORE/backend/.env.example Projetos/pmv-ads-2025-2-e5-proj-ALFA_STORE/backend/.env
npm run alfa:api
npm run alfa:web
```

Preencha o novo `.env` antes de iniciar a API. Em Linux ou macOS, substitua `Copy-Item` por `cp`. O front-end fica disponível em `http://localhost:3000` e a API usa a porta definida no ambiente.

> Front-end e API pertencem ao workspace da raiz. Dependências são instaladas centralmente; `node_modules`, arquivos `.env`, builds e vídeos de evidência permanecem fora do Git.

# Documentação

<ol>
<li><a href="documentos/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="documentos/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="documentos/03-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="documentos/04-Testes de Software/"> Testes de Software</a></li>
<li><a href="documentos/05-Implantação.md"> Implantação</a></li>
</ol>

# Código

<li><a href="codigo-fonte/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="apresentacao/README.md"> Apresentação da solução</a></li>
