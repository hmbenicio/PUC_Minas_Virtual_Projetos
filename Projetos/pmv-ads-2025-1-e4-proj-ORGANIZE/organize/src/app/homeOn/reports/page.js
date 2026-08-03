"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ChartOverview } from "@/components/chart";
import { Teams } from "@/components/teams";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutList, ListTodo, ListChecks, Logs } from "lucide-react";
import { api } from "@/Services/page";

export default function Report() {
  const { theme } = useTheme();

  const [total, setTotal] = useState(0);
  const [andamento, setAndamento] = useState(0);
  const [concluidas, setConcluidas] = useState(0);
  const [naoIniciadas, setNaoIniciadas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data;
        setTotal(tasks.length);
        setAndamento(tasks.filter((t) => t.status === "andamento").length);
        setConcluidas(tasks.filter((t) => t.status === "concluido").length);
        setNaoIniciadas(tasks.filter((t) => t.status === "pendente").length);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
        alert("Erro ao buscar tarefas.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const renderCount = (value) =>
    loading ? (
      <Skeleton className="h-6 w-12 rounded-md" />
    ) : (
      <span className="transition-opacity duration-300 opacity-100">
        {value}
      </span>
    );

  return (
    <main className={`sm:ml-14 p-4 ${
      theme === "light" ? "bg-amber-100" : ""
    }`}>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Relatório de Tarefas
      </h1>
      <div>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle>Criadas</CardTitle>
                <LayoutList className="ml-auto" />
              </div>
              <CardDescription>Total de Tarefas</CardDescription>
              <CardContent className="text-base sm:text-lg font-bold">
                {renderCount(total)}
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle>Andamento</CardTitle>
                <ListTodo className="ml-auto" />
              </div>
              <CardDescription>Total de Tarefas</CardDescription>
              <CardContent className="text-base sm:text-lg font-bold">
                {renderCount(andamento)}
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle>Concluídas</CardTitle>
                <ListChecks className="ml-auto" />
              </div>
              <CardDescription>Total de Tarefas</CardDescription>
              <CardContent className="text-base sm:text-lg font-bold">
                {renderCount(concluidas)}
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle>Não iniciadas</CardTitle>
                <Logs className="ml-auto" />
              </div>
              <CardDescription>Total de Tarefas</CardDescription>
              <CardContent className="text-base sm:text-lg font-bold">
                {renderCount(naoIniciadas)}
              </CardContent>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-4 flex flex-col md:flex-row gap-4">
          <ChartOverview />
          <Teams />
        </section>
      </div>
    </main>
  );
}
