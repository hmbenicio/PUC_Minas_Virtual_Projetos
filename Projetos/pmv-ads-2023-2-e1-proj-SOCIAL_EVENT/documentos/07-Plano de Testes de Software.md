# Plano de Testes de Software

Os testes funcionais a serem realizados na aplicação são descritos a seguir.

|Caso de Teste    | CT-1 - Cadastro e Login de usuário |
|:---|:---|
| Requisitos Associados | RF-01 - Permitir que o usuário faça cadastro no sistema e RF-02 - Permitir que o usuário faça login e logout no sistema.|
| Objetivo do Teste | Verificar se o cadastro do usuário e o login está sendo feito corretamente no sistema. |
| Passos | 1º - Acessar o navegador > 2° - Preencher os dados de "Nome", "E-mail" e "Senha" > 3º - Clicar em "INSCREVER-SE" > 4º - Preencher os dados de "E-mail" e "Senha" > 5º Clicar em "ENTRAR". |
| Critérios de êxito | Deve ocorrer uma validação das informações fornecidas pelo usuário, e ao clicar em "INSCREVER-SE", deve aparecer a mensagem "Cadastro com sucesso". > Após o cadastro do usuário no sistema, deverá ocorrer uma transição para área de "Login", onde ao logar, direcionará para tela de Página Inicial.|
| Responsável pela elaborar do caso de Teste | Helbert Miranda Benício |
 
|Caso de Teste    | CT-2 - Verificar o funcionamento da página Home e da busca dos eventos e tarefas, juntamente a visualização dos detalhes de ambos|
|:---|:---|
| Requisitos Associados | RF-05 - Permitir que o usuário pesquise eventos/tarefas cadastradas, RF-12 - Permitir que o convidado visualize os detalhes do evento, RNF-02 - Usabilidade do Sistema e RNF-03: Compatibilidade com Navegadores |
| Objetivo do Teste | Verificar se o cadastro do usuário e o login está sendo feito corretamente no sistema. |
| Passos | 1- Inserir termos de pesquisa. 2- Clicar no botão de pesquisa. |
| Critérios de êxito |  Uma lista de eventos/tarefas relevantes é exibida, logo ao clicar em um evento redirecionar-se as páginas das pesquisas, com seus detalhes relevantes|
| Critérios de erro |  O evento não será encontrado e apresentará uma mensagem informando ao usuário, e não exibirá as informações|
| Responsável pela elaborar do caso de Teste | Jefferson Wagner Silveira e Silva |

|Caso de Teste    | CT-3 - Listagem e remoção de tarefas |
|:---|:---|
| Requisitos Associados | RF-11 - Permitir que o administrador exclua tarefas e RF-10 - Permitir que o fornecedor de serviços visualize suas tarefas.  |
| Objetivo do Teste | Verificar a tarefa e exluir do sistema. |
| Passos | 1- Clicar em tarefas. 2- Clicar no botão de remover. |
| Critérios de êxito | Visualizar as tarefas e permitir excluí-las.|
| Critérios de erro | A tarefa não é removida ou a lista não aparece.|
| Responsável pela elaborar do caso de Teste | Aldrin Taylor C. Bittencourt |

|Caso de Teste    | CT-4 - Listagem e remoção de eventos |
|:---|:---|
| Requisitos Associados | RF-06 - Permitir que o usuário administrador exclua eventos e RF-14 - Permitir que o administrador/fornecedor visualize seus eventos.  |
| Objetivo do Teste | Verificar o evento e exluir do sistema. |
| Passos | 1- Cliar eventos. 2- Clicar no botão de remover. |
| Critérios de êxito | Visualizar os eventos e permitir excluí-los.|
| Critérios de erro |  O evento não é removido ou a lista não aparece.|
| Responsável pela elaborar do caso de Teste | Aldrin Taylor C. Bittencourt |

|Caso de Teste    | CT-5 - Cadastro de eventos |
|:---|:---|
| Requisitos Associados | RF-03 - Permitir que o usuário administrador cadastre eventos.  |
| Objetivo do Teste | Verificar o cadastro dos eventos do usuário no sistema. |
| Passos | 1- Clicar em eventos. 2- Adicionar. 3- Preencher o formulário. 4- Clicar em confirmar. |
| Critérios de êxito | Permitir que o usuário cadastre os eventos|
| Critérios de erro |  O evento não é cadastrado.|
| Responsável pela elaborar do caso de Teste | Julia Berto Rosa |

|Caso de Teste    | CT-6 - Cadastro da tarefas |
|:---|:---|
| Requisitos Associados | RF-15 - Permitir que o usuário administrador cadastre tarefas.  |
| Objetivo do Teste | Verificar o cadastro das tarefas do usuário no sistema. |
| Passos | 1- Clicar em tarefas. 2- Adicionar. 3- Preencher o formulário. 4- Clicar em confirmar. |
| Critérios de êxito | Permitir que o usuário cadastre as tarefas|
| Critérios de erro |  A tarefa não é cadastrada.|
| Responsável pela elaborar do caso de Teste | Julia Berto Rosa |
