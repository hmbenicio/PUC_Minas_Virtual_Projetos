"use client";

import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { User } from "../src/app/types";

const API_BASE_URL = "/api/proxy";

export interface Item {
  _id?: string;
  nome: string;
  tipo: string;
  tamanho: string;
  estampa: boolean;
  preco: number;
  quantidade: number;
  promo?: boolean;
  precoPromo?: number;
}

interface TabelaUsersProps {
  users: User[];
  selecionados: string[];
  onSelecionarItens: (ids: string[]) => void;
  loading?: boolean;
}

const TabelaUsers: React.FC<TabelaUsersProps> = ({
  users,
  selecionados,
  onSelecionarItens,
  loading = false,
}) => {
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  // 🔍 Filtros
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState("");

  useEffect(() => {
    setLocalUsers(users);
    setSelecionarTodos(
      users.length > 0 && users.every((i) => selecionados.includes(i._id!))
    );
  }, [users, selecionados]);

  const toggleSelecionado = (_id?: string) => {
    if (!_id) return;
    if (selecionados.includes(_id)) {
      onSelecionarItens(selecionados.filter((i) => i !== _id));
    } else {
      onSelecionarItens([...selecionados, _id]);
    }
  };

  const toggleSelecionarTodos = () => {
    if (selecionarTodos) {
      onSelecionarItens([]);
      setSelecionarTodos(false);
    } else {
      onSelecionarItens(users.map((i) => i._id!));
      setSelecionarTodos(true);
    }
  };

  async function deleteUserById(userId: string | undefined) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar usuário");
      }

      const result = await response.json();
      alert("Usuário deletado com sucesso! Recarregue a página");
      return result;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }

  async function switchRole(userId: string | undefined) {
    try {
      if (!userId) throw new Error("ID de usuário inválido.");

      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const user = users.find((u) => u._id === userId);
      if (!user) throw new Error("Usuário não encontrado.");

      const novoRole = user.role === "admin" ? "cliente" : "admin";

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: novoRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao alterar perfil");
      }

      const result = await response.json();
      alert("Perfil alterado com sucesso! Recarregue a página");
      return result;
    } catch (error) {
      console.error("Erro ao alterar perfil:", error);
      alert("Erro ao alterar perfil. Veja o console.");
    }
  }

  const handleDelete = (user: User) => {
    const confirmar = window.confirm("Deseja realmente apagar esse usuário?");
    if (confirmar) return deleteUserById(user._id);
  };

  // 🔍 Filtragem
  const usuariosFiltrados = localUsers.filter((user) => {
    const matchBusca = user.nome.toLowerCase().includes(busca.toLowerCase());
    const matchRole = filtroRole ? user.role === filtroRole : true;
    return matchBusca && matchRole;
  });

  return (
    <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6">
      {/* 🔎 Área de busca e filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        <select
          value={filtroRole}
          onChange={(e) => setFiltroRole(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="">Todos os perfis</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      {/* 🧾 Tabela */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-300/60 text-gray-800 uppercase text-sm tracking-wide">
              <th className="px-4 py-2 text-center rounded-l-lg">
                <input
                  type="checkbox"
                  checked={selecionarTodos}
                  onChange={toggleSelecionarTodos}
                  className="accent-gray-700 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Perfil</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center rounded-r-lg">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Carregando usuários...
                </td>
              </tr>
            ) : usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white/60" : "bg-gray-100/70"
                  } hover:bg-gray-200/60 transition`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selecionados.includes(user._id!)}
                      onChange={() => toggleSelecionado(user._id)}
                      className="accent-gray-700 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.nome}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => switchRole(user._id)}
                        title="Editar usuário"
                        className="text-blue-600 hover:text-blue-800 transition text-xl"
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        title="Excluir usuário"
                        className="text-red-600 hover:text-red-800 transition text-xl"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaUsers;
