"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function HomeOn() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const apps = [
    { name: "CRIAR TAREFA", icon: "📝", link: "homeOn/task_create" },
    { name: "TAREFAS EM ANDAMENTO", icon: "⏳", link: "homeOn/task_progress" },
    { name: "TAREFAS CONCLUÍDAS", icon: "✅", link: "homeOn/task_completed" },
    {
      name: "CADASTRO DE EQUIPES",
      icon: "👥",
      link: "homeOn/team_registration",
    },
    {
      name: "ATRIBUIÇÃO DE TAREFAS",
      icon: "📋",
      link: "homeOn/task_assignment",
    },
    { name: "RELATÓRIOS", icon: "📊", link: "homeOn/reports" },
    { name: "EQUIPES", icon: "🫂", link: "homeOn/teams" },
  ];

  return (
    <main
      className={`sm:ml-14 p-4 flex items-center justify-center min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-600"
          : "bg-amber-100 text-black"
      }`}
    >
      <div className="flex flex-col items-center text-center w-full max-w-4xl p-4">
        <img src="/logo.png" alt="Logo" className="mb-4 w-48 h-auto" />
        <h1 className="text-6xl font-bold mb-4 text-slate-500">OrgaNize</h1>
        <p className="text-3xl font-bold mb-4 text-slate-500">
          Organize seu dia do jeito mais nice!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full justify-center">
          {apps.map((app, index) => (
            <a
              key={index}
              href={app.link}
              className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <img
                  src="postit2.png"
                  alt="Post-it"
                  className="w-full h-full object-cover shadow-lg rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  <span className="text-5xl mb-2 drop-shadow-md">
                    {app.icon}
                  </span>
                  <span className="text-lg font-semibold text-black text-center drop-shadow-md">
                    {app.name}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
