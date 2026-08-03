# Projetos de ADS — PUC Minas Virtual

Este repositório reúne os cinco projetos desenvolvidos ao longo dos cinco eixos do curso de **Análise e Desenvolvimento de Sistemas (ADS)** da **PUC Minas Virtual**. Cada pasta em [`Projetos`](Projetos/) preserva a documentação acadêmica, o código-fonte e os materiais de apresentação produzidos no respectivo semestre.

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

Não execute `npm install` dentro das subpastas. Use os atalhos abaixo a partir da raiz:

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

## Licença

Consulte o arquivo [LICENSE](LICENSE) e as licenças presentes em cada projeto.
