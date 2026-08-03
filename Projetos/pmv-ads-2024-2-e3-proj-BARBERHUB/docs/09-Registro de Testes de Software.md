# Registro de Testes de Software

Pré-requisitos: [Projeto de Interface](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/04-Projeto%20de%20Interface.md), [Plano de Testes de Software](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/08-Plano%20de%20Testes%20de%20Software.md).

Relatório com as evidências dos testes de software realizados no sistema pela equipe, baseado em um plano de testes pré-definido.

| Caso de Teste                              | CT-01 - Cadastro de usuário                              |
| :----------------------------------------- | :------------------------------------------------------- |
| Resultados obtidos                         | O usuário efetuou o cadastro da conta dentro do sistema. |
| Responsável pela execução do caso de Teste | Helbert Miranda Benício                                  |

| Caso de Teste                              | CT-02 - Login de usuário                                                                                                                |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| Resultados obtidos                         | O usuário efetuou o login da conta dentro do sistema.                                                                                   |
| Erros obtidos                              | O usuário informou as credenciais erradas e o login da conta dentro do sistema não pode ser concluído, aparecendo uma mensagem de erro. |
| Responsável pela execução do caso de Teste | Helbert Miranda Benício                                                                                                                 |

| Caso de Teste                              | CT-03 - Redefinição de Senha                   |
| :----------------------------------------- | :--------------------------------------------- |
| Resultados obtidos                         | O usuário redefiniu a senha dentro do sistema. |
| Responsável pela execução do caso de Teste | Helbert Miranda Benício                        |

| Caso de Teste                              | CT-04 - Logout do sistema              |
| :----------------------------------------- | :------------------------------------- |
| Resultados obtidos                         | O usuário efetuou o logout do sistema. |
| Responsável pela execução do caso de Teste | Helbert Miranda Benício                |

## Avaliação

Discorra sobre os resultados do teste. Ressaltando pontos fortes e fracos identificados na solução. Comente como o grupo pretende atacar esses pontos nas próximas iterações. Apresente as falhas detectadas e as melhorias geradas a partir dos resultados obtidos nos testes.

## Avaliação dos Testes Realizados

### Pontos Fortes

- Cadastro de Usuário (CT-01):

O caso de teste foi executado com sucesso, com o cadastro de usuário sendo concluído conforme o esperado. Isso indica que o processo de cadastro está funcionando corretamente, o que é um dos pilares do sistema.
A experiência do usuário foi fluida, sem interrupções ou dificuldades durante o processo.

- Redefinição de Senha (CT-03):

O caso de teste foi bem-sucedido, com o usuário conseguindo redefinir sua senha sem problemas. Isso garante que as funcionalidades de segurança, como recuperação de senha, estão implementadas corretamente.

- Logout (CT-04):

A funcionalidade de logout foi testada e executada com êxito, sem problemas reportados. Isso indica que a gestão de sessões do usuário está adequada e o sistema está sendo fechado corretamente quando solicitado.

### Pontos Fracos

- Login de Usuário (CT-02):

Durante o teste de login, foi identificado um erro quando o usuário forneceu credenciais incorretas. O sistema não permitiu a conclusão do login e exibiu a mensagem de erro apropriada, o que é uma boa prática de usabilidade. No entanto, o grupo deverá revisar a forma como os erros de login são tratados, garantindo que o sistema forneça mensagens mais detalhadas sobre o tipo de erro (por exemplo, "senha incorreta" ou "usuário não encontrado").

Outra melhoria possível é melhorar a experiência do usuário após múltiplas tentativas de erro, talvez implementando uma funcionalidade de bloqueio temporário ou uma sugestão de recuperação de senha.

### Falhas Detectadas

- Erro de Login (CT-02):

Embora o erro tenha sido tratado de forma adequada, o grupo pode melhorar a forma como a falha é gerenciada após tentativas inválidas repetidas. O sistema não implementa, no momento, nenhuma proteção contra ataques de força bruta (como limite de tentativas consecutivas de login).

### Melhorias e Ações Futuras

- Melhoria nas Mensagens de Erro (CT-02):

Na próxima iteração, a equipe irá aprimorar a clareza e a especificidade das mensagens de erro exibidas para o usuário, diferenciando entre tipos de falhas como "senha errada" ou "usuário inexistente".

- Segurança do Login (CT-02):

Para garantir a segurança da plataforma, será implementado um sistema de bloqueio temporário ou atraso nas tentativas de login após um número definido de tentativas falhas. Isso ajudará a prevenir ataques de força bruta.

- Testes de Performance e Estresse:

Embora não tenha sido abordado diretamente nos testes realizados, será necessário incluir testes de carga e desempenho para verificar como o sistema responde a múltiplos acessos simultâneos, especialmente nas funcionalidades de login e cadastro.

## Conclusão

Os testes realizados mostraram que as funcionalidades básicas estão funcionando conforme o esperado. Entretanto, há áreas de aprimoramento relacionadas à segurança, gestão de erros e experiência do usuário, que serão abordadas nas próximas iterações do desenvolvimento. O grupo está ciente desses pontos e compromete-se a implementar as melhorias sugeridas de forma eficiente para garantir uma experiência robusta e segura.

<!-- > **Links Úteis**:
>
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/) -->
