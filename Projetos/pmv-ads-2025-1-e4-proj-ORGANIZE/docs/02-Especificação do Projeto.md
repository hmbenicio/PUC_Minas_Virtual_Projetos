# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

O projeto foi desenvolvido com foco em proporcionar uma gestão eficiente de tarefas para empresas, equipes e profissionais individuais. Suas especificações incluem uma interface intuitiva, recursos de organização de atividades, atribuição de responsabilidades, acompanhamento de prazos e geração de relatórios.

## Personas

#### João, 40 anos, Gerente de Projetos

![Personas](img/img_doc02/Person_Joao_Gerente.png)

- João tem 40 anos, é Gerente de Projetos e enfrenta dificuldades para acompanhar o progresso das tarefas de sua equipe. Para otimizar a gestão e garantir a entrega eficiente dos projetos, busca um painel centralizado que facilite o monitoramento de prazos e a comunicação entre os membros da equipe, permitindo maior controle e previsibilidade sobre as entregas.

#### Mariana, 30 anos, Analista de Marketing

![Personas](img/img_doc02/Person_Mariana_Marketing.png)

- Mariana tem 30 anos, é Analista de Marketing e enfrenta problemas de comunicação e retrabalho em suas atividades diárias. Para aumentar sua produtividade, busca uma ferramenta intuitiva que ajude a organizar suas tarefas, melhorar a colaboração com a equipe e reduzir erros operacionais.

#### Lucas, 25 anos, Desenvolvedor

![Personas](img/img_doc02/Person_Lucas_Dev.png)

- Lucas tem 25 anos, é Desenvolvedor e frequentemente recebe tarefas com informações insuficientes, o que impacta sua eficiência. Para otimizar seu trabalho e contribuir para o crescimento da empresa, precisa de um sistema que facilite a atribuição e o detalhamento das demandas, garantindo mais clareza e agilidade na execução dos projetos.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

| EU COMO... `PERSONA`          | QUERO/PRECISO ... `FUNCIONALIDADE`                                                                              | PARA ... `MOTIVO/VALOR`                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Eu como Gerente de projetos   | Quero monitorar e avaliar o andamento das tarefas relacionadas aos meus projetos (RF-008, RF-010)               | Para tomar decisões assertivas para atingir a meta estabelecida. |
| Eu como Analista de marketing | Quero organizar minhas tarefas diárias, respeitando prioridades e prazos estabelecidos (RF-005, RF-006, RF-009) | Para maximizar minha eficiência.                                 |
| Eu como Desenvolvedor         | Quero ter fácil e claro acesso às minhas demandas diárias (RF-008, RF-009)                                      | Para gerar os artefatos que me foram atribuídos.                 |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                       | Prioridade | Responsável |
| ------ | -------------------------------------------------------------------------------------------- | ---------- | ----------- |
| RF-001 | Permitir que os usuários criem uma conta na plataforma.                                      | ALTA       | Guilherme   |
| RF-002 | Permitir a autenticação dos usuários na plataforma via e-mail e senha.                       | ALTA       | Helbert     |
| RF-003 | Permitir que os usuários façam logout na plataforma.                                         | ALTA       | Helbert     |
| RF-004 | Permitir a redefinição de senha dos usuários na plataforma.                                  | ALTA       | Jonatas     |
| RF-005 | Permitir o cadastro de equipes de usuários na plataforma.                                    | ALTA       | Guilherme   |
| RF-006 | Permitir a criação de tarefas e atribuição de equipe e prioridade das tarefas na plataforma. | ALTA       | Guilherme   |
| RF-007 | Permitir a visualização das tarefas criadas na plataforma.                                   | MÉDIA      | Bernardo    |
| RF-008 | Permitir a alteração de status das tarefas criadas na plataforma.                            | MÉDIA      | Bernardo    |
| RF-009 | Permitir a exclusão de tarefas criadas na plataforma.                                        | MÉDIA      | Bernardo    |
| RF-010 | Permitir a filtragem por status ou data de entraga das tarefas criadas na plataforma.        | MÉDIA      | Bianca      |
| RF-011 | Permitir a atribuição e edição das tarefas na plataforma.                                    | MÉDIA      | Bianca      |
| RF-012 | Permitir a visualização das equipes criadas na plataforma.                                   | MÉDIA      | Jefferson   |
| RF-013 | Permitir a adição de integrantes à equipes criadas na plataforma.                            | ALTA       | Jefferson   |
| RF-014 | Permitir a exclusão das equipes criadas na plataforma.                                       | ALTA       | Jefferson   |
| RF-015 | Permitir a geração, visualização e atualização do relatório de tarefas dentro da plataforma. | BAIXA      | Helbert     |
| RF-016 | Permitir a atualização do perfil de usuário dentro da plataforma.                            | BAIXA      | Jonatas     |
| RF-017 | Permitir a configuração do sistema.                                                          | ALTA       | Jonatas     |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                                                                                                                 | Prioridade |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| RNF-001 | Interface responsiva para acesso em dispositivos móveis.                                                                                               | ALTA       |
| RNF-002 | Alta disponibilidade para acesso ininterrupto ao sistema.                                                                                              | ALTA       |
| RNF-003 | Armazenação segura de dados e logs de atividade.                                                                                                       | ALTA       |
| RNF-004 | Cumprimento de padrões de segurança e LGPD.                                                                                                            | ALTA       |
| RNF-005 | A plataforma deve ser capaz de lidar com um aumento no número de usuários sem comprometer o desempenho.                                                | MÉDIA      |
| RNF-006 | A plataforma deve ser fácil de manter e atualizar, permitindo a adição de novos recursos e correções de bugs sem interrupção significativa no serviço. | MÉDIA      |
| RNF-007 | Tempo de resposta rápido para interações usuário-sistema (estimativa de 3 segundos)                                                                    | MÉDIA      |

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID  | Restrição                                                                    |
| --- | ---------------------------------------------------------------------------- |
| 01  | O projeto deverá ser entregue até o final do semestre.                       |
| 02  | Deverá ser um sistema distribuído.                                           |
| 03  | Deverá ser desenvolvido um módulo Front-end e um Back-end.                   |
| 04  | A equipe não pode subcontratar o desenvolvimento do trabalho.                |
| 05  | Todos os membros do grupo devem ser responsáveis por cada parte do Trabalho. |
| 06  | O sistema deverá ser desenvolvido para plataformas Web e Mobile.             |

## Diagrama de Casos de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos.

![Diagrama de Casos de Uso](img/img_doc02/DiagramaCasosUso.png)

# Gerenciamento de Projeto

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo

![Gráfico](img/Cronograma.png)

## Gerenciamento de Equipe

![Simple Project Timeline](img/Cronogramaequipe.png)
