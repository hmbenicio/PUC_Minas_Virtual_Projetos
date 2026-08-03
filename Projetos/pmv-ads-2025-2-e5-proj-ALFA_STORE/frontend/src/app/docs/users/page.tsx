"use client";

import Link from "next/link";

const API_BASE_URL = "/api/proxy";

export default function UsersApiDocs() {
  return (
    <div className="min-h-screen px-6 py-10 md:px-12 bg-amber-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-2">
          Documentação da API - Users
        </h1>
        <p className="text-sm text-amber-700 dark:text-amber-500 mb-6">
          Base via proxy no frontend:{" "}
          <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">
            {API_BASE_URL}
          </code>
        </p>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">Autenticação</h2>
          <p>Rotas privadas usam JWT via header Authorization.</p>
          <pre className="whitespace-pre-wrap bg-white/30 dark:bg-neutral-800/40 p-3 rounded border border-amber-200/40 dark:border-amber-600/40">
            Authorization: Bearer &lt;seu_token_jwt_aqui&gt;
          </pre>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">POST /users/login</h2>
          <p>Autentica um usuário existente e retorna o token JWT.</p>
          <pre className="whitespace-pre-wrap bg-white/30 dark:bg-neutral-800/40 p-3 rounded border border-amber-200/40 dark:border-amber-600/40">
            {`POST ${API_BASE_URL}/users/login
Body:
{
  "email": "usuario@exemplo.com",
  "senha": "senhaDoUsuario123"
}
`}
          </pre>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">POST /users</h2>
          <p>Cria um novo usuário (role padrão: cliente).</p>
          <ul className="list-disc ml-6">
            <li>
              Campos obrigatórios: nome, email, cpf, telefone, senha, endereço
              (rua, numero, cidade, estado=UF, cep), consentimentoDados
              (termosDeUso, politicaDePrivacidade)
            </li>
            <li>
              Validações: nome ≥ 3; email válido; cpf XXX.XXX.XXX-XX; telefone
              10-11 dígitos; senha ≥ 8; UF 2 letras; cep XXXXX-XXX;
              consentimentos true
            </li>
          </ul>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">GET /users</h2>
          <p>Lista todos os usuários. Requer token de admin.</p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">GET /users/:id</h2>
          <p>Obtém um usuário por ID. Requer ser o dono ou admin.</p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">PUT /users/:id</h2>
          <p>
            Atualiza informações (nome, telefone, endereço). Requer dono ou
            admin.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">DELETE /users/:id</h2>
          <p>Remove um usuário. Requer dono ou admin.</p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">Usuário Admin de Teste</h2>
          <p>Para desenvolvimento foi disponibilizado um admin pré-criado:</p>
          <pre className="whitespace-pre-wrap bg-white/30 dark:bg-neutral-800/40 p-3 rounded border border-amber-200/40 dark:border-amber-600/40">
            {`email: admin@teste.com
senha: outrasenhaforte456`}
          </pre>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold">Erros de Validação (400)</h2>
          <p>Estrutura típica retornada pela API em caso de erro nos campos:</p>
          <pre className="whitespace-pre-wrap bg-white/30 dark:bg-neutral-800/40 p-3 rounded border border-amber-200/40 dark:border-amber-600/40">
            {`{
  "message": "Erro de validação",
  "errors": [
    {
      "code": "invalid_string",
      "validation": "email",
      "message": "Formato de email inválido.",
      "path": ["body", "email"]
    }
  ]
}`}
          </pre>
        </section>

        <div className="mt-10 text-sm">
          <Link
            href="/"
            className="text-amber-700 dark:text-amber-400 hover:underline"
          >
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}
