"use client";

import React, { useState, useEffect } from "react";
import LayoutHome from "@/components/LayoutHome";
import FormCadastroPromocao from "@/components/FormCadastroPromocao";
import TabelaItensPromo, { Item } from "@/components/TabelaItensPromo";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const ITENS_POR_PAGINA = 20;
const API_BASE_URL = "/api/proxy";

type FiltrosPromocao = {
  alvo: "selecionados" | "todos";
  promocao: "Sim" | "Não";
  desconto: "5%" | "10%" | "15%" | "";
};

const PromoProdutos: React.FC = () => {
  const [itens, setItens] = useState<Item[]>([]);
  const [role, setRole] = useState<string>("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<FiltrosPromocao>({
    alvo: "todos",
    promocao: "Sim",
    desconto: "",
  });

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Buscar itens do backend
  const fetchItens = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      setItens(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message || "Erro ao carregar itens"
          : "Erro ao carregar itens"
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
    fetchItens();
  }, []);

  const handleAplicarFiltros = (novosFiltros: FiltrosPromocao) => {
    setFiltros(novosFiltros);
  };

  const handleAvisoAplicar = () => {
    setError("");
    setSuccess(
      'Promoção aplicada aos filtros. Clique em "Atualizar Base" para confirmar no sistema.'
    );
  };

  // Atualizar base: aplica promoções
  const atualizarBase = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("userToken");
      const descontoNum =
        filtros.desconto === "5%"
          ? 0.05
          : filtros.desconto === "10%"
          ? 0.1
          : filtros.desconto === "15%"
          ? 0.15
          : 0;
      const promoBol = filtros.promocao == "Sim" ? true : false;

      const itensParaAtualizar = itens
        .filter((item) =>
          filtros.alvo === "todos" ? true : selecionados.includes(item._id!)
        )
        .map((item) => ({
          ...item,
          promo: promoBol,
          precoPromo: Number((item.preco * (1 - descontoNum)).toFixed(2)),
        }));

      for (const item of itensParaAtualizar) {
        await fetch(`${API_BASE_URL}/products/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            promo: item.promo,
            precoPromo: item.precoPromo,
          }),
        });
      }

      setSuccess("Promoções aplicadas com sucesso!");
      fetchItens();
      setSelecionados([]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message || "Falha ao atualizar promoções"
          : "Falha ao atualizar promoções"
      );
    } finally {
      setLoading(false);
    }
  };

  // Remover promoções
  const removerPromocoes = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("userToken");
      const itensParaRemover = itens.filter((item) =>
        filtros.alvo === "todos" ? true : selecionados.includes(item._id!)
      );

      for (const item of itensParaRemover) {
        await fetch(`${API_BASE_URL}/products/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            promo: false,
            precoPromo: undefined,
          }),
        });
      }

      setSuccess("Promoções removidas com sucesso!");
      fetchItens();
      setSelecionados([]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message || "Falha ao remover promoções"
          : "Falha ao remover promoções"
      );
    } finally {
      setLoading(false);
    }
  };

  // Paginação
  const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
  const itensPaginaAtual = itens.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(itens.length / ITENS_POR_PAGINA);

  return (
    <LayoutHome role={role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        GERENCIAMENTO DE PROMOÇÕES
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

      <FormCadastroPromocao
        aplicarFiltros={handleAplicarFiltros}
        atualizarBase={atualizarBase}
        onAplicar={handleAvisoAplicar}
        removerPromocoes={removerPromocoes}
      />

      <div className="mt-8">
        <TabelaItensPromo
          itens={itensPaginaAtual}
          selecionados={selecionados}
          onSelecionarItens={setSelecionados}
          filtros={filtros}
          loading={loading}
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

export default PromoProdutos;
