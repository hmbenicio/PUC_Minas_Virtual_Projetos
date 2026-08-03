# Especificação do Projeto

## Perfis de Usuários
| Perfil | Descrição | Necessidade |
|--------------------|---------------------------|----------------------------------|
| Organizadores de Eventos / Administrador - 1 | Este usuário é o responsável pela criação, planejamento e execução do evento. Eles têm controle total sobre todas as funcionalidades da plataforma. | Este usuário deve conter controle máximo sobre a aplicação. Uma vez logado na aplicação, o usuário deve ter controle sobre a criação e a remoção de eventos, controle sobre a lista de convidados, controle sobre fotos que irão para a aplicação, definir local do evento, entre outras. Todas as funções implementadas devem estar disponíveis para este tipo de usuário.
| Fornecedor de Serviços - 2 | Este usuário fornece serviços necessários para o evento, como catering, decoração, som, iluminação etc. | Este usuário terá controle terá acesso apenas às suas tarefas, podendo atualizar seu status e visualizar seus detalhes. |
| Convidado - 3 | Este usuário é um convidado do evento e está interessado em receber informações, confirmar presença e interagir com outros participantes. | Este usuário não tem controle algum sobre a aplicação em relação a modificar algum dado. Este, por sua vez, pode somente verificar a lista de convidados, ver fotos do local e confirmar presença. |


## Histórias de Usuários

|EU COMO...    | QUERO/PRECISO ...  |PARA ...                  |
|--------------------|---------------------------|----------------------------------|
| Administrador 1 | Disponibilizar convites do(s) evento(s) cadastrado(s).  | Comunicar convidado(s) sobre futuros evento(s). |
| Administrador 1 |Registrar evento(s), especificando seus detalhes.| Definir futuro(s) evento(s) a ser(em) planejado(s). |
| Administrador 1 | Registrar tarefa(s), especificando seus detalhes. | Garantir a execução do(s) requisito(s) de cada evento. |
| Administrador 1 | Alocar parte do capital disponível para organização do evento: tempo, dinheiro, entre outros. | Gerir o capital tendo em vista a eficiente organização de evento(s). |
| Fornecedores de Serviços - 2 | Atualizar o status de minha(s) tarefa(s). | Comunicar a equipe de organização o andamento do serviço prestado. |
| Fornecedores de Serviços - 2 | Visualizar a(s) detalhe(s) de minha(s) tarefa(s). | Gerir o capital tendo em vista a eficiente organização de evento(s). |
| Convidados - 3 | Aceitar convite(s) para evento(s) | Comunicar a equipe de organização minha participação no evento. |
| Convidados - 3 | Visualizar detalhes de eventos. | Me informar sobre evento(s) futuro(s). |

## Requisitos do Projeto

### Requisitos Funcionais

|ID    | Descrição                | Prioridade |
|-------|---------------------------------|----|
| RF-01 | Permitir que o usuário faça cadastro no sistema. | ALTA | 
| RF-02 | Permitir que o usuário faça login e logout no sistema. | ALTA |
| RF-03 | Permitir que o usuário administrador cadastre eventos. | ALTA |
| RF-04 | Permitir que o usuário administrador edite eventos. | MÉDIA |
| RF-05 | Permitir que o usuário pesquise eventos/tarefas cadastradas. | ALTA |
| RF-06 | Permitir que o usuário administrador exclua eventos. | BAIXA |
| RF-07 | Permitir que o administrador controle a lista de convidados do evento. | MÉDIA |
| RF-08 | Permitir que o administrador crie uma lista de tarefas. | ALTA |
| RF-09 | Permitir que o fornecedor de serviços marque suas tarefas como concluídas. | BAIXA |
| RF-10 | Permitir que o fornecedor de serviços visualize suas tarefas. | ALTA |
| RF-11 | Permitir que o administrador exclua tarefas. | BAIXA |
| RF-12 | Permitir que o convidado visualize os detalhes do evento. | MÉDIA |
| RF-13 | Permitir que o convidado confirme presença no evento. | ALTA |
| RF-14 | Permitir que o administrador/fornecedor visualize seus eventos. | ALTA |
| RF-15 | Permitir que o usuário administrador cadastre tarefas. | ALTA |

### Requisitos não Funcionais

|ID      | Descrição               |Prioridade |
|--------|-------------------------|----|
| RNF-01 | O sistema deve ser responsivo  | ALTA | 
| RNF-02 | O sistema deve ser intuitivo e de fácil utilização aos usuários | ALTA | 
| RNF-03 | A aplicação deve ser compatível com os principais navegadores do mercado (Google Chrome, Firefox, Microsoft Edge) | MÉDIA | 
| RNF-04 | A aplicação deve ser publicada em um ambiente acessível publicamente na Internet | MÉDIA | 
| RNF-05 | Aplicação deve conter recursos de acessibilidade | BAIXA | 


