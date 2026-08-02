# Plano de Testes de Software

> **Pré-requisitos:**  
> Consulte os documentos relacionados antes de prosseguir: <a href="02-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="04-Projeto de Interface.md"> Projeto de Interface</a>.

Este documento apresenta os cenários de testes que serão utilizados na validação da aplicação. O objetivo é demonstrar como os requisitos estão sendo atendidos por meio dos testes realizados.

**Instruções**:
1. Enumere os casos de teste de forma sequencial.
2. Certifique-se de que os requisitos associados a cada caso de teste estão corretamente descritos, conforme a seção "2 - Especificação do Projeto".

Exemplo de estrutura para os casos de teste:

### Caso de Teste 01 – Cadastrar Perfil

| **Campo**                | **Descrição**                                                                                           |
|:-------------------------|:-------------------------------------------------------------------------------------------------------|
| **Requisito Associado**   | RF-00X - A aplicação deve apresentar, na página principal, a funcionalidade de cadastro de usuários.     |
| **Objetivo do Teste**     | Verificar se o usuário consegue se cadastrar na aplicação.                                               |
| **Passos**                | 1. Acessar o navegador. <br> 2. Informar o endereço do site: `https://adota-pet.herokuapp.com/src/index.html`.<br> 3. Clicar em "Criar conta". <br> 4. Preencher os campos obrigatórios: e-mail, nome, sobrenome, celular, CPF, senha e confirmação de senha. <br> 5. Aceitar os termos de uso. <br> 6. Clicar em "Registrar". |
| **Critério de Êxito**     | O cadastro deve ser realizado com sucesso, e o usuário deve ser redirecionado para a página de perfil.   |

---

### Caso de Teste 02 – Efetuar Login

| **Campo**                | **Descrição**                                                                                           |
|:-------------------------|:-------------------------------------------------------------------------------------------------------|
| **Requisito Associado**   | RF-00Y - A aplicação deve permitir login por meio do endereço de e-mail do usuário.                      |
| **Objetivo do Teste**     | Verificar se o usuário consegue realizar login corretamente.                                           |
| **Passos**                | 1. Acessar o navegador. <br> 2. Informar o endereço do site: `https://adota-pet.herokuapp.com/src/index.html`. <br> 3. Clicar no botão "Entrar". <br> 4. Preencher o campo de e-mail. <br> 5. Preencher o campo da senha. <br> 6. Clicar em "Login". |
| **Critério de Êxito**     | O login deve ser realizado com sucesso, permitindo o acesso à área restrita do usuário.                 |
