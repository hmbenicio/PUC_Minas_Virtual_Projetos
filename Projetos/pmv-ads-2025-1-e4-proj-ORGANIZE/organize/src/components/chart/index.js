"use client";

import { useEffect, useState } from "react";
import { ChartColumnBig } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, CartesianGrid, XAxis, BarChart } from "recharts";
import { api } from "../../Services/page"; // ajuste o caminho se necessário

export function ChartOverview() {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState([]);

  const chartConfig = {
    alta: {
      label: "Alta",
      color: "#EB7575",
    },
    media: {
      label: "Media",
      color: "#60a5fa",
    },
    baixa: {
      label: "Baixa",
      color: "#5CCB5F",
    },
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        const statusMap = {
          andamento: "Andamento",
          concluido: "Concluídas",
          pendente: "Não Iniciadas",
        };

        const summary = {
          Andamento: { alta: 0, media: 0, baixa: 0 },
          Concluídas: { alta: 0, media: 0, baixa: 0 },
          "Não Iniciadas": { alta: 0, media: 0, baixa: 0 },
        };

        data.forEach((task) => {
          const status = statusMap[task.status];
          const prioridade = task.priority?.toLowerCase(); // Ex: "alta", "media", "baixa"
          if (
            status &&
            summary[status] &&
            prioridade &&
            summary[status][prioridade] !== undefined
          ) {
            summary[status][prioridade]++;
          }
        });

        const generatedChartData = Object.entries(summary).map(
          ([status, values]) => ({
            task: status,
            alta: values.alta,
            media: values.media,
            baixa: values.baixa,
          })
        );

        setChartData(generatedChartData);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        alert("Erro ao buscar tarefas.");
      }
    };

    fetchTasks();
  }, []);

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Overview Tarefas
          </CardTitle>
          <ChartColumnBig className="ml-auto" />
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="task"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="alta" fill="var(--color-alta)" radius={4} />
            <Bar dataKey="media" fill="var(--color-media)" radius={4} />
            <Bar dataKey="baixa" fill="var(--color-baixa)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
