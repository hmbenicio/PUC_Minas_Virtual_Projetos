This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Integracao com o Mercado Pago

Crie um arquivo `.env.local` na pasta `frontend` com as credenciais da mesma conta do Mercado Pago (public key e access token precisam ser do mesmo vendedor):

```bash
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=SEU_PUBLIC_KEY
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
FRONTEND_BASE_URL=https://www.alfaofc.com.br
MERCADO_PAGO_NOTIFICATION_URL=
MERCADO_PAGO_STATEMENT_DESCRIPTOR=ALFASTORE
```

Use `.env.local.example` como referencia; ele nao traz chaves reais. Sem essas variaveis configuradas, o checkout retornara erro ao buscar os detalhes da preferencia no Mercado Pago.

A aplicacao Next expoe a rota `POST /api/payments/mercadopago`, portanto o checkout envia o resumo do carrinho e o endereco preenchido diretamente para ela. Ao clicar no botao **Gerar pagamento** em `src/app/shop/page.tsx`, o `MercadoPagoWallet` e renderizado com o `preferenceId` retornado por essa rota, permitindo concluir compras com cartao de credito, debito ou PIX.
