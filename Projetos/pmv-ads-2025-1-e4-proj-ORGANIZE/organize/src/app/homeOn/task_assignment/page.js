"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Select from "react-select";
import { api } from "../../../Services/page";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";

export default function TaskAssignment() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTasksAndTeams = async () => {
      try {
        const [tasksRes, teamsRes] = await Promise.all([
          api.get("/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/task-groups?created=true", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTasks(tasksRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
        alert(error.response?.data?.msg || "Erro ao buscar tarefas ou equipes");
      }
    };

    fetchTasksAndTeams();
  }, []);

  const handleSelectChange = (taskId, options) => {
    setSelectedOptions((prev) => ({ ...prev, [taskId]: options }));
  };

  const updatePriority = async (taskId, newPriority) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, priority: newPriority } : task
        )
      );
    } catch (error) {
      alert("Erro ao atualizar prioridade");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      alert("Erro ao deletar tarefa");
    }
  };

  const assignTeam = (taskId) => {
    const selected = selectedOptions[taskId];
    if (!selected || selected.length === 0) {
      alert("Selecione ao menos uma equipe para atribuir.");
      return;
    }

    const teamNames = selected.map((opt) => opt.value);
    console.log(`Atribuir ${taskId} para equipes:`, teamNames);
    // Aqui você pode chamar uma rota da API para salvar essa atribuição no backend.
  };

  const teamOptions = teams.map((team) => ({
    value: team.name,
    label: team.name,
  }));

  return (
    <main
      className={`sm:ml-14 p-4 flex flex-col items-center justify-start min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-gray-600" : "bg-amber-100 text-black"
      }`}
    >
      <div className="flex flex-col items-center text-center w-full max-w-6xl p-4">
        <img src="/logo.png" alt="Logo" className="mb-4 w-32 sm:w-40 h-auto" />
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-500">
          Atribuição de Tarefas
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="w-full aspect-square transform hover:scale-105 transition-all duration-200"
            >
              <div
                className={`rounded-xl shadow-lg p-4 flex flex-col gap-3 border-2 border-yellow-300 ${
                  theme === "dark" ? "bg-yellow-600/80 text-black" : "bg-yellow-200"
                }`}
                style={{
                  backgroundImage: `url('/postit2.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-lg font-bold">{task.title}</h2>
                <p className="text-sm italic">
                  {task.description || "Sem descrição"}
                </p>

                <Select
                  isMulti
                  options={teamOptions}
                  value={selectedOptions[task._id] || []}
                  onChange={(options) => handleSelectChange(task._id, options)}
                  classNamePrefix="custom-select"
                />

                <FormControl variant="filled" fullWidth>
                  <InputLabel>Prioridade</InputLabel>
                  <MuiSelect
                    value={task.priority || ""}
                    onChange={(e) => updatePriority(task._id, e.target.value)}
                  >
                    <MenuItem value="Alta">Alta</MenuItem>
                    <MenuItem value="Média">Média</MenuItem>
                    <MenuItem value="Baixa">Baixa</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl variant="filled" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <MuiSelect
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="andamento">Andamento</MenuItem>
                    <MenuItem value="concluido">Concluído</MenuItem>
                  </MuiSelect>
                </FormControl>

                <div className="flex flex-row justify-evenly items-center pt-2">
                  <Button variant="secondary" onClick={() => assignTeam(task._id)}>
                    Atribuir
                  </Button>
                  <Button variant="secondary">
                    <Link href={`./task_Edit?id=${task._id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
