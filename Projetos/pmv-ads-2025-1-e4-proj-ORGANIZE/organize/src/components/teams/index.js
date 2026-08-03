"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  Crown,
  Award,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { api } from "../../Services/page";

const positionIcons = [
  { icon: Trophy, color: "text-yellow-500" },   // 1º
  { icon: Crown, color: "text-gray-400" },      // 2º
  { icon: Award, color: "text-orange-500" },    // 3º
];

export function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeamsWithTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const [teamRes, taskRes] = await Promise.all([
          api.get("/task-groups", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const teams = teamRes.data;
        const tasks = taskRes.data;

        const taskCounts = tasks.reduce((acc, task) => {
          const groupId = task.taskGroupId;
          if (groupId) {
            acc[groupId] = (acc[groupId] || 0) + 1;
          }
          return acc;
        }, {});

        const teamsWithCounts = teams.map((team) => ({
          ...team,
          taskCount: taskCounts[team._id] || 0,
        }));

        teamsWithCounts.sort((a, b) => b.taskCount - a.taskCount);
        setTeams(teamsWithCounts);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao buscar equipes ou tarefas.");
      }
    };

    fetchTeamsWithTasks();
  }, []);

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Ranking de Equipes
          </CardTitle>
          <Users className="ml-auto" />
        </div>
        <CardDescription>Mais tarefas atribuídas</CardDescription>
      </CardHeader>

      <CardContent>
        {teams.map((team, index) => {
          const IconData = positionIcons[index] || {
            icon: Star,
            color: "text-gray-300",
          };
          const Icon = IconData.icon;

          return (
            <article key={team._id} className="flex items-center gap-3 border-b py-2">
              <Icon className={`${IconData.color} w-5 h-5`} />
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  {team.name?.slice(0, 2).toUpperCase() || "EQ"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm sm:text-base font-semibold">
                  {team.name}
                </p>
                <span className="text-[12px] sm:text-sm text-gray-400">
                  {team.description || "Sem descrição"}
                </span>
                <p className="text-xs text-gray-500">
                  {team.taskCount} tarefa{team.taskCount !== 1 ? "s" : ""}
                </p>
              </div>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
