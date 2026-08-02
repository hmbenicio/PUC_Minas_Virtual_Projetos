# Registro de Testes de Software

> **Pré-requisitos:**  
> Consulte os documentos relacionados antes de prosseguir: <a href="04-Projeto de Interface.md"> Projeto de Interface</a>, <a href="08-Plano de Testes de Software.md"> Plano de Testes de Software</a>.

Este documento tem como objetivo registrar as evidências dos testes realizados, conforme os casos de teste definidos no Plano de Testes de Software. Cada caso de teste deve ser documentado com capturas de tela e vídeos de tipo *screencast* que comprovem o cumprimento dos critérios de êxito (ou falhas) associados a cada funcionalidade.

## Estrutura dos Casos de Teste

Para cada caso de teste, é necessário registrar as informações relevantes, como o requisito associado, a evidência do teste e o link para o vídeo *screencast*.

### Exemplo de Registro de Caso de Teste

| **Caso de Teste** | **CT01 – Cadastrar perfil** |
|:---:|:---:|
| **Requisito Associado** | RF-00X - A aplicação deve permitir que o usuário crie e gerencie seu perfil na página principal. |
| **Descrição do Caso de Teste** | Testar o fluxo de cadastro de um novo usuário, incluindo preenchimento de formulário e validações. |
| **Registro de Evidência** | [Link para evidência](www.teste.com.br/drive/ct-01) |

| **Caso de Teste** | **CT02 – Realizar login** |
|:---:|:---:|
| **Requisito Associado** | RF-00Y - A aplicação deve permitir que um usuário previamente cadastrado faça login. |
| **Descrição do Caso de Teste** | Testar o fluxo de login, incluindo o uso de credenciais válidas e inválidas. |
| **Registro de Evidência** | [Link para evidência](www.teste.com.br/drive/ct-02) |

> **Nota:** Para cada caso de teste, inclua capturas de tela detalhadas ou vídeos *screencast* que comprovem a execução do teste e o resultado esperado. Essas evidências são fundamentais para validar o sucesso do teste ou identificar problemas na aplicação.

---

## Relatório de Testes de Software

### 1. **Análise dos Resultados de Testes**

A seguir, apresentamos uma análise detalhada dos resultados obtidos durante a execução dos testes. Aqui discutimos tanto os pontos positivos quanto as fragilidades observadas, com base nas evidências coletadas.

#### Exemplos de Análise:

- **Ponto Forte**: O processo de cadastro foi realizado com sucesso, conforme evidenciado no [vídeo de evidência](www.teste.com.br/drive/ct-01). O formulário de cadastro apresenta todas as validações necessárias (campos obrigatórios, formato de e-mail, etc.), garantindo uma boa experiência do usuário.
- **Fragilidade**: Durante os testes de login, identificamos que o sistema não está tratando corretamente senhas incorretas. Quando o usuário tenta fazer login com credenciais inválidas, não há uma mensagem de erro clara, impactando a usabilidade do sistema.

### 2. **Falhas Detectadas e Impactos**

A seguir, listamos as falhas mais críticas encontradas durante os testes e discutimos os impactos na experiência do usuário e na funcionalidade da aplicação.

#### Exemplo de Falha:

- **Falha**: O botão de "Cadastrar" não está respondendo ao clique após o preenchimento do formulário de cadastro. 
  - **Impacto**: O usuário não consegue submeter seus dados, o que impede a criação de um novo perfil.
  - **Evidência**: O vídeo de evidência [aqui](www.teste.com.br/drive/ct-01) mostra a interação com o botão sem resposta.

### 3. **Estratégias para Correção de Deficiências**

Com base nas falhas observadas, apresentamos as ações corretivas que serão implementadas nas próximas iterações do desenvolvimento.

#### Ações Propostas:
- **Correção do botão de "Cadastrar"**: Ajustar a interação do botão para garantir que ele realize a submissão corretamente. A correção será feita revisando a lógica de frontend que trata o evento de clique.
- **Melhoria nas mensagens de erro do login**: Adicionar mensagens claras de erro quando as credenciais forem inválidas, melhorando a experiência do usuário.

### 4. **Propostas de Melhoria**

Além da correção de falhas, também foram identificadas oportunidades de melhoria que podem ser implementadas para aprimorar o sistema.

#### Exemplos de Melhoria:
- **Otimização de desempenho**: Melhorar o tempo de resposta da aplicação durante o processo de login, que atualmente apresenta um atraso perceptível.
- **Acessibilidade**: Incluir descrições de texto alternativas para todos os campos de formulário, garantindo a acessibilidade para usuários com deficiência visual.

---

> ### Conclusão
> O processo de testes é essencial para garantir a qualidade e a usabilidade da aplicação. Através da execução dos testes, conseguimos identificar pontos fortes que reforçam a confiança no sistema, assim como fragilidades que devem ser corrigidas para aprimorar a experiência do usuário. O acompanhamento contínuo e a implementação das melhorias sugeridas contribuirão para a evolução do projeto.
