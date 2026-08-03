"use client";

import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

export default function GeralSettings() {
  const { setTheme, theme } = useTheme();

  return (
    <main className="sm:ml-14 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
        <p className="text-muted-foreground text-sm">
          Ajuste preferências globais do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="text-primary" />
            <CardTitle>Parâmetros do Sistema</CardTitle>
          </div>
          <CardDescription>
            Defina idioma, fuso horário, tema e notificações.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Idioma */}
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select defaultValue="pt-BR">
              <SelectTrigger>
                <SelectValue placeholder="Selecione um idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                <SelectItem value="es-ES">Espanhol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fuso horário */}
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Input
              placeholder="Ex: America/Sao_Paulo"
              defaultValue="America/Sao_Paulo"
            />
          </div>

          {/* Tema */}
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select
              defaultValue={theme || "system"}
              onValueChange={(value) => setTheme(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Automático (Sistema)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notificações */}
          <div className="flex items-center justify-between">
            <Label>Exibir notificações no topo</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Ativar som para alertas</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
