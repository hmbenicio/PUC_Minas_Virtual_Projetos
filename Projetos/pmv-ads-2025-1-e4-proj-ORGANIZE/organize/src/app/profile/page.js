"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    role: "",
    birthdate: "",
    email: "",
    newEmail: "",
    confirmEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setMounted(true);

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3001/organize/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar perfil");
        }

        const user = await response.json();

        setForm((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          bio: user.bio || "",
          birthdate: user.birthdate ? user.birthdate.slice(0, 10) : "",
        }));
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    setIsUpdating(true);
    setTimeout(() => {
      alert("Perfil atualizado!");
      setIsUpdating(false);
    }, 1000);
  };

  const handleUpdateSecurity = () => {
    setIsUpdating(true);
    setTimeout(() => {
      alert("Dados de segurança atualizados!");
      setIsUpdating(false);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 py-8 ${
        theme === "dark" ? "bg-gray-900 text-black" : "bg-amber-100 text-black"
      }`}
    >
      <div className="w-full max-w-6xl bg-amber-50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
        <Tabs
          defaultValue="profile"
          className="flex flex-col md:flex-row min-h-[600px]"
        >
          {/* Lado esquerdo */}
          <div className="md:w-1/4 flex flex-col items-center p-6 space-y-4">
            {/* Foto e Upload */}
            <div className="h-28 w-28 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-gray-600 text-sm font-medium select-none">
                  Foto
                </span>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm file:bg-yellow-400 file:text-gray-800 file:px-3 file:py-1 file:rounded-md file:border-0 cursor-pointer w-full"
            />

            {/* Card com imagem do post-it */}
            <Card
              className="w-full max-w-xs flex flex-col items-center justify-center mt-4 rounded-lg shadow-md text-center"
              style={{
                backgroundImage: 'url("/postit.png")',
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "250px",
                padding: "1rem",
              }}
            >
              <p className="text-xl font-bold text-gray-800 mt-6">
                {form.name || "Seu nome"}
              </p>
              <p className="text-md text-gray-700">{form.role || "Cargo"}</p>

              <TabsList className="flex flex-col items-center mt-2 space-y-2 bg-transparent shadow-none">
                <TabsTrigger value="profile" className="text-center">
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="security" className="text-center">
                  Segurança
                </TabsTrigger>
              </TabsList>
            </Card>
          </div>

          {/* Conteúdo das tabs */}
          <div className="flex-1 p-6 space-y-6">
            <TabsContent value="profile">
              <Card className="p-6 space-y-4 bg-yellow-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Informações Pessoais
                </h2>
                <div className="text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-800" htmlFor="name">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800" htmlFor="role">
                      Cargo
                    </Label>
                    <Input
                      id="role"
                      value={form.role}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800" htmlFor="birthdate">
                      Nascimento
                    </Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={form.birthdate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800" htmlFor="email">
                      E-mail Atual
                    </Label>
                    <Input
                      id="email"
                      value={form.email}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-800" htmlFor="bio">
                    Biografia
                  </Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                    className="text-gray-600"
                  />
                </div>
                <Button
                  className="mt-4 bg-amber-400 hover:bg-amber-300 text-gray-800"
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6 space-y-6 bg-yellow-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Segurança da Conta
                </h2>
                <div className="space-y-4">
                  <Label className="text-gray-800">Novo E-mail</Label>
                  <Input
                    id="newEmail"
                    value={form.newEmail}
                    onChange={handleChange}
                    placeholder="Novo e-mail"
                  />
                  <Input
                    id="confirmEmail"
                    value={form.confirmEmail}
                    onChange={handleChange}
                    placeholder="Confirmar novo e-mail"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-800">Alterar Senha</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Senha atual"
                  />
                  <Input
                    id="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Nova senha"
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmar nova senha"
                  />
                </div>
                <Button
                  className="mt-4 bg-amber-400 hover:bg-amber-300 text-gray-800"
                  onClick={handleUpdateSecurity}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Atualizando..." : "Atualizar Segurança"}
                </Button>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
