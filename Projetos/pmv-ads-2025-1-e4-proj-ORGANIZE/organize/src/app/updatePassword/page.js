"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Supondo que o token JWT está armazenado aqui

    if (!token) {
      alert("Você precisa estar autenticado para atualizar a senha.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/organize/user/password-update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (response.ok) {
        alert("Senha atualizada com sucesso!");
        router.push("/login");
      } else {
        const data = await response.json();
        alert(
          `Erro ao atualizar a senha: ${data.message || "verifique os dados"}`
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <main
      className={`sm:ml-14 p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-amber-100"
      }`}
    >
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-gray-600"
            : "bg-amber-100 text-black"
        } flex flex-col items-center justify-center text-center`}
      >
        <img src="/logo.png" alt="Logo" className="mb-4 w-40 h-auto" />
        <h1 className="text-4xl font-bold mb-2 text-slate-500">
          Atualizar Senha
        </h1>
        <p className="text-lg mb-6 text-slate-500">
          Digite sua senha atual e a nova senha
        </p>

        <div className="w-full max-w-sm p-8 rounded-lg shadow-lg relative">
          <img
            src="/postit2.png"
            alt="Post-it"
            className={`w-full h-full object-cover shadow-lg absolute top-0 left-0 rounded-lg ${
              theme === "dark" ? "opacity-90" : "opacity-70"
            }`}
          />

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-lg text-black mb-2">
                Senha Atual
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Digite sua senha atual"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-lg text-black mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ffbf00] text-white rounded-lg text-xl font-semibold hover:bg-[#ffd191] transition"
            >
              Atualizar Senha
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-400 text-lg font-semibold"
            >
              Voltar para o Login
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
