"use client";

import React, { useState, useEffect } from "react";
import LayoutHome from "@/components/LayoutHome";
import TabelaItensCadastro, {
  Item,
  TipoProduto,
  TIPOS_PRODUTO,
} from "@/components/TabelaItensCadastro";
import FormCadastroProduto from "@/components/FormCadastroProduto";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const ITENS_POR_PAGINA = 10;
const API_BASE_URL = "/api/proxy";

const TIPO_TO_CODE: Record<TipoProduto, "M" | "F" | "I" | "E"> = {
  "Adulto Masculino": "M",
  "Adulto Feminino": "F",
  Infantil: "I",
  "New Baby": "E",
};

const CODE_TO_TIPO: Record<string, TipoProduto> = {
  M: "Adulto Masculino",
  F: "Adulto Feminino",
  I: "Infantil",
  E: "New Baby",
};

const normalizarTipo = (valor: unknown): TipoProduto | "" => {
  if (typeof valor === "string") {
    const match =
      CODE_TO_TIPO[valor] ?? CODE_TO_TIPO[valor.toUpperCase() as string];
    if (match) return match;
    if ((TIPOS_PRODUTO as readonly string[]).includes(valor as TipoProduto)) {
      return valor as TipoProduto;
    }
  }
  return "";
};

const normalizarBooleano = (valor: unknown): boolean => {
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "string") {
    const lower = valor.toLowerCase();
    const semAcento = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower === "true" || semAcento === "sim" || lower === "1") return true;
    if (
      lower === "false" ||
      semAcento === "nao" ||
      lower === "0" ||
      lower === "n"
    )
      return false;
  }
  if (typeof valor === "number") return valor !== 0;
  return Boolean(valor);
};

const normalizarNumero = (valor: unknown): number => {
  if (valor === null || valor === undefined || valor === "") return 0;
  const numero = Number(valor);
  return Number.isNaN(numero) ? 0 : numero;
};

type ProdutoApi = {
  _id?: unknown;
  id?: unknown;
  nome?: unknown;
  tipo?: unknown;
  imagem?: unknown;
  tamanho?: unknown;
  estampa?: unknown;
  preco?: unknown;
  quantidade?: unknown;
  promo?: unknown;
  precoPromo?: unknown;
};

const asString = (valor: unknown): string =>
  typeof valor === "string" ? valor : "";

const normalizarProduto = (produto: ProdutoApi): Item => {
  const id =
    typeof produto?._id === "string" && produto._id
      ? produto._id
      : typeof produto?.id === "string"
      ? produto.id
      : "";

  const preco = normalizarNumero(produto?.preco);
  const precoPromoBruto =
    produto?.precoPromo === null || produto?.precoPromo === undefined
      ? 0
      : normalizarNumero(produto?.precoPromo);

  return {
    _id: id,
    nome: asString(produto?.nome) || "Produto sem nome",
    tipo: normalizarTipo(produto?.tipo),
    imagem: asString(produto?.imagem),
    tamanho: asString(produto?.tamanho),
    estampa: normalizarBooleano(produto?.estampa),
    preco,
    quantidade: Math.max(0, Math.floor(normalizarNumero(produto?.quantidade))),
    promo: normalizarBooleano(produto?.promo),
    precoPromo: precoPromoBruto,
  };
};

