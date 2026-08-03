"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Background_Home from "../../assets/Background_Home6.jpg";
import Logo from "../../assets/Logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = "/api/proxy";

const extractDigits = (value: string): string => value.replace(/\D/g, "");

const formatCPF = (value: string): string => {
  const digits = extractDigits(value).slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);

  let formatted = part1;
  if (part2) formatted += `.${part2}`;
  if (part3) formatted += `.${part3}`;
  if (part4) formatted += `-${part4}`;

  return formatted;
};

const formatPhone = (value: string): string => {
  const digits = extractDigits(value).slice(0, 11);
  if (!digits) return "";

  if (digits.length < 2) return `(${digits}`;
  if (digits.length === 2) return `(${digits}) `;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCEP = (value: string): string => {
  const digits = extractDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

type Endereco = {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
};

type ConsentimentoDados = {
  termosDeUso: boolean;
  politicaDePrivacidade: boolean;
};

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
  endereco: Endereco;
  consentimentoDados: ConsentimentoDados;
};

export default function CreateUser() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    endereco: {
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    consentimentoDados: {
      termosDeUso: false,
      politicaDePrivacidade: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lastFetchedCep, setLastFetchedCep] = useState("");

  const fetchAddressByCep = async (cepDigits: string) => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepDigits}/json/`
      );
      if (!response.ok) {
        throw new Error("CEP invalido");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP nao encontrado");
      }

      setFormData((prev) => {
        if (extractDigits(prev.endereco.cep) !== cepDigits) {
          return prev;
        }

        return {
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro || "",
            cidade: data.localidade || "",
            estado: (data.uf || "").toUpperCase(),
          },
        };
      });
      setError("");
    } catch {
      setLastFetchedCep("");
      setFormData((prev) => {
        if (extractDigits(prev.endereco.cep) !== cepDigits) {
          return prev;
        }

        return {
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: "",
            cidade: "",
            estado: "",
          },
        };
      });
      setError("Nao foi possivel localizar o CEP. Preencha manualmente.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setError("");
    const { name, value, checked } = e.target as HTMLInputElement;

    if (name === "cpf") {
      setFormData((prev) => ({ ...prev, cpf: formatCPF(value) }));
      return;
    }

    if (name === "telefone") {
      setFormData((prev) => ({ ...prev, telefone: formatPhone(value) }));
      return;
    }

    if (name === "endereco.cep") {
      const digits = extractDigits(value);
      const formattedCep = formatCEP(value);

      setFormData((prev) => {
        const updated = {
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: formattedCep,
          },
        };

        if (digits.length < 8) {
          updated.endereco.rua = "";
          updated.endereco.cidade = "";
          updated.endereco.estado = "";
        }

        return updated;
      });

      if (digits.length === 8) {
        if (digits !== lastFetchedCep) {
          setLastFetchedCep(digits);
          void fetchAddressByCep(digits);
        }
      } else {
        setLastFetchedCep("");
      }

      return;
    }

    if (["nome", "email", "senha"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: value } as FormData));
      return;
    }

    if (
      [
        "endereco.rua",
        "endereco.numero",
        "endereco.cidade",
        "endereco.estado",
      ].includes(name)
    ) {
      const key = name.split(".")[1] as keyof Endereco;
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [key]: value },
      }));
      return;
    }

    if (
      [
        "consentimentoDados.termosDeUso",
        "consentimentoDados.politicaDePrivacidade",
      ].includes(name)
    ) {
      const key = name.split(".")[1] as keyof ConsentimentoDados;
      setFormData((prev) => ({
        ...prev,
        consentimentoDados: { ...prev.consentimentoDados, [key]: checked },
      }));
      return;
    }
  };

    const validateClient = (): string | null => {
    if (formData.nome.trim().length < 3)
      return "Nome deve ter ao menos 3 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "E-mail invalido.";
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf))
      return "CPF deve estar no formato XXX.XXX.XXX-XX.";

    const phoneDigits = extractDigits(formData.telefone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11)
      return "Telefone deve conter 10 ou 11 digitos numericos.";

    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!senhaForteRegex.test(formData.senha))
      return "Senha deve ter ao menos 8 caracteres, com maiuscula, minuscula, numero e especial (@$!%*?&).";

    const { rua, numero, cidade, estado, cep } = formData.endereco;
    if (!rua || !numero || !cidade || !estado || !cep)
      return "Preencha todos os campos de endereco.";
    if (!/^([A-Z]{2})$/.test(estado.toUpperCase()))
      return "Estado (UF) deve ter 2 letras, ex: MG.";
    if (!/^\d{5}-\d{3}$/.test(cep))
      return "CEP deve estar no formato XXXXX-XXX.";

    if (
      !formData.consentimentoDados.termosDeUso ||
      !formData.consentimentoDados.politicaDePrivacidade
    )
      return "E necessario aceitar os termos e a politica de privacidade.";

    return null;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateClient();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        telefone: extractDigits(formData.telefone),
      };
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMsg =
          (data && (data.message || data.error)) || "Falha ao criar usuário.";
        throw new Error(apiMsg);
      }

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Erro ao conectar ao servidor.");
      } else {
        setError("Erro ao conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
      <Image
        src={Background_Home}
        alt="Fundo do E-commerce"
        fill
        priority
        className="object-cover"
      />

      <div className="hidden md:flex" />

      <div className="relative flex items-center justify-center bg-white/70 p-4">
        <div className="z-10 bg-white/50 shadow-lg rounded-2xl w-full max-w-3xl p-6 border border-red-200/40 backdrop-blur-xl">
          <div className="flex justify-center mb-0">
            <Image src={Logo} alt="Logo E-commerce" width={180} height={70} />
          </div>

          <h1 className="text-xl font-bold text-center text-red-800 mt-2">
            Criar conta
          </h1>
          <p className="text-center text-red-700 text-sm mb-3">
            Preencha os dados abaixo para se cadastrar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-red-800 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex.: Maria Cliente"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  maxLength={14}
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  maxLength={15}
                  inputMode="tel"
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    placeholder="Use 8+ caracteres com maiuscula, minuscula, numero e especial"
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-red-300/40 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-red-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-red-800">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-[20%_60%_17%] gap-3">
                <input
                  type="text"
                  name="endereco.cep"
                  value={formData.endereco.cep}
                  onChange={handleChange}
                  placeholder="CEP"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <input
                  type="text"
                  name="endereco.rua"
                  value={formData.endereco.rua}
                  onChange={handleChange}
                  placeholder="Rua"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <input
                  type="text"
                  name="endereco.numero"
                  value={formData.endereco.numero}
                  onChange={handleChange}
                  placeholder="Nº"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="endereco.cidade"
                  value={formData.endereco.cidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                  className="w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <input
                  type="text"
                  name="endereco.estado"
                  value={formData.endereco.estado}
                  onChange={handleChange}
                  placeholder="UF"
                  className="uppercase w-full px-3 py-2 rounded-lg border border-red-300/40 bg-white/60 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Consentimentos */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm text-red-800">
                <input
                  type="checkbox"
                  name="consentimentoDados.termosDeUso"
                  checked={formData.consentimentoDados.termosDeUso}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                Li e aceito os Termos de Uso
              </label>

              <label className="flex items-center gap-2 text-sm text-red-800">
                <input
                  type="checkbox"
                  name="consentimentoDados.politicaDePrivacidade"
                  checked={formData.consentimentoDados.politicaDePrivacidade}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                Concordo com a Política de Privacidade
              </label>
            </div>

            {/* Mensagens */}
            {error && (
              <p className="text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center font-medium">
                {success}
              </p>
            )}

            {/* Ações */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-red-600/90 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Criar conta"}
              </button>
              <button
                type="button"
                className="flex-1 border border-red-300/40 rounded-lg bg-white/40 hover:bg-white/60 text-red-700 font-medium py-2"
                onClick={() => router.push("/")}
              >
                Já tenho conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
