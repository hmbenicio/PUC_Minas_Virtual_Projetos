"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { api } from "../../../Services/page";

export default function TaskList() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filterDate, setFilterDate] = useState(""); // formato yyyy-mm-dd
  const [filterPriority, setFilterPriority] = useState(""); // nova prioridade

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAllTasks = async () => {
      try {
        const response = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.log("Erro ao buscar tarefas", error);
        alert(error.response?.data?.msg || "Erro ao buscar tarefas");
      }
    };

    getAllTasks();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status", error);
      alert("Erro ao atualizar status da tarefa.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa", error);
      alert("Erro ao deletar a tarefa.");
    }
  };

  // Filtrar tarefas ativas (não concluídas), por data e prioridade
  const filteredTasks = tasks
    .filter((task) => task.status !== "concluido")
    .filter((task) => {
      if (!filterDate) return true;
      if (!task.dueDate) return false;
      const taskDate = task.dueDate.slice(0, 10);
      return taskDate >= filterDate;
    })
    .filter((task) => {
      if (!filterPriority) return true;
      return task.priority?.toLowerCase() === filterPriority.toLowerCase();
    });

  if (!mounted) return null;

  return (
    <main
      className={`sm:ml-14 p-4 flex flex-col items-center justify-start min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-600"
          : "bg-amber-100 text-black"
      }`}
    >
      <div className="flex flex-col items-center text-center w-full max-w-6xl p-4">
        <img src="/logo.png" alt="Logo" className="mb-4 w-32 sm:w-40 h-auto" />
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-500">
          Tarefas em Execução
        </h1>

        {/* Filtros lado a lado */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          {/* Filtro de data */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="filterDate"
              className="text-amber-400 text-xl font-bold mb-2"
            >
              Data de Entrega
            </label>
            <div className="flex items-center">
              <input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="ml-2 text-xs text-red-600 hover:underline"
                  aria-label="Limpar filtro de data"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Filtro de prioridade */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="filterPriority"
              className="text-amber-400 text-xl font-bold mb-2"
            >
              Prioridade
            </label>
            <div className="flex items-center">
              <select
                id="filterPriority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Todas</option>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
              {filterPriority && (
                <button
                  onClick={() => setFilterPriority("")}
                  className="ml-2 text-xs text-red-600 hover:underline"
                  aria-label="Limpar filtro de prioridade"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {filteredTasks.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Nenhuma tarefa encontrada para os filtros selecionados.
            </p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="relative w-full aspect-square flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <img
                  src="/postit2.png"
                  alt="Post-it"
                  className="w-full h-full object-cover shadow-lg rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <h2 className="text-lg font-bold text-center">
                    {task.title}
                  </h2>
                  <p className="text-sm mt-1">{task.description}</p>
                  <div className="text-xs mt-2 space-y-1">
                    <p>
                      <strong>Responsável:</strong> {task.taskGroupId}
                    </p>
                    <p>
                      <strong>Entrega:</strong>{" "}
                      {task.dueDate
                        ? new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(task.dueDate))
                        : "-"}
                    </p>
                    <p>
                      <strong>Prioridade:</strong>{" "}
                      {task.priority || "Não definida"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="text-xs rounded border border-gray-300 px-1 py-0.5"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="andamento">Andamento</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    aria-label={`Deletar tarefa ${task.title}`}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
