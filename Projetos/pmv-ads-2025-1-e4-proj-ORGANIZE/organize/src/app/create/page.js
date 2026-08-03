"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../Services/page";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import { FaMicrosoft } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function Create() {
  const router = useRouter();
  const { theme } = useTheme();

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [resEmpty, setResEmpty] = useState(true);
  const [resEmail, setResEmail] = useState(true);
  const [resPassword, setRespassword] = useState(true);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Email2, setEmail2] = useState("");
  const [Password, setPassword] = useState("");
  const [Password2, setPassword2] = useState("");

  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
  const handleMouseDownPassword1 = (event) => event.preventDefault();
  const handleMouseUpPassword1 = (event) => event.preventDefault();
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword2 = (event) => event.preventDefault();
  const handleMouseUpPassword2 = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Name === "" ||
      Email === "" ||
      Email2 === "" ||
      Password === "" ||
      Password2 === ""
    ) {
      setResEmpty(false);
      return;
    } else {
      setResEmpty(true);
    }

    if (Email !== Email2) {
      setResEmail(false);
      return;
    } else {
      setResEmail(true);
    }

    if (Password !== Password2) {
      setRespassword(false);
      return;
    } else {
      setRespassword(true);
    }

    try {
      const response = await api.post("/user", {
        name: Name,
        email: Email,
        password: Password,
      });

      if (response.status === 201) {
        alert("Usuário cadastrado com sucesso!");
        setName("");
        setEmail("");
        setEmail2("");
        setPassword("");
        setPassword2("");
        router.push("/login");
      }
    } catch (error) {
      console.log("Erro ao cadastrar o usuário", error);
      alert(error.response?.data?.msg || "Erro ao cadastrar.");
    }
  };

  return (
    <main
      className={`text-amber-400 min-h-screen flex flex-col ${
        theme === "light" ? "bg-amber-100" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row w-full md:w-4/5 lg:w-3/4 h-auto m-auto">
        <div className="bg-gradient-to-r from-amber-400 to-gray-3500 flex flex-col items-center justify-center text-center mx-auto sm:w-full md:w-1/2 rounded-l-lg">
          <div className="flex flex-col justify-center items-center px-4 py-6">
            <img
              src="/logo.png"
              alt="Logo OrgaNize"
              className="mb-4 w-50 h-auto"
            />
            <h1 className="text-6xl font-bold mb-4 text-center text-slate-500">
              OrgaNize
            </h1>
            <p className="text-3xl font-bold mb-8 text-center text-slate-500">
              Organize seu dia do jeito mais nice!
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-full md:w-[60%] lg:w-[50%] p-5 gap-10 my-auto">
          <div className="flex flex-col justify-center items-center gap-2">
            <a
              className="flex flex-row h-[50px] gap-2 border w-full max-w-[340px] p-2 rounded-md justify-center items-center"
              href=""
            >
              <FcGoogle className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl" />
              <span className="text-sm sm:text-2xl md:text-[20px] font-bold text-slate-500">
                Cadastre-se pelo Google
              </span>
            </a>
            <a
              className="flex flex-row h-[50px] gap-2 border w-full max-w-[340px] p-2 rounded-md justify-center items-center"
              href=""
            >
              <ImFacebook2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl" />
              <span className="text-sm sm:text-2xl md:text-[20px] font-bold text-slate-500">
                Cadastre-se pelo Facebook
              </span>
            </a>
            <a
              className="flex flex-row h-[50px] gap-2 border w-full max-w-[340px] p-2 rounded-md justify-center items-center"
              href=""
            >
              <FaMicrosoft className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl" />
              <span className="text-sm sm:text-2xl md:text-[20px] font-bold text-slate-500">
                Cadastre-se pela Microsoft
              </span>
            </a>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <fieldset className="text-3xl sm:text-3xl md:text-6xl font-bold mb-4 text-center text-slate-500">
              Cadastre-se
            </fieldset>
            <Input
              autoComplete="off"
              type="text"
              placeholder="Nome completo"
              id="name"
              name="name"
              className="bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 text-sm/5"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
            <Input
              autoComplete="off"
              type="email"
              placeholder="Email (exemplo: user123@gmail.com)"
              id="email"
              name="email"
              className="bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 text-sm/5"
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
            />
            <Input
              autoComplete="off"
              type="email"
              placeholder="Confirme email"
              id="confirmEmail"
              name="confirmEmail"
              className="bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 text-sm/5"
              onChange={(e) => setEmail2(e.target.value)}
              value={Email2}
            />

            <div className="flex lg:flex-row md:flex-row sm:flex-col flex-col gap-2">
              <OutlinedInput
                className={cn(
                  "file:border bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 text-sm/5 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-gray-600 border-input flex h-9 w-lg-[45%] w-md-[45%] w-sm-[80%] w-[100%]"
                )}
                placeholder="Digite sua senha"
                type={showPassword1 ? "text" : "password"}
                id="password1"
                name="password1"
                onChange={(e) => setPassword(e.target.value)}
                value={Password}
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword1}
                      onMouseDown={handleMouseDownPassword1}
                      onMouseUp={handleMouseUpPassword1}
                      edge="end"
                    >
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <OutlinedInput
                className={cn(
                  "file:border bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 text-sm/5 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-gray-600 border-input flex h-9 w-lg-[45%] w-md-[45%] w-sm-[80%] w-[100%]"
                )}
                placeholder="Confirme sua senha"
                type={showPassword2 ? "text" : "password"}
                id="password2"
                name="password2"
                onChange={(e) => setPassword2(e.target.value)}
                value={Password2}
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      onMouseDown={handleMouseDownPassword2}
                      onMouseUp={handleMouseUpPassword2}
                      edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>

            {!resEmpty && (
              <p className="text-red-500">
                Por favor, preencha todos os campos.
              </p>
            )}
            {!resEmail && (
              <p className="text-red-500">Os emails não coincidem.</p>
            )}
            {!resPassword && (
              <p className="text-red-500">As senhas não coincidem.</p>
            )}

            <button
              className="p-2 rounded bg-amber-400 text-gray-800 font-bold hover:bg-amber-500 transition-colors"
              type="submit"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
