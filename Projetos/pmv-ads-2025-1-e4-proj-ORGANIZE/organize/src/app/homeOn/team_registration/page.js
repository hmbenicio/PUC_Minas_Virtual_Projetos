"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";

// Services
import { api } from "../../../Services/page";

export default function TeamRegistration() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [tokenCod, setTokenCod] = useState("");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/task-groups",
        {
          name: teamName,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Equipe cadastrada com sucesso!");
        setTeamName("");
        setDescription("");
        console.log(response);
      }
    } catch (error) {
      console.log("Erro ao cadastrar o usuário", error);
      alert(error.response.data.msg);
    }
  };

  const myStyle = {
    backgroundImage: `url("/postit2.png")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "65px",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main
      className={`h-screen flex justify-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-amber-100 text-black"
      }`}
    >
      {/* Lado direito: Formulário */}
      <div className="flex flex-col justify-center">
        {/* Formulário de Cadastro de Equipe */}
        <div
          style={myStyle}
          className={
            theme === "dark"
              ? "bg-gray-900 text-gray-600"
              : "bg-amber-100 text-black"
          }
        >
          <fieldset
            className={`md:text-5xl sm:text-3xl text-3xl font-bold mb-4 text-center ${
              theme === "dark" ? "text-yellow-500" : "text-yellow-800"
            }`}
          >
            Cadastre sua Equipe
          </fieldset>
          <hr />
          <Input
            type="text"
            placeholder="Nome da Equipe"
            id="teamName"
            name="teamName"
            className={`border p-2 rounded-md text-sm/5 ${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
            }`}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <Textarea
            placeholder="Descrição da equipe"
            className={`${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
            }`}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-row justify-center items-center mt-3">
            <button
              onClick={handleSubmit}
              className={`${
                theme === "dark"
                  ? "bg-yellow-500 hover:bg-yellow-400"
                  : "bg-[#ffbf00] hover:bg-[#ffd191]"
              } transition py-2 px-4 rounded-md text-yellow-800 font-bold`}
            >
              CADASTRAR EQUIPE
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
