"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useTheme } from "next-themes";

// Services
import { api } from "../../../Services/page";

export default function Task_create() {
  const [date, setDate] = useState(new Date());
  const [teams, setTeams] = useState([{}]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAllTeams = async () => {
      try {
        const response = await api.get("/task-groups?created=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.log("Erro ao buscar equipes", error);
        alert(error.response?.data?.msg || "Erro ao buscar equipes");
      }
    };

    getAllTeams();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setTeamId("");
    setDate(new Date());
  };

  const createTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!title || !description || !priority || !teamId) {
      return alert("Por favor, preencha todos os campos obrigatórios.");
    }

    try {
      const response = await api.post(
        "/tasks",
        {
          title,
          description,
          dueDate: date,
          priority,
          taskGroupId: teamId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Tarefa criada com sucesso!");
        resetForm();
        console.log(response);
      }
    } catch (error) {
      console.log("Erro ao criar tarefa", error);
      alert(error.response?.data?.msg || "Erro ao criar tarefa");
    }
  };

  const { theme } = useTheme();

  const inputStyle =
    theme === "dark" ? "bg-gray-700 text-white" : "bg-[#ffbf00] text-black";

  return (
    <main
      className={`sm:ml-14 p-4 h-screen ${
        theme === "light" ? "bg-amber-100" : ""
      }`}
    >
      <form
        onSubmit={createTask}
        className={`flex flex-col justify-center items-center rounded-xl lg:w-1/2 md:w-3/4 mx-auto my-auto md:h-2/3 sm:h-2/3 h-2/3 bg-[url('/postit2.png')] bg-center bg-cover relative`}
      >
        <fieldset className="md:text-4xl sm:text-[25px] text-[25px] font-bold md:mb-2 text-start text-black">
          Criar tarefa
        </fieldset>
        <hr className="w-1/2" />

        <Input
          placeholder="Título"
          type="text"
          className={`my-5 lg:w-2/3 md:w-1/2 sm:w-1/2 w-1/2 md:text-base bg-amber-50 ${inputStyle}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Descrição"
          type="text"
          className={`mb-5 lg:w-2/3 md:w-1/2 sm:w-1/2 w-1/2 md:text-base bg-amber-50 ${inputStyle}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex md:flex-row gap-5 sm:flex-col flex-col">
          <Select onValueChange={(value) => setTeamId(value)} value={teamId}>
            <SelectTrigger
              style={{
                color: theme === "dark" ? "white" : "black",
                backgroundColor: theme === "dark" ? "#444" : "#ffbf00",
              }}
              className="lg:w-1/2 md:w-1/2 sm:w-full w-full"
            >
              {teamId
                ? teams.find((team) => team._id === teamId)?.name
                : "Equipe responsável"}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {teams.map((team, index) => (
                  <SelectItem key={index} value={team._id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => setPriority(value)}
            value={priority}
          >
            <SelectTrigger
              style={{
                color: theme === "dark" ? "white" : "black",
                backgroundColor: theme === "dark" ? "#444" : "#ffbf00",
              }}
              className="lg:w-1/2 md:w-1/2 sm:w-full w-full"
            >
              {priority || "Prioridade da tarefa"}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Data de vencimento"
            className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
              theme === "dark"
                ? "bg-[#444] text-white"
                : "bg-[#ffbf00] text-black"
            }`}
          />
        </div>

        <div className="flex flex-row mt-3">
          <button
            type="submit"
            className="bg-[#ffbf00] hover:bg-[#ffd191] transition py-2 px-4 rounded-md text-black font-bold"
          >
            Criar tarefa
          </button>
        </div>
      </form>
    </main>
  );
}
