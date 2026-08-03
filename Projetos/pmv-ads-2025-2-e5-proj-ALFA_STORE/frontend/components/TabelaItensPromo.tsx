"use client";

import React, { useEffect, useState } from "react";
import { TIPOS_PRODUTO, resolveTipoDescricao, type TipoProduto, type TipoProdutoCodigo } from "./TabelaItensCadastro";

const normalizeText = (value: string | null | undefined) =>
  value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
    : "";

export interface Item {
  _id?: string;
  nome: string;
  tipo: TipoProduto | TipoProdutoCodigo | "";
  tamanho: string;
  estampa: boolean;
  preco: number;
  quantidade: number;
  promo?: boolean;
  precoPromo?: number;
}

interface TabelaItensPromoProps {
  itens: Item[];
  selecionados: string[];
  onSelecionarItens: (ids: string[]) => void;
  loading?: boolean;
}

const TabelaItensPromo: React.FC<TabelaItensPromoProps> = ({
  itens,
  selecionados,
  onSelecionarItens,
  loading = false,
}) => {
  const [localItens, setLocalItens] = useState<Item[]>([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTamanho, setFiltroTamanho] = useState("");
  const [filtroEstampa, setFiltroEstampa] = useState("");

  useEffect(() => {
    setLocalItens(itens);
    setSelecionarTodos(
      itens.length > 0 && itens.every((i) => selecionados.includes(i._id!))
    );
  }, [itens, selecionados]);

  const toggleSelecionado = (_id?: string) => {
    if (!_id) return;
    if (selecionados.includes(_id)) {
      onSelecionarItens(selecionados.filter((i) => i !== _id));
    } else {
      onSelecionarItens([...selecionados, _id]);
    }
  };

  const toggleSelecionarTodos = () => {
    if (selecionarTodos) {
      onSelecionarItens([]);
      setSelecionarTodos(false);
    } else {
      onSelecionarItens(itens.map((i) => i._id!));
      setSelecionarTodos(true);
    }
  };

  // Funções auxiliares
  const getEstampa = (value: boolean) => (value ? "Sim" : "Não");
  const normalizedFiltroTipo = normalizeText(filtroTipo);
  const normalizedBusca = busca.toLowerCase();

  const itensFiltrados = localItens.filter((item) => {
    const matchBusca = item.nome.toLowerCase().includes(normalizedBusca);
    const matchTipo = normalizedFiltroTipo
      ? normalizeText(resolveTipoDescricao(item.tipo)) === normalizedFiltroTipo
      : true;
    const matchTamanho = filtroTamanho ? item.tamanho === filtroTamanho : true;
    const matchEstampa =
      filtroEstampa !== ""
        ? filtroEstampa === "true"
          ? item.estampa === true
          : item.estampa === false
        : true;

    return matchBusca && matchTipo && matchTamanho && matchEstampa;
  });

  return (
    <div className="overflow-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6">
      {/* 🔎 Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_PRODUTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <select
          value={filtroTamanho}
          onChange={(e) => setFiltroTamanho(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="">Todos tamanhos</option>
          {[...new Set(itens.map((i) => i.tamanho))].map((tam) => (
            <option key={tam} value={tam}>
              {tam}
            </option>
          ))}
        </select>
        <select
          value={filtroEstampa}
          onChange={(e) => setFiltroEstampa(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="">Com/sem estampa</option>
          <option value="true">Com estampa</option>
          <option value="false">Sem estampa</option>
        </select>
      </div>

      <table className="min-w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-gray-300/60 text-gray-800 uppercase text-sm tracking-wide">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selecionarTodos}
                onChange={toggleSelecionarTodos}
              />
            </th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Tamanho</th>
            <th className="px-4 py-2">Estampa</th>
            <th className="px-4 py-2">Preço</th>
            <th className="px-4 py-2">Quantidade</th>
            <th className="px-4 py-2">Promoção</th>
            <th className="px-4 py-2">Preço Promoção</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500 italic">
                Carregando produtos...
              </td>
            </tr>
          ) : itensFiltrados.length > 0 ? (
            itensFiltrados.map((item) => (
              <tr key={item._id} className="hover:bg-amber-100/60 transition">
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(item._id!)}
                    onChange={() => toggleSelecionado(item._id)}
                  />
                </td>
                <td className="px-4 py-2">{item.nome}</td>
                <td className="px-4 py-2">
                  {resolveTipoDescricao(item.tipo)}
                </td>
                <td className="px-4 py-2">{item.tamanho}</td>
                <td className="px-4 py-2">{getEstampa(item.estampa)}</td>
                <td className="px-4 py-2 text-green-700 font-semibold">
                  R$ {item.preco.toFixed(2)}
                </td>
                <td className="px-4 py-2">{item.quantidade}</td>
                <td className="px-4 py-2 text-center">
                  {item.promo
                    ? `${Math.round(
                        ((item.preco -
                          (item.precoPromo != null ? item.precoPromo : 0)) /
                          item.preco) *
                          100
                      )}%`
                    : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.precoPromo ? `R$ ${item.precoPromo.toFixed(2)}` : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500 italic">
                Nenhum item encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaItensPromo;
