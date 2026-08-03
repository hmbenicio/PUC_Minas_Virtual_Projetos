# Projeto de Interface

<span style="color:red">Pré-requisitos: <a href="02-Especificação do Projeto.md"> Especificação do Projeto</a></span>

Visão geral da interação do usuário com as funcionalidades que fazem parte do sistema sociotécnico (protótipo de telas).

```mermaid
flowchart TD
    %% Autenticação
    INICIO([Início]) --> VERIFICA{Usuário já tem cadastro?}
    VERIFICA -- "Não, quero criar" --> CADASTRO(["<img src='img/pages/02_Page_CadastroUsuario.png' width='170'><br/>Cadastro"])
    VERIFICA -- "Sim, entrar" --> LOGIN(["<img src='img/pages/01_Page_Login.png' width='170'><br/>Login"])
    CADASTRO --> LOGIN
    LOGIN --> AUTENTICADO{Credenciais válidas?}
    AUTENTICADO -- "Não" --> LOGIN
    AUTENTICADO -- "Sim" --> HOME(["<img src='img/pages/03_Page_Home.png' width='170'><br/>Home"])

    %% Navegação principal do cliente
    HOME --> PERFIL(["<img src='img/pages/04_Page_Perfil.png' width='170'><br/>Perfil do Usuário"])
    HOME --> CARRINHO(["<img src='img/pages/05_Page_CarrinhoCompras.png' width='170'><br/>Carrinho"])
    HOME --> RESUMO(["<img src='img/pages/06_Page_ResumoCompras.png' width='170'><br/>Resumo"])
    CARRINHO --> RESUMO
    RESUMO --> CARRINHO
    RESUMO --> VENDAS(["<img src='img/pages/11_Page_Vendas.png' width='170'><br/>Finalizar Pedido"])

    %% Áreas administrativas
    HOME --> GESTAO(["<img src='img/pages/08_Page_Usuarios.png' width='170'><br/>Gestão de Usuários"])
    HOME --> ESTOQUE(["<img src='img/pages/09_Page_CadastroEstoqueProdutos.png' width='170'><br/>Produtos / Estoque"])
    HOME --> PROMO(["<img src='img/pages/10_Page_CadastroPromocao.png' width='170'><br/>Promoções"])
    HOME --> SOBRE(["<img src='img/pages/12_Page_Sobre.png' width='170'><br/>Sobre"])

    %% Relação entre cadastros e promoções
    ESTOQUE --> PROMO
```

## Protótipo de Telas

### Login

- Tela de autenticação que permite o acesso de clientes e administradores à plataforma.
<img src="img/pages/01_Page_Login.png" alt="Tela de Login" width="320"/>

### Cadastro de Usuário

- Formulário para criação de conta, coletando dados pessoais e credenciais de acesso.
<img src="img/pages/02_Page_CadastroUsuario.png" alt="Tela de Cadastro de Usuário" width="320"/>

### Home

- Vitrine inicial com destaques de produtos e navegação para categorias e ofertas.
<img src="img/pages/03_Page_Home.png" alt="Tela Home" width="320"/>

### Perfil do Usuário

- Painel para consulta e edição de informações pessoais, endereço e dados de contato.
<img src="img/pages/04_Page_Perfil.png" alt="Tela de Perfil do Usuário" width="320"/>

### Carrinho de Compras

- Listagem dos itens selecionados, permitindo ajustar quantidades ou remover produtos.
<img src="img/pages/05_Page_CarrinhoCompras.png" alt="Tela de Carrinho de Compras" width="320"/>

### Resumo da Compra

- Etapa de confirmação do pedido com totais, endereço e forma de pagamento.
<img src="img/pages/06_Page_ResumoCompras.png" alt="Tela de Resumo da Compra" width="320"/>

### Gestão de Usuários

- Visão administrativa para listar, pesquisar e gerenciar perfis cadastrados.
<img src="img/pages/08_Page_Usuarios.png" alt="Tela de Gestão de Usuários" width="320"/>

### Cadastro e Estoque de Produtos

- Interface para inserção, edição e controle de itens do catálogo, incluindo estoque.
<img src="img/pages/09_Page_CadastroEstoqueProdutos.png" alt="Tela de Cadastro e Estoque de Produtos" width="320"/>

### Cadastro de Promoções

- Tela para configurar descontos e campanhas aplicadas aos produtos.
<img src="img/pages/10_Page_CadastroPromocao.png" alt="Tela de Cadastro de Promoções" width="320"/>

### Vendas

- Painel de acompanhamento de pedidos realizados e status de entrega.
<img src="img/pages/11_Page_Vendas.png" alt="Tela de Vendas" width="320"/>

### Sobre

- Página institucional apresentando informações da AlfaStore e sua proposta de valor.
<img src="img/pages/12_Page_Sobre.png" alt="Tela Sobre" width="320"/>
