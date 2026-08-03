"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { api } from "../../../Services/page"; // ajuste o path conforme seu projeto

export default function TaskCompleted() {
  const [modalData, setModalData] = useState(null);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const openModal = (tarefa) => setModalData(tarefa);
  const closeModal = () => setModalData(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
      try {
        // Busca todas as tarefas sem filtro
        const response = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // params removido para buscar tudo
        });

        // Filtra só as tarefas com status 'concluido' no frontend
        const concluidas = response.data.filter(
          (tarefa) => tarefa.status === "concluido"
        );

        setTarefasConcluidas(concluidas);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
        alert("Erro ao buscar tarefas.");
      }
    };

    fetchTasks();
  }, []);

  if (!mounted) return null;

  return (
    <main
      className={`sm:ml-14 p-4 flex items-center justify-center min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-600"
          : "bg-amber-100 text-black"
      }`}
    >
      <div className="flex flex-col items-center text-center w-full max-w-6xl p-4">
        <img src="/logo.png" alt="Logo" className="mb-4 w-32 sm:w-40 h-auto" />
        <h1 className="text-3xl sm:text-5xl font-bold mb-6  text-slate-500">
          Tarefas Concluídas
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {tarefasConcluidas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Nenhuma tarefa concluída encontrada.
            </p>
          )}

          {tarefasConcluidas.map((tarefa, index) => (
            <div
              key={tarefa._id || index}
              onClick={() => openModal(tarefa)}
              className="relative w-full aspect-square flex items-center justify-center cursor-pointer"
            >
              <div className="relative w-full h-full">
                <img
                  src="/postit2.png"
                  alt="Post-it"
                  className="w-full h-full object-cover shadow-lg rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <h2 className="text-lg font-bold text-center">
                    {tarefa.title || tarefa.titulo}
                  </h2>
                  <p className="text-sm mt-1">
                    {tarefa.description || tarefa.descricao}
                  </p>
                  <div className="text-xs mt-2 space-y-1">
                    <p>
                      <strong>Responsável:</strong>{" "}
                      {tarefa.person || tarefa.pessoa}
                    </p>
                    <p>
                      <strong>Área:</strong> {tarefa.area}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {tarefa.dueDate
                        ? new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(tarefa.dueDate))
                        : tarefa.data}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-lg max-h-screen overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-2xl font-bold text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <div className="text-2xl text-yellow-400 font-bold mb-2">
              {modalData.title || modalData.titulo}
            </div>
            <div className="text-md mb-2">
              {modalData.description || modalData.descricao}
            </div>
            <div className="text-md mb-2">
              <strong>Responsável:</strong>{" "}
              {modalData.person || modalData.pessoa}
            </div>
            <div className="text-md mb-2">
              <strong>Área:</strong> {modalData.area}
            </div>
            <div className="text-md mb-2">
              <strong>Descrição:</strong>{" "}
              {modalData.fullDescription || modalData.descricaoCompleta}
            </div>
            <div className="text-md">
              <strong>Data de conclusão:</strong>{" "}
              {modalData.dueDate
                ? new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(modalData.dueDate))
                : modalData.data}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
