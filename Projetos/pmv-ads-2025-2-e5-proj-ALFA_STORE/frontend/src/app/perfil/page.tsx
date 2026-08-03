"use client";

import { useEffect, useMemo, useState, FormEvent, ChangeEvent } from "react";
import LayoutHome from "@/components/LayoutHome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { User } from "../types";

const API_BASE_URL = "/api/proxy";

function decodeJwtId(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64url = parts[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window !== "undefined"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(json);
    // Tentativas comuns de chave de identificação
    return (
      payload?.id || payload?._id || payload?.userId || payload?.sub || null
    );
  } catch {
    return null;
  }
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userToken");
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          setError("Não autenticado. Faça login para ver seu perfil.");
          setUserId(null);
          return;
        }

        // Tenta obter o ID salvo; se não houver, decodifica do JWT
        let id =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!id) {
          id = decodeJwtId(token);
          if (id && typeof window !== "undefined") {
            localStorage.setItem("userId", id);
          }
        }

        if (!id) {
          setError("Não foi possível identificar o usuário pelo token.");
          setUserId(null);
          return;
        }

        setUserId(id);
        const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          throw new Error(
            data?.message || "Falha ao carregar perfil do usuário."
          );
        }
        setUser(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message || "Erro ao carregar seu perfil."
            : "Erro ao carregar seu perfil."
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");

    const determinedRole: "admin" | "cliente" =
      roleFromStorage === "admin" ? "admin" : "cliente";

    setRole(determinedRole);
  }, []);

  const handlePasswordFieldChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordForm = (): string | null => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    const senhaForteRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;

    if (!currentPassword || !newPassword || !confirmPassword)
      return "Preencha todos os campos de senha.";
    if (!senhaForteRegex.test(newPassword))
      return "Nova senha deve ter minimo 8 caracteres, com maiuscula, minuscula, numero e especial.";
    if (newPassword !== confirmPassword)
      return "Nova senha e confirmacao devem ser iguais.";
    if (currentPassword === newPassword)
      return "Nova senha deve ser diferente da senha atual.";
    return null;
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const validation = validatePasswordForm();
    if (validation) {
      setPasswordError(validation);
      return;
    }
    if (!token) {
      setPasswordError("Sessao expirada. Faca login novamente.");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual: passwordForm.currentPassword,
          novaSenha: passwordForm.newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage =
          data?.message || data?.error || "Nao foi possivel alterar a senha.";
        throw new Error(apiMessage);
      }

      const successMessage =
        data?.message ||
        "Senha atualizada com sucesso! Por seguranca, refaca o login.";
      setPasswordSuccess(successMessage);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(successMessage);
      }
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message || "Falha ao alterar a senha."
          : "Falha ao alterar a senha."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleReLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    }
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (user?.role !== "cliente") return;
    if (!userId) {
      setDeleteError("Nao foi possivel identificar o usuario logado.");
      return;
    }
    if (!token) {
      setDeleteError("Sessao expirada. Faca login novamente.");
      return;
    }

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(
            "Confirmar exclusao definitiva da conta? Essa acao nao pode ser desfeita."
          )
        : false;

    if (!confirmed) return;

    try {
      setDeletingAccount(true);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Nao foi possivel deletar a conta."
        );
      }

      const message =
        data?.message || "Conta deletada com sucesso. Encerrando sessao.";

      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(message);
      }

      handleReLogin();
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message || "Falha ao deletar a conta."
          : "Falha ao deletar a conta."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <LayoutHome role={role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">MEU PERFIL</h1>

      {error && (
        <p className="text-red-500 font-medium mb-4 bg-red-50 border border-red-200 p-2 rounded-lg">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-red-800">
          <svg
            className="animate-spin h-5 w-5 text-red-600"
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
      ) : user ? (
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-red-200/50 dark:border-red-600/40 rounded-2xl shadow p-6">
          {/* Header do perfil */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.nome?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user.nome}
              </h2>
              <p className="text-sm text-red-700 dark:text-red-400">
                {user.role === "admin" ? "Administrador" : "Cliente"}
              </p>
            </div>
            {user._id && (
              <Link
                href={`/editUser?id=${user._id}`}
                className="px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white font-medium transition"
              >
                Editar
              </Link>
            )}
          </div>

          {user.role === "cliente" && (
            <div className="mb-4 bg-red-50 dark:bg-neutral-900/60 border border-red-200/70 dark:border-red-700/60 rounded-xl p-4">
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
                    Excluir conta
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Esta acao remove definitivamente seu perfil de cliente e nao
                    pode ser desfeita.
                  </p>
                </div>
                {deleteError && (
                  <p className="text-red-600 text-sm font-medium bg-red-100 border border-red-200 rounded-lg px-3 py-2">
                    {deleteError}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="px-4 py-2 rounded-lg bg-red-700/90 hover:bg-red-800 text-white font-medium transition disabled:opacity-60"
                  >
                    {deletingAccount
                      ? "Removendo conta..."
                      : "Deletar minha conta"}
                  </button>
                  <p className="text-xs text-gray-800 dark:text-gray-200">
                    Disponível apenas para clientes autenticados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-red-200/40 dark:border-red-600/40">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                Contato
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">E-mail:</span> {user.email}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">Telefone:</span>{" "}
                {user.telefone || "—"}
              </p>
            </div>
            <div className="bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-red-200/40 dark:border-red-600/40">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                Identificação
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">CPF:</span> {user.cpf}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">ID:</span> {user._id || "—"}
              </p>
            </div>
          </div>

          {/* Endereço */}
          <div className="mt-4 bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-red-200/40 dark:border-red-600/40">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
              Endereço
            </h3>
            {user.endereco ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-800 dark:text-gray-200">
                <p>
                  <span className="font-medium">Rua:</span>{" "}
                  {user.endereco.rua || "—"}
                </p>
                <p>
                  <span className="font-medium">Número:</span>{" "}
                  {user.endereco.numero || "—"}
                </p>
                <p>
                  <span className="font-medium">Cidade:</span>{" "}
                  {user.endereco.cidade || "—"}
                </p>
                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  {user.endereco.estado || "—"}
                </p>
                <p>
                  <span className="font-medium">CEP:</span>{" "}
                  {user.endereco.cep || "—"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Nenhum endereço cadastrado.
              </p>
            )}
          </div>

          {/* Alterar senha */}
          <div className="mt-4 bg-white/40 dark:bg-neutral-900/40 rounded-xl p-4 border border-red-200/40 dark:border-red-600/40">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                  Alterar senha
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Informe sua senha atual e defina uma nova senha para
                  continuar.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFieldChange}
                      autoComplete="current-password"
                      required
                      className="w-full px-3 py-2 pr-10 rounded-lg border border-red-300/50 dark:border-red-600/40 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-red-700 dark:text-red-300"
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.next ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFieldChange}
                      autoComplete="new-password"
                      required
                      className="w-full px-3 py-2 pr-10 rounded-lg border border-red-300/50 dark:border-red-600/40 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          next: !prev.next,
                        }))
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-red-700 dark:text-red-300"
                    >
                      {showPassword.next ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 mt-1">
                    Minimo de 8 caracteres. Use uma senha diferente da atual.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFieldChange}
                      autoComplete="new-password"
                      required
                      className="w-full px-3 py-2 pr-10 rounded-lg border border-red-300/50 dark:border-red-600/40 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-red-700 dark:text-red-300"
                    >
                      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-green-600 text-sm font-medium bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                  {passwordSuccess}
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 bg-green-600/90 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-60"
                >
                  {changingPassword ? "Atualizando..." : "Salvar nova senha"}
                </button>
                <button
                  type="button"
                  onClick={resetPasswordForm}
                  disabled={changingPassword}
                  className="flex-1 border border-red-300/50 dark:border-red-600/40 rounded-lg bg-white/50 dark:bg-neutral-900/40 hover:bg-white/80 dark:hover:bg-neutral-900/60 text-red-800 dark:text-red-200 font-medium py-2"
                >
                  Limpar campos
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-red-700 dark:text-red-400">
                  Por seguranca, considere refazer o login apos atualizar a
                  senha.
                </p>
                {passwordSuccess && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-red-50 dark:bg-neutral-900/60 border border-red-200/60 dark:border-red-600/50 rounded-lg px-4 py-3 text-sm text-red-800 dark:text-red-200">
                    <span>Quer confirmar a nova sessao?</span>
                    <button
                      type="button"
                      onClick={handleReLogin}
                      className="px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white font-medium transition"
                    >
                      Fazer login novamente
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Nenhum dado do usuário para exibir.
        </p>
      )}
    </LayoutHome>
  );
}
