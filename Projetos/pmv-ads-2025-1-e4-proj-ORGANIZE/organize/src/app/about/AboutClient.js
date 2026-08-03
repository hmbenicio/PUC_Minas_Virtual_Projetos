"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function AboutClient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main
      className={`sm:ml-14 p-4 min-h-screen flex flex-col items-center justify-center text-center px-4 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-600"
          : "bg-amber-100 text-black"
      }`}
    >
      <img src="/logo.png" alt="Logo" className="mb-4 w-48 h-auto" />
      <h1 className="text-6xl font-bold mb-4  text-slate-500">OrgaNize</h1>
      <p className="text-3xl font-bold mb-4  text-slate-500">
        Organize seu dia do jeito mais nice!
      </p>
      <p className="text-3xl font-bold mb-4  text-slate-500">Sobre o sistema</p>

      <div className="relative max-w-xl p-8 rounded-lg shadow-lg">
        <img
          src="/postit.png"
          alt="Post-it"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90 rounded-lg"
        />
        <div className="relative z-10">
          <p className="text-base leading-relaxed text-black text-justify font-medium">
            Em um ambiente corporativo, a organização e a gestão eficiente de
            tarefas são essenciais para o sucesso. Muitas empresas enfrentam
            desafios relacionados à desorganização e à má gestão de atividades,
            o que pode comprometer a produtividade e os resultados. Pensando
            nisso, o OrgaNize foi desenvolvido para oferecer uma solução
            eficiente, permitindo que equipes organizem, priorizem e acompanhem
            suas tarefas de forma estruturada, melhorando o fluxo de trabalho e
            a tomada de decisões.
          </p>
        </div>
      </div>
    </main>
  );
}
