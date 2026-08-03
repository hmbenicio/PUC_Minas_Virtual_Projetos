# Plano de Testes de Software

Pré-requisitos: [Especificação do Projeto](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/02-Especifica%C3%A7%C3%A3o%20do%20Projeto.md), [Projeto de Interface](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/04-Projeto%20de%20Interface.md).

Apresente os cenários de testes utilizados na realização dos testes da sua aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos.

Enumere quais cenários de testes foram selecionados para teste. Neste tópico o grupo deve detalhar quais funcionalidades avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

Os testes funcionais a serem realizados na aplicação são descritos a seguir.

| Caso de Teste         | CT-01 - Cadastro de usuário                                                                                                                                                                                                                                             |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requisitos Associados | RF-001 - Permitir que os clientes se registrem com suas informações pessoais (tipo de usuário, nome, contato, e-mail e senha).                                                                                                                                          |
| Grupo de Teste        | Usuário comum.                                                                                                                                                                                                                                                          |
| Objetivo do Teste     | Verificar se o cadastro do usuário está sendo feito corretamente no sistema.                                                                                                                                                                                            |
| Passos                | 1º - Acessar a tela de Login > 2° - Clicar em "CRIAR CONTA"> 3º - Preencher os dados do usuário > 4º - Clicar em "Criar conta".                                                                                                                                         |
| Critérios de êxito    | Deverá ocorrer uma validação das informações fornecidas pelo usuário e a mensagem "Credenciais criadas com sucesso!". Após o cadastro do usuário no sistema, deverá ocorrer uma transição para área de "Login", onde ao logar, direcionará para tela de Página Inicial. |

| Caso de Teste         | CT-02 - Login de usuário                                                                                                   |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| Requisitos Associados | RF-003 - Permitir a autenticação de clientes e barbeiros com login via e-mail/senha.                                       |
| Grupo de Teste        | Usuário comum.                                                                                                             |
| Objetivo do Teste     | Verificar se o login está sendo feito corretamente no sistema.                                                             |
| Passos                | 1º - Acessar a tela de Login > 2º - Preencher os dados de Login e Senha > 3º - Clicar em "ACESSAR".                        |
| Critérios de êxito    | Deverá ocorrer uma validação das informações fornecidas pelo usuário e uma transição para a tela de Página Inicial.        |
| Critérios de erro     | Deve ocorrer uma validação das informações fornecidas pelo usuário e a mensagem "Credenciais invalidas. Tente novamente.". |

| Caso de Teste         | CT-03 - Redefinição de Senha                                                                                                                                                                                                     |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requisitos Associados | RF-006 - Permitir que os usuários redefinam a senha.                                                                                                                                                                             |
| Grupo de Teste        | Usuário comum.                                                                                                                                                                                                                   |
| Objetivo do Teste     | Verificar se redefinição de senha está sendo feita corretamente no sistema.                                                                                                                                                      |
| Passos                | 1º - Acessar a tela de Login > 2° - Clicar em "Esqueceu a senha?"> 3º - Preencher os dados do usuário > 4º - Clicar em "Redefinir senha".                                                                                        |
| Critérios de êxito    | Deve ocorrer uma validação das informações fornecidas pelo usuário através do e-mail fornecido e através dele, a redefinição poderá ser feita. > Após a redefinição da senha, deverá ocorrer uma transição para área de "Login". |

| Caso de Teste         | CT-04 - logout de usuário                                                                                                                                                          |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requisitos Associados | RF-010 - Permitir que os usuários façam logout no sistema.                                                                                                                         |
| Grupo de Teste        | Usuário comum.                                                                                                                                                                     |
| Objetivo do Teste     | Verificar se o logout está sendo feito corretamente no sistema.                                                                                                                    |
| Passos                | 1º - Acessar a tela home > 2° - Clicar no ícone de logout.                                                                                                                         |
| Critérios de êxito    | Deve ocorrer uma validação das informações de logout, em seguida a mensagem "Você desconectou-se do sistema!". > Após o logout, deverá ocorrer uma transição para área de "Login". |

## Ferramentas de Testes (Opcional)

#### Ferramentas de testes utilizadas:

- Expo Go: Um sandbox que permite que você experimente rapidamente a construção de aplicativos nativos para Android e iOS.
- Firebase: O Firebase Realtime Database é um banco de dados hospedado na nuvem. Os dados são armazenados como JSON e sincronizados em tempo real para cada cliente conectado. Quando você cria apps multiplataforma com nossos SDKs para plataformas Apple, Android e JavaScript, todos os seus clientes compartilham uma instância do Realtime Database e recebem automaticamente atualizações com os dados mais recentes.

<!-- > **Links Úteis**:
>
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e Técnicas de Testes Ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> - [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e Geração de Planos de Teste de Software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7) -->
