"use client";

import { useEffect, useState, ChangeEvent, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LayoutHome from "@/components/LayoutHome";
import type { Endereco, User } from "../types";

const API_BASE_URL = "/api/proxy";

type Editable = Pick<User, "nome" | "telefone" | "endereco">;

function EditUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [form, setForm] = useState<Editable>({
    nome: "",
    telefone: "",
    endereco: { rua: "", numero: "", cidade: "", estado: "", cep: "" },
  });

  const [initial, setInitial] = useState<Editable | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [role, setRole] = useState<string>("cliente");

  // Obter token e ID
  useEffect(() => {
    const lsToken =
      typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const lsUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setToken(lsToken);
    setUserId(lsUserId);
  }, [searchParams]);

  // Obter role
  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    setRole(roleFromStorage === "admin" ? "admin" : "cliente");
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) return;
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const resp = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (!resp.ok)
          throw new Error(data?.message || "Falha ao carregar usuário.");
        const current: Editable = {
          nome: data.nome || "",
          telefone: data.telefone || "",
          endereco: {
            rua: data.endereco?.rua || "",
            numero: data.endereco?.numero || "",
            cidade: data.endereco?.cidade || "",
            estado: data.endereco?.estado || "",
            cep: data.endereco?.cep || "",
          },
        };
        setForm(current);
        setInitial(current);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Erro ao carregar dados.");
        } else {
          setError("Erro ao carregar dados.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setError("");
    setSuccess("");
    const { name, value } = e.target as HTMLInputElement;
    if (["nome", "telefone"].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }
    if (
      [
        "endereco.rua",
        "endereco.numero",
        "endereco.cidade",
        "endereco.estado",
        "endereco.cep",
      ].includes(name)
    ) {
      const key = name.split(".")[1] as keyof Endereco;
      setForm((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [key]: value },
      }));
    }
  };

  const validate = (): string | null => {
    if (!form.nome.trim()) return "Nome não pode ficar em branco.";
    if (form.telefone && !/^\d{10,11}$/.test(form.telefone))
      return "Telefone deve conter 10 ou 11 dígitos.";
    const { rua, numero, cidade, estado, cep } = form.endereco;
    if ((rua || numero || cidade || estado || cep) && !rua)
      return "Informe a rua do endereço.";
    if ((rua || numero || cidade || estado || cep) && !numero)
      return "Informe o número do endereço.";
    if ((rua || numero || cidade || estado || cep) && !cidade)
      return "Informe a cidade.";
    if (
      (rua || numero || cidade || estado || cep) &&
      (!estado || !/^([A-Z]{2})$/.test(estado.toUpperCase()))
    )
      return "UF deve ter 2 letras, ex: MG.";
    if (
      (rua || numero || cidade || estado || cep) &&
      (!cep || !/^\d{5}-\d{3}$/.test(cep))
    )
      return "CEP deve estar no formato XXXXX-XXX.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!userId) {
      setError("Usuário não identificado.");
      return;
    }
    if (!token) {
      setError("Não autenticado. Faça login para continuar.");
      return;
    }

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const payload: Partial<Editable> = {};
    if (!initial || form.nome !== initial.nome) payload.nome = form.nome;
    if (!initial || form.telefone !== initial.telefone)
      payload.telefone = form.telefone;
    if (
      !initial ||
      JSON.stringify(form.endereco) !== JSON.stringify(initial.endereco)
    ) {
      payload.endereco = {
        rua: form.endereco.rua,
        numero: form.endereco.numero,
        cidade: form.endereco.cidade,
        estado: form.endereco.estado.toUpperCase(),
        cep: form.endereco.cep,
      };
    }

    if (Object.keys(payload).length === 0) {
      setSuccess("Nada para atualizar.");
      return;
    }

    try {
      setSaving(true);
      const resp = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok)
        throw new Error(data?.message || "Falha ao atualizar usuário.");

      // Mostrar mensagem de sucesso
      setSuccess("Dados atualizados com sucesso!");

      // Redirecionar após 1,5s
      setTimeout(() => {
        router.push("/perfil");
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Erro ao atualizar.");
      } else {
        setError("Erro ao atualizar.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutHome role={role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Editar Perfil</h1>

      {error && (
        <p className="text-red-500 font-medium mb-4 bg-red-50 border border-red-200 p-2 rounded-lg">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-amber-800">
          <svg
            className="animate-spin h-5 w-5 text-amber-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Carregando dados do usuário...</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-amber-200/50 dark:border-amber-600/40 rounded-2xl shadow p-6 space-y-6"
        >
          {/* Contato */}
          <div className="bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-amber-200/40 dark:border-amber-600/40">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
              Contato
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-amber-200/40 dark:border-amber-600/40">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="endereco.rua"
                value={form.endereco.rua}
                onChange={handleChange}
                placeholder="Rua"
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <input
                type="text"
                name="endereco.numero"
                value={form.endereco.numero}
                onChange={handleChange}
                placeholder="Número"
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <input
                type="text"
                name="endereco.cidade"
                value={form.endereco.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <input
                type="text"
                name="endereco.estado"
                value={form.endereco.estado}
                onChange={handleChange}
                maxLength={2}
                placeholder="UF"
                disabled={loading}
                className="uppercase w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <input
                type="text"
                name="endereco.cep"
                value={form.endereco.cep}
                onChange={handleChange}
                placeholder="CEP"
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-white/40 dark:bg-neutral-800/40 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Mensagens */}
          {error && (
            <p className="text-red-500 font-medium text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 font-medium text-center">{success}</p>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || loading}
              className="flex-1 bg-amber-600/90 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/perfil")}
              disabled={saving}
              className="flex-1 border border-amber-300/40 dark:border-amber-600/40 rounded-lg bg-white/20 dark:bg-neutral-800/40 hover:bg-white/30 dark:hover:bg-neutral-800/60 transition text-amber-800 dark:text-amber-300 py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </LayoutHome>
  );
}

export default function EditUser() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EditUserContent />
    </Suspense>
  );
}
