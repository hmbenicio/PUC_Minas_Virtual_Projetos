![Logo de Análise e Desenvolvimento de Sistemas](Projetos/assets/Logo_ADS.png)

# Projetos de ADS — PUC Minas Virtual

Este repositório reúne os cinco projetos desenvolvidos ao longo dos cinco eixos do curso de **Análise e Desenvolvimento de Sistemas (ADS)** da **PUC Minas Virtual**. Os projetos estão versionados como diretórios comuns dentro de [`Projetos`](Projetos/), formando um único repositório com documentação e instalação centralizadas.

## Projetos

| Eixo | Semestre | Projeto | Solução | Tecnologias principais |
| --- | --- | --- | --- | --- |
| 1 | 2023/2 | [Social Event](Projetos/pmv-ads-2023-2-e1-proj-SOCIAL_EVENT/) | Organização de eventos sociais | HTML, CSS e JavaScript |
| 2 | 2024/1 | [NutriGenius](Projetos/pmv-ads-2024-1-e2-proj-NUTRI_GENIUS/) | Geração de tabelas nutricionais | ASP.NET Core, C# e MySQL |
| 3 | 2024/2 | [Barber Hub](Projetos/pmv-ads-2024-2-e3-proj-BARBERHUB/) | Agendamento de serviços de barbearia | Expo e React Native |
| 4 | 2025/1 | [OrgaNize](Projetos/pmv-ads-2025-1-e4-proj-ORGANIZE/) | Gestão colaborativa de tarefas | Next.js, Expo, Express e MongoDB |
| 5 | 2025/2 | [Alfa Store](Projetos/pmv-ads-2025-2-e5-proj-ALFA_STORE/) | Catálogo e comércio digital | Next.js, Express, TypeScript e MongoDB |

## Preparação do ambiente

Os projetos JavaScript usam **npm workspaces** e compartilham a instalação de dependências na raiz do repositório:

```bash
npm install
```

Esse comando cria a pasta `node_modules` compartilhada, que não é versionada. Não execute `npm install` dentro das subpastas. Use os atalhos abaixo a partir da raiz:

```bash
npm run social
npm run barber
npm run organize:web
npm run organize:mobile
npm run organize:api
npm run alfa:web
npm run alfa:api
```

O NutriGenius exige o SDK .NET 8 e é iniciado separadamente:

```bash
npm run nutri
```

As aplicações que usam MongoDB ou serviços externos precisam de suas variáveis de ambiente. Consulte o README de cada projeto e copie os arquivos `.env.example` quando disponíveis.

## Validação

```bash
npm run check
```

Esse comando verifica as aplicações que oferecem compilação ou lint automatizado. Serviços de banco, credenciais e emuladores continuam sendo necessários para testes de integração e execução mobile.

## Organização

- `Projetos/`: os cinco projetos acadêmicos, organizados por eixo.
- `Docs/`, `Src/` e `Apresentação/`: material legado do modelo de documentação original.
- `package.json`: workspaces e atalhos centralizados.
- `.gitignore`: dependências, builds, logs, credenciais e arquivos temporários que não devem ser versionados.

## Política de versionamento

O código-fonte, a documentação, as imagens e os arquivos necessários para compreender cada projeto são versionados normalmente. Ficam fora do Git:

- dependências instaladas em `node_modules`;
- resultados de compilação e caches, como `bin`, `obj`, `dist` e `.next`;
- credenciais e arquivos locais de ambiente;
- vídeos (`.mp4`, `.mov`, `.avi` e `.mkv`), que devem permanecer em armazenamento externo ou ser referenciados por link.

Depois de clonar o repositório, execute `npm install` uma única vez na raiz para restaurar todas as bibliotecas JavaScript.

## Licença

Consulte o arquivo [LICENSE](LICENSE) e as licenças presentes em cada projeto.