const CadastroProdutos: React.FC = () => {
  const [itens, setItens] = useState<Item[]>([]);
  const [role, setRole] = useState<string>("");
  const [form, setForm] = useState<Item>({
    _id: "",
    nome: "",
    tipo: "",
    imagem: "",
    tamanho: "",
    estampa: false,
    preco: 0,
    quantidade: 0,
    promo: false,
    precoPromo: 0,
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Buscar produtos do backend
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("userToken")
          : null;

      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao carregar produtos");
      }

      // Caso a API retorne { products: [...] }, usar data.products
      const produtos = Array.isArray(data) ? data : data?.products;
      const itensNormalizados = (produtos || []).map((produto: ProdutoApi) =>
        normalizarProduto(produto)
      );
      setItens(itensNormalizados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError(
        error instanceof Error
          ? error.message || "Erro ao carregar produtos"
          : "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");

    const determinedRole: "admin" | "cliente" =
      roleFromStorage === "admin" ? "admin" : "cliente";

    setRole(determinedRole);
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, []);

  // 🔹 Submeter produto (criar ou editar)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (form.promo && form.precoPromo && form.precoPromo >= form.preco) {
        throw new Error("Preço promocional deve ser menor que o preço normal.");
      }

      const method = modoEdicao ? "PUT" : "POST";
      const endpoint = modoEdicao ? `/products/${form._id}` : "/products";
      const tipoParaEnvio = form.tipo
        ? TIPO_TO_CODE[form.tipo as TipoProduto] ?? form.tipo
        : form.tipo;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("userToken")
          : null;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: form.nome,
          tipo: tipoParaEnvio,
          imagem: form.imagem,
          tamanho: form.tamanho,
          estampa: form.estampa,
          preco: form.preco,
          quantidade: form.quantidade,
          promo: form.promo,
          precoPromo: form.promo ? form.precoPromo : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const validationMessage =
          Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors[0]?.message
            : null;
        throw new Error(
          validationMessage || data.message || "Erro ao salvar produto"
        );
      }

      const produtoRetornado = data?.product ?? data;
      const produtoNormalizado = normalizarProduto(produtoRetornado);
      const produtoId = produtoNormalizado._id || form._id;

      if (modoEdicao) {
        setItens((prev) =>
          prev.map((p) => (p._id === produtoId ? produtoNormalizado : p))
        );
        setSuccess("Produto atualizado com sucesso!");
      } else {
        setItens((prev) => [...prev, produtoNormalizado]);
        setSuccess("Produto cadastrado com sucesso!");
      }

      // limpar form
      setForm({
        _id: "",
        nome: "",
        tipo: "",
        imagem: "",
        tamanho: "",
        estampa: false,
        preco: 0,
        quantidade: 0,
        promo: false,
        precoPromo: 0,
      });
      setModoEdicao(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setError(
        error instanceof Error
          ? error.message || "Falha ao salvar produto"
          : "Falha ao salvar produto"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Deletar produto
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("userToken")
          : null;

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao excluir produto");

      setItens((prev) => prev.filter((p) => p._id !== id));
      setSuccess("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setError(
        error instanceof Error
          ? error.message || "Falha ao excluir produto"
          : "Falha ao excluir produto"
      );
    } finally {
      setLoading(false);
    }
  };

  // Editar produto
  const handleEdit = (item: Item) => {
    setForm(normalizarProduto(item));
    setModoEdicao(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Paginação
  const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
  const itensPaginaAtual = itens.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(itens.length / ITENS_POR_PAGINA);

  return (
    <LayoutHome role={role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        CADASTRO DE PRODUTOS
      </h1>

      {error && (
        <p className="text-red-500 font-medium mb-4 bg-red-50 border border-red-200 p-2 rounded-lg">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 font-medium mb-4 bg-green-50 border border-green-200 p-2 rounded-lg">
          {success}
        </p>
      )}

      <FormCadastroProduto
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
        modoEdicao={modoEdicao}
        cancelarEdicao={() => {
          setForm({
            _id: "",
            nome: "",
            tipo: "",
            imagem: "",
            tamanho: "",
            estampa: false,
            preco: 0,
            quantidade: 0,
            promo: false,
            precoPromo: 0,
          });
          setModoEdicao(false);
        }}
      />
      <br />
      <br />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        ESTOQUE DE PRODUTOS CADASTRADOS
      </h1>
      <div className="mt-8 relative">
        <TabelaItensCadastro
          itens={itensPaginaAtual}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {itens.length > ITENS_POR_PAGINA && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() =>
                  paginaAtual > 1 && setPaginaAtual(paginaAtual - 1)
                }
              />

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      isActive={num === paginaAtual}
                      onClick={() => setPaginaAtual(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationNext
                onClick={() =>
                  paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1)
                }
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </LayoutHome>
  );
};

export default CadastroProdutos;
