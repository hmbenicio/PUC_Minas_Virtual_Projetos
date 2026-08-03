# Implantação do Software

## 1. Planejamento da Implantação

### Tecnologias por camada
- **Backend**: Node.js + Express com TypeScript, autenticação JWT, integração Mercado Pago (SDK REST), validação com Zod, persistência com Mongoose em MongoDB (Atlas ou instância própria) e variáveis `.env` (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_BASE_URL`, chaves Mercado Pago etc.).
- **Frontend**: Next.js 15 (App Router) com React 19, CSS global + utilitários, componentes Radix, ícones Lucide/Bootstrap e carteira Mercado Pago via `@mercadopago/sdk-react`. Rota interna `/api/payments/mercadopago` cria preferências de pagamento; rewrites (`next.config.ts`) apontam `/api/proxy/*` para o backend público.
- **Banco de dados**: MongoDB (coleções para usuários, produtos, promoções, vendas), operando em Atlas ou cluster próprio acessível via `MONGO_URI`.

### Infraestrutura e ferramentas de implantação
- **Containers**: Docker e Docker Compose orquestram o frontend (`frontend/Dockerfile`) e o Nginx reverse proxy (HTTPS). O arquivo `docker-compose.yml` expõe `3000:3000` e publica Nginx nas portas 80/443.
- **Proxy/SSL**: Nginx (`nginx/default.conf`) faz proxy para o frontend e aplica cache em assets `_next/*`; certificados TLS provisionados com Let's Encrypt e montados em `/etc/letsencrypt/live/alfaofc.com.br`.
- **Hospedagem**: VM Ubuntu 22.04/24.04 (sudo habilitado). Backend operacional via endpoint público (Render) usado pelo rewrite do Next; pode ser auto-hospedado com Node + `npm run build && npm start` usando as mesmas variáveis.
- **Domínio**: `alfaofc.com.br` apontando para a VM; redirecionamento 80→443 configurado no Nginx.
- **Operação**: Logs e controle via `docker compose logs|restart`; updates feitos por `git pull` + rebuild. Sem CI/CD automatizado; pipeline é reproduzível por script de deploy.

### Passo a passo de deploy em produção
1. **Preparar servidor**: Ubuntu atualizado, portas 80/443 liberadas, Docker Engine + Compose instalados, Nginx (se for usar no host) ou o serviço `nginx` do Compose ativo. Clonar o repositório em `/opt/alfastore`.
2. **Configurar ambiente**:
   - `frontend/.env.local`: `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_ACCESS_TOKEN`, `FRONTEND_BASE_URL=https://www.alfaofc.com.br`, `MERCADO_PAGO_NOTIFICATION_URL`, `MERCADO_PAGO_STATEMENT_DESCRIPTOR`.
   - `backend/.env` (se auto-hospedar): `MONGO_URI` (Atlas/cluster), `JWT_SECRET`, `PORT`, `ADMIN_TOKEN`, chaves sociais e Mercado Pago (`SUCCESS/FAILURE/PENDING` apontando para `/shop`).
3. **Build e subida**:
   - Frontend: `docker compose up -d --build` (gera imagem Next em modo produção e publica na porta 3000; o Nginx do Compose expõe 80/443 e aplica TLS).
   - Backend (opcional local): `npm install && npm run build && npm start` ou criar imagem própria e adicioná-la ao Compose; expor rota `/api/v1`.
4. **Banco de dados**: garantir `MONGO_URI` acessível (Atlas ou instância gerenciada). Não há migrações formais; a criação de coleções/índices é feita pelo Mongoose no primeiro acesso. Popular dados iniciais de produtos conforme necessidade.
5. **Testes pós-deploy**:
   - Health check do frontend: `curl -I https://alfaofc.com.br`.
   - Checkout: fluxo `/shop` → carrinho → geração de preferência Mercado Pago → retorno `?status=success`.
   - Rotas proxy de API: validar `/api/proxy/products` e autenticação com JWT.
6. **Operação contínua**: `docker compose logs -f frontend` para acompanhar, `docker compose restart frontend` após atualizações, `certbot renew --dry-run` para checar renovação de certificados. Para novos releases, `git pull && docker compose up -d --build`.

## 2. Link da Aplicação em Produção
- Ambiente oficial: http://alfaofc.com.br/ (com redirecionamento para HTTPS via Nginx).

## 3. Planejamento de Evolução da Aplicação

### Versão atual
- Catálogo e vitrine (`/home`, `/shop`) com busca, filtros e destaques/promos.
- Autenticação de usuários e perfil (`/createUser`, `/perfil`, `/users`), carrinho e checkout integrado ao Mercado Pago (cartão, débito, PIX).
- Gestão de estoque e produtos (`/estoque`), seção de promoções (`/promocoes`) e vendas (`/vendas`) consumindo API via proxy.
- Deploy containerizado com Nginx + TLS, domínio configurado e API pública em Render.

### Funcionalidades em desenvolvimento
- Refinar painel de administração (controle de preços, promoções e estoque em tempo real).
- Ajustes no fluxo de perfil/edição de usuário e UX do checkout (tratamento de estados de pagamento/pending).
- Melhoria de observabilidade (logs estruturados, métricas básicas) para acompanhar a operação.

### Funcionalidades futuras
- Módulo de pedidos completo (timeline de status, cancelamento, reembolso).
- Cupons de desconto, frete calculado por CEP e simulação de prazo.
- Relatórios operacionais (vendas por período, produtos mais vendidos, rupturas de estoque).
- Área de conteúdos institucionais/landing customizável para campanhas.

### Melhorias técnicas planejadas
- CI/CD automatizado (pipeline GitHub Actions) para build, testes e deploy do frontend/backend.
- Testes automatizados (unitários e e2e) cobrindo checkout, login e fluxo de estoque.
- Hardenings: rate limiting na API, CORS restritivo, rotação de chaves JWT, backups automatizados do MongoDB Atlas.
- Performance: cache de catálogo (CDN/ISR), otimização de imagens e compressão Gzip/Brotli no Nginx.

### Possíveis integrações e expansões
- Gateways alternativos de pagamento e webhooks de conciliação.
- Integração com ERP/CRM para sincronizar estoque e clientes.
- Notificações por e-mail/WhatsApp para status de pedido e recuperação de carrinho.
- Painel analytics com dashboards em tempo real e exportação CSV/BI.
