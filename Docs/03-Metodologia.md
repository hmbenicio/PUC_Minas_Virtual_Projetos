# Metodologia

> **Pré-requisitos**: Consulte a <a href="02-Especificação do Projeto.md"> Especificação do Projeto</a> para obter informações adicionais sobre os requisitos e contexto do projeto.

Este documento descreve a metodologia adotada pelo time para desenvolver a solução proposta. Inclui detalhes sobre os ambientes de trabalho, o controle de versão, a gestão do código fonte, as práticas ágeis de organização do time e as ferramentas utilizadas durante o ciclo de vida do desenvolvimento.

## Ambientes de Trabalho

O projeto será desenvolvido em uma série de plataformas e ambientes distintos, cada um com um propósito específico. A tabela abaixo lista os ambientes utilizados, suas plataformas correspondentes e links de acesso:

| Ambiente             | Plataforma                | Link de Acesso                               |
|----------------------|---------------------------|---------------------------------------------|
| **Ambiente de Dev**   | Local (VSCode, Docker)     | [Link](#)                                   |
| **Ambiente de Testes**| GitHub Actions / Docker    | [Link](#)                                   |
| **Ambiente de Produção** | AWS / EC2                 | [Link](#)                                   |

> **Observação**: A definição dos ambientes inclui tanto a infraestrutura para a execução da aplicação quanto as plataformas específicas para o desenvolvimento de soluções móveis.

## Controle de Versão

A ferramenta de controle de versão adotada para este projeto é o **Git**, com hospedagem no **GitHub**. O fluxo de trabalho segue as convenções Git Flow, garantindo uma organização clara no processo de desenvolvimento.

### Convenções de Branches

- **`main`**: Branch principal contendo a versão estável do software.
- **`unstable`**: Branch para versões testadas, porém instáveis, com funcionalidades em desenvolvimento.
- **`testing`**: Branch utilizada para testes contínuos, com versões de features específicas em análise.
- **`dev`**: Branch de desenvolvimento ativo, com as últimas alterações implementadas.

### Gestão de Issues

Para organizar as tarefas e os problemas, o projeto adota as seguintes etiquetas no GitHub:

- **`documentation`**: Refere-se a melhorias ou atualizações na documentação do projeto.
- **`bug`**: Indica problemas ou falhas nas funcionalidades.
- **`enhancement`**: Utilizado para identificar melhorias em funcionalidades existentes.
- **`feature`**: Usado para a introdução de novas funcionalidades no sistema.

### Fluxo de Trabalho

A gerência de tags, merges, commits e branches segue as melhores práticas de versionamento, utilizando o Git Flow para facilitar o controle de versões e a integração contínua. O uso de pull requests (PRs) para integração de novas features e correções, com revisões de código periódicas, assegura a qualidade do software.

## Gerenciamento de Projeto

### Divisão de Papéis

Para garantir um desenvolvimento ágil e eficiente, o time foi estruturado com base na metodologia **Scrum**. Os papéis definidos para o projeto são:

- **Scrum Master**: Felipe Domingos
- **Product Owner**: Rommel Carneiro
- **Equipe de Desenvolvimento**: Pedro Penna, Pedro Ivo, Rodrigo Richard
- **Equipe de Design**: Simone Nogueira

### Processo de Desenvolvimento

A equipe segue um processo ágil utilizando **Scrum** para gerenciar o fluxo de trabalho. A cada **Sprint**, são realizadas as seguintes etapas:

1. **Planejamento**: Definição das tarefas e metas da Sprint.
2. **Execução**: Desenvolvimento das funcionalidades com acompanhamento constante.
3. **Revisão**: Avaliação do progresso, ajustes e refinamento de processos.
4. **Retrospectiva**: Análise do desempenho da equipe e identificação de melhorias para o próximo ciclo.

A plataforma **GitHub** será utilizada para o acompanhamento de tarefas e gestão do fluxo de trabalho, através de quadros de projeto e issues.

### Ferramentas Utilizadas

A seguir estão as ferramentas adotadas para o desenvolvimento do projeto, que foram escolhidas com base na integração com o processo de versionamento e nas necessidades específicas da equipe:

- **Editor de Código**: VSCode, pela sua integração com Git e suporte a várias extensões.
- **Ferramentas de Comunicação**: 
  - **Slack**: Para comunicação interna e organização de mensagens por canais temáticos.
  - **GitHub**: Para gerenciamento de tarefas, controle de versão e colaboração de código.
- **Ferramentas de Design e Wireframing**:
  - **Figma**: Para criação de wireframes e protótipos interativos.
  - **Lucidchart**: Para elaboração de diagramas de fluxo e arquitetura do sistema.

Essas ferramentas garantem uma colaboração eficiente entre as equipes e ajudam a manter o projeto organizado e alinhado com as práticas ágeis.
