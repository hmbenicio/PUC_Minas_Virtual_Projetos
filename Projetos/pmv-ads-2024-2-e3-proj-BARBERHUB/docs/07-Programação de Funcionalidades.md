# Programação de Funcionalidades

Pré-requisitos: [Especificação do Projeto](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/02-Especifica%C3%A7%C3%A3o%20do%20Projeto.md), [Projeto de Interface](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/04-Projeto%20de%20Interface.md), [Metodologia](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/03-Metodologia.md), [Arquitetura da Solução](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/docs/05-Arquitetura%20da%20Solu%C3%A7%C3%A3o.md).

Implementação do sistema descritas por meio dos requisitos funcionais e/ou não funcionais. Deve relacionar os requisitos atendidos os artefatos criados (código fonte) além das estruturas de dados utilizadas e as instruções para acesso e verificação da implementação que deve estar funcional no ambiente de hospedagem.

### Tela - Login

O acesso a tela de Login poderá ser feito através da barra de menu inferior presente no template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Login:

![Tela de Login](./image/07-Programação%20de%20Funcionalidades/TelaLogin.png)

#### Requisito atendido

RF-003: Permitir a autenticação de clientes e barbeiros com login via e-mail/senha.

#### Artefatos da funcionalidade

- barberhub/app/(tabs)/login.jsx

#### Estrutura de Dados

[Tela de Login](<https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/(tabs)/login.jsx>)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Login presente na barra de menu inferior da aplicação para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Criar Conta

O acesso a tela de Criar Conta poderá ser feito através da tela de Login, presente na barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Criar Conta:

![Tela de Criar Conta](./image/07-Programação%20de%20Funcionalidades/TelaCriarConta.png)

#### Requisito atendido

RF-001: Permitir que os clientes se registrem com suas informações pessoais (tipo de usuário, nome, contato, e-mail e senha).

#### Artefatos da funcionalidade

- barberhub/app/tabs_login/criarConta.jsx

#### Estrutura de Dados

[Tela de Criar Conta](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/tabs_login/criarConta.jsx)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Login presente na barra de menu inferior da aplicação, depois em Criar Conta, para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Redefinir Senha

O acesso a tela de Redefinir Senha poderá ser feito através da tela de Login, presente na barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Redefinir Senha:

![Tela de Redefinir Senha](./image/07-Programação%20de%20Funcionalidades/TelaRedefinirSenha.png)

#### Requisito atendido

RF-006: Permitir que os usuários redefinam a senha.

#### Artefatos da funcionalidade

- barberhub/app/tabs_login/resetSenha.jsx

#### Estrutura de Dados

[Tela de Redefinir Senha](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/tabs_login/resetSenha.jsx)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Login presente na barra de menu inferior da aplicação, depois em "Esqueceu a senha?", para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Home

O acesso a tela Home poderá ser feito através da barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Redefinir Senha:

![Tela Home](./image/07-Programação%20de%20Funcionalidades/TelaHome.png)

#### Requisito atendido

RF-007: Permitir que os usuários visualizem as opções disponíveis na tela inicial.

#### Artefatos da funcionalidade

- barberhub/app/(tabs)/index.jsx

#### Estrutura de Dados

[Tela Home](<https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/(tabs)/index.jsx>)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Home presente na barra de menu inferior da aplicação para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Estilos de cortes - Estilos de barbas - Limpeza de pele

O acesso as seguintes telas poderá ser feito através da tela Home, presente na barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Redefinir Senha:

![Tela de Estilos de cortes](./image/07-Programação%20de%20Funcionalidades/TelaEstilosCortes.png)
![Tela de Estilos de barbas](./image/07-Programação%20de%20Funcionalidades/TelaEstilosBarba.png)
![Tela de Limpeza de pele](./image/07-Programação%20de%20Funcionalidades/TelaLimpezaPele.png)

#### Requisito atendido

RF-004: Permitir que clientes agendem serviços como corte de cabelo, barba, entre outros, escolhendo data e hora disponíveis.

#### Artefatos da funcionalidade

- barberhub/app/tabs_home/agendaCortes.jsx
- barberhub/app/tabs_home/agendaBarba.jsx
- barberhub/app/tabs_home/agendaLimpeza.jsx

#### Estrutura de Dados

- [Tela de Agendamento de Cortes](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/tabs_home/agendaCortes.jsx)

- [Tela de Agendamento de Barba](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/tabs_home/agendaBarba.jsx)

- [Tela de Agendamento de Limpeza](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/tabs_home/agendaLimpeza.jsx)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone Home presente na barra de menu inferior da aplicação, depois nos respectivas opções para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Agenda

O acesso a tela Agenda poderá ser feito através da barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela de Redefinir Senha:

![Tela Agenda](./image/07-Programação%20de%20Funcionalidades/TelaAgenda.png)

#### Requisito atendido

RF-005: Permitir que barbeiros visualizem, confirmem ou cancelem agendamentos.

#### Artefatos da funcionalidade

- barberhub/app/(tabs)/agenda.jsx

#### Estrutura de Dados

[Tela Agenda](<https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/(tabs)/agenda.jsx>)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Agenda presente na barra de menu inferior da aplicação para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Favoritos

O acesso a tela Favoritos poderá ser feito através da barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela Favoritos:

![Tela de Favoritos](./image/07-Programação%20de%20Funcionalidades/TelaFavoritos.png)

#### Requisito atendido

RF-008: Permitir que os usuários marquem como favorito os barbeiros de interesse.

#### Artefatos da funcionalidade

- barberhub/app/(tabs)/favoritos.jsx

#### Estrutura de Dados

[Tela Favoritos](<https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/(tabs)/favoritos.jsx>)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Favoritos presente na barra de menu inferior da aplicação para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

### Tela - Mapa

O acesso a tela Mapa poderá ser feito através da barra de menu inferior do template padrão da aplicação. As estruturas de dados foram baseadas em JSX (extensão da linguagem JavaScript que permite escrever código semelhante ao HTML dentro de arquivos JavaScript).

Exemplo da tela Favoritos:

![Tela Mapa](./image/07-Programação%20de%20Funcionalidades/TelaMapa.png)

#### Requisito atendido

RF-009: Permitir que os usuários selecionem no mapa os barbeiros/barbearias de interesse.

#### Artefatos da funcionalidade

- barberhub/app/(tabs)/mapa.jsx

#### Estrutura de Dados

[Tela Mapa](<https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-2-e3-proj-mov-t4-pmv-ads-2024-2-e3-proj-mov-t4-barberhub/blob/main/barberhub/app/(tabs)/mapa.jsx>)

#### Instruções de acesso

Abra um navegador de Internet e informe a seguinte URL: [BarberHub]()

Clique no ícone de Mapa presente na barra de menu inferior da aplicação para ter acesso a tela.

#### Responsável

- Helbert Miranda Benício
- Jefferson Wagner S. Silva

<!-- > **Links Úteis**:
>
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON Data Set Sample](https://opensource.adobe.com/Spry/samples/data_region/JSONDataSetSample.html)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm) -->
