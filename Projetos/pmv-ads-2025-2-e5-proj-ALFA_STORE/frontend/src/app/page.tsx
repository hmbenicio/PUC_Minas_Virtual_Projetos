"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Background_Home from "../assets/Background_Home6.jpg";
import Logo from "../assets/Logo.png";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import useQuadHdMobile from "@/lib/hooks/useQuadHdMobile";

const API_BASE_URL = "/api/proxy";

type SocialProvider = "google" | "facebook";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
};

type FacebookAuthResponse = {
  accessToken: string;
  userID: string;
  expiresIn: number;
};

type FacebookLoginStatus = {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
};

declare global {
  interface Window {
    FB?: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginStatus) => void,
        options?: Record<string, unknown>
      ) => void;
      getLoginStatus: (
        callback: (response: FacebookLoginStatus) => void
      ) => void;
    };
    fbAsyncInit?: () => void;
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (options: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: GoogleTokenResponse) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const [googleSdkReady, setGoogleSdkReady] = useState(false);
  const [facebookSdkReady, setFacebookSdkReady] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null
  );
  const isMobileQuadHd = useQuadHdMobile();

  const isGoogleDisabled =
    !googleSdkReady || !googleClientId || socialLoading !== null;
  const isFacebookDisabled =
    !facebookSdkReady || !facebookAppId || socialLoading !== null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!googleClientId) return;

    const handleGoogleScriptLoad = () => {
      if (window.google?.accounts?.oauth2) {
        setGoogleSdkReady(true);
      }
    };

    if (window.google?.accounts?.oauth2) {
      setGoogleSdkReady(true);
      return;
    }

    const existingScript = document.getElementById("google-oauth");
    if (existingScript) {
      existingScript.addEventListener("load", handleGoogleScriptLoad);
      return () => {
        existingScript.removeEventListener("load", handleGoogleScriptLoad);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-oauth";
    script.onload = handleGoogleScriptLoad;
    script.onerror = () => {
      setError(
        "Não foi possível carregar o SDK do Google. Tente novamente em instantes."
      );
    };
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleGoogleScriptLoad);
    };
  }, [googleClientId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!facebookAppId) return;

    if (window.FB) {
      setFacebookSdkReady(true);
      return;
    }

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: false,
        version: "v20.0",
      });
      setFacebookSdkReady(true);
    };

    const scriptId = "facebook-jssdk";
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://connect.facebook.net/pt_BR/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError(
        "Não foi possível carregar o SDK do Facebook. Tente novamente em instantes."
      );
    };
    document.body.appendChild(script);
  }, [facebookAppId]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const LOGIN_URL = `${API_BASE_URL}/users/login`;
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const userRole = data.user?.role ?? "";
        const userId =
          data.user?._id ??
          data.user?.id ??
          data.user?.userId ??
          data.user?.sub ??
          "";

        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", userRole);

        if (userId) {
          localStorage.setItem("userId", userId);
        } else {
          localStorage.removeItem("userId");
        }

        router.push("/home");
      } else {
        setError(
          data.message || "Falha na autenticação. Verifique suas credenciais."
        );
      }
    } catch {
      setError("Falha na comunicação com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeSocialLogin = useCallback(
    async (provider: SocialProvider, accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/social-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, accessToken }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message ||
              "Não foi possível validar o login social. Tente novamente."
          );
        }

        if (!data?.token || !data?.user) {
          throw new Error(
            "Resposta inválida do servidor ao concluir o login social."
          );
        }

        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.user.role ?? "cliente");
        localStorage.setItem("userName", data.user.nome ?? "");
        localStorage.removeItem("socialLoginProvider");
        localStorage.removeItem("socialProfile");
        localStorage.removeItem("socialAccessToken");

        setError("");
        router.push("/home");
      } catch (storageError) {
        console.error("Erro ao concluir login social:", storageError);
        const message =
          storageError instanceof Error
            ? storageError.message
            : "Não foi possível finalizar o login social. Tente novamente.";
        setError(message);
      } finally {
        setSocialLoading(null);
      }
    },
    [router]
  );

  const handleGoogleLogin = useCallback(() => {
    if (socialLoading) return;

    if (!googleClientId) {
      setError(
        "A aplicação não está configurada com as credenciais do Google."
      );
      return;
    }

    if (!googleSdkReady || !window.google?.accounts?.oauth2) {
      setError(
        "O SDK do Google ainda está carregando. Aguarde um instante e tente novamente."
      );
      return;
    }

    setError("");
    setSocialLoading("google");

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: async (tokenResponse: GoogleTokenResponse) => {
          if (tokenResponse.error) {
            setError("Não foi possível concluir o login com o Google.");
            setSocialLoading(null);
            return;
          }

          await finalizeSocialLogin("google", tokenResponse.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (err) {
      console.error("Erro ao iniciar login com o Google:", err);
      setError("Não foi possível iniciar o login com o Google.");
      setSocialLoading(null);
    }
  }, [finalizeSocialLogin, googleClientId, googleSdkReady, socialLoading]);

  const handleFacebookLogin = useCallback(() => {
    if (socialLoading) return;

    if (!facebookAppId) {
      setError(
        "A aplicação não está configurada com as credenciais do Facebook."
      );
      return;
    }

    if (!facebookSdkReady || !window.FB) {
      setError(
        "O SDK do Facebook ainda está carregando. Aguarde um instante e tente novamente."
      );
      return;
    }

    setError("");
    setSocialLoading("facebook");

    try {
      window.FB.login(
        async (response: FacebookLoginStatus) => {
          if (response.status !== "connected" || !response.authResponse) {
            setError("Login com o Facebook não foi autorizado.");
            setSocialLoading(null);
            return;
          }

          await finalizeSocialLogin(
            "facebook",
            response.authResponse.accessToken
          );
        },
        { scope: "public_profile,email" }
      );
    } catch (err) {
      console.error("Erro ao iniciar login com o Facebook:", err);
      setError("Não foi possível iniciar o login com o Facebook.");
      setSocialLoading(null);
    }
  }, [facebookAppId, facebookSdkReady, finalizeSocialLogin, socialLoading]);

  const containerClasses = isMobileQuadHd
    ? "relative flex min-h-screen flex-col"
    : "relative min-h-screen overflow-hidden md:grid md:grid-cols-2";

  const panelClasses = isMobileQuadHd
    ? "relative z-10 flex flex-1 items-center justify-center px-4 py-10"
    : "relative flex items-center justify-center bg-white/80 px-4 py-10 sm:px-10 md:px-6";

  const cardClasses = isMobileQuadHd
    ? "gpu-fix z-10 w-full max-w-lg rounded-3xl border border-red-200/50 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl"
    : "gpu-fix z-10 w-full max-w-md rounded-2xl border border-red-200/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:max-w-lg sm:p-8";

  const titleClasses = isMobileQuadHd
    ? "text-center text-3xl font-bold text-red-800"
    : "text-center text-2xl font-bold text-red-800 sm:text-3xl";

  const subtitleClasses = isMobileQuadHd
    ? "mb-6 text-center text-base text-red-700"
    : "mb-6 text-center text-sm text-red-700 sm:text-base";

  const formClasses = isMobileQuadHd ? "space-y-6" : "space-y-4 sm:space-y-5";

  const inputPadding = isMobileQuadHd
    ? "px-5 py-3 text-base"
    : "px-4 py-2 text-sm";

  const submitButtonClasses = isMobileQuadHd
    ? "w-full bg-red-600/90 hover:bg-red-700 text-white font-semibold py-3 px-4 text-base rounded-lg transition disabled:opacity-50 flex justify-center items-center"
    : "w-full bg-red-600/90 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 flex justify-center items-center";

  const socialStackClasses = isMobileQuadHd
    ? "flex flex-col gap-3"
    : "flex flex-col gap-3 sm:flex-row sm:gap-4";

  return (
    <div className={containerClasses}>
      {/* 🔸 Imagem de fundo única */}
      <Image
        src={Background_Home}
        alt="Fundo do E-commerce"
        fill
        priority
        className="object-cover gpu-fix"
      />
      <div className="absolute inset-0 bg-black/40 md:hidden" aria-hidden />

      {/* 🔸 Coluna esquerda — opaca */}
      <div className="hidden md:flex" />

      {/* 🔸 Coluna direita translúcida */}
      <div className={panelClasses}>
        {/* 🔸 Card de login (apenas largura aumentada) */}
        <div className={cardClasses}>
          <div className="mb-4 flex justify-center sm:mb-6">
            <Image
              src={Logo}
              alt="Logo E-commerce"
              width={220}
              height={80}
              className="h-auto w-36 sm:w-52"
            />
          </div>

          <h1 className={titleClasses}>Bem-vindo de volta</h1>
          <p className={subtitleClasses}>
            Faça login para continuar suas compras
          </p>

          <form onSubmit={handleSubmit} className={formClasses}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-red-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className={`w-full rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none ${inputPadding}`}
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-red-800 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua senha"
                  className={`w-full pr-10 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none ${inputPadding}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-red-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <p className="text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-red-700 hover:underline transition">
                Esqueceu sua senha?
              </a>
            </div>

            <button
              type="submit"
              className={submitButtonClasses}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Login Social */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-red-300/50"></div>
            <span className="px-3 text-sm text-red-700">ou continue com</span>
            <div className="flex-grow h-px bg-red-300/50"></div>
          </div>

          <div className={socialStackClasses}>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleDisabled}
              className={`flex-1 flex items-center justify-center gap-2 py-2 border border-red-300/40 rounded-lg bg-white/30 hover:bg-white/50 backdrop-blur-sm transition ${
                isGoogleDisabled
                  ? "opacity-60 cursor-not-allowed hover:bg-white/30"
                  : ""
              }`}
              title={
                googleClientId
                  ? undefined
                  : "Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID para habilitar o login com Google."
              }
            >
              {socialLoading === "google" ? (
                <svg
                  className="animate-spin h-4 w-4 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaGoogle className="text-lg" />
              )}
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isFacebookDisabled}
              className={`flex-1 flex items-center justify-center gap-2 py-2 border border-red-300/40 rounded-lg bg-white/30 hover:bg-white/50 backdrop-blur-sm transition ${
                isFacebookDisabled
                  ? "opacity-60 cursor-not-allowed hover:bg-white/30"
                  : ""
              }`}
              title={
                facebookAppId
                  ? undefined
                  : "Configure NEXT_PUBLIC_FACEBOOK_APP_ID para habilitar o login com Facebook."
              }
            >
              {socialLoading === "facebook" ? (
                <svg
                  className="animate-spin h-4 w-4 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaFacebookF className="text-lg" />
              )}
              <span className="text-sm">Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-red-700 mt-6">
            Não tem uma conta? Crie aqui{" "}
            <a
              href="/createUser"
              className="text-red-600 hover:underline font-medium"
            >
              Cadastre-se
            </a>
          </p>
          <p className="text-center text-xs text-red-700 mt-2">
            Desenvolvedores:{" "}
            <a href="/docs/users" className="text-red-600 hover:underline">
              Documentação da API de Usuários.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
