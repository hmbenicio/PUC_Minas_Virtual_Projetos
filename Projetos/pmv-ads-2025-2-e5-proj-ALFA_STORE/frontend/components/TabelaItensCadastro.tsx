"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // ✅ Import dos ícones

export const TIPOS_PRODUTO = [
  "New Baby",
  "Infantil",
  "Adulto Feminino",
  "Adulto Masculino",
] as const;

export type TipoProduto = (typeof TIPOS_PRODUTO)[number];

export const TIPO_SIGLA_PARA_LABEL = {
  M: "Adulto Masculino",
  F: "Adulto Feminino",
  I: "Infantil",
  E: "New Baby",
} as const satisfies Record<string, TipoProduto>;

export type TipoProdutoCodigo = keyof typeof TIPO_SIGLA_PARA_LABEL;

export const TAMANHOS_POR_TIPO: Record<TipoProduto, string[]> = {
  "New Baby": ["17'8", "19", "20", "21", "22"],
  Infantil: ["23-24", "25-26", "27-28", "29-30", "31-32", "33-34"],
  "Adulto Feminino": ["33-34", "35-36", "37-38", "39-40", "41-42"],
  "Adulto Masculino": [
    "35-36",
    "37-38",
    "39-40",
    "41-42",
    "43-44",
    "45-46",
  ],
};

export const resolveTipoDescricao = (
  tipo: TipoProduto | TipoProdutoCodigo | "" | null | undefined
): string => {
  if (!tipo) return "";
  return TIPO_SIGLA_PARA_LABEL[tipo as TipoProdutoCodigo] ?? tipo;
};

const normalizeText = (value: string | null | undefined) =>
  value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
    : "";

export interface Item {
  _id: string;
  nome: string;
  tipo: TipoProduto | TipoProdutoCodigo | "";
  imagem: string;
  tamanho: string;
  estampa: boolean;
  preco: number;
  quantidade: number;
  promo?: boolean;
  precoPromo?: number;
}

interface TabelaItensCadastroProps {
  itens: Item[];
  loading?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
}

const TabelaItensCadastro: React.FC<TabelaItensCadastroProps> = ({
  itens,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTamanho, setFiltroTamanho] = useState("");
  const [filtroEstampa, setFiltroEstampa] = useState("");

  const getTipo = (tipo: TipoProduto | TipoProdutoCodigo | "") => {
    const descricao = resolveTipoDescricao(tipo);
    return descricao !== "" ? descricao : "-";
  };

  const getEstampa = (value: boolean) => (value ? "Sim" : "Não");

  const normalizedFiltroTipo = normalizeText(filtroTipo);
  const normalizedBusca = busca.toLowerCase();

  const itensFiltrados = itens.filter((item) => {
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

  const mostrarPrecoPromo = (
    preco: number,
    precoPromo?: number,
    temPromo: boolean = false
  ) => {
    if (!temPromo) return "-";
    return (
      <>
        <span className="text-green-600 font-medium">
          R$ {precoPromo?.toFixed(2)}
        </span>
        <span className="block text-xs text-gray-500 line-through">
          R$ {preco.toFixed(2)}
        </span>
      </>
    );
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6">
      {/* 🔎 Área de busca e filtros */}
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

      {/* 🧾 Tabela */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-300/60 text-gray-800 uppercase text-sm tracking-wide">
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Tamanho</th>
              <th className="px-4 py-2 text-left">Estampa</th>
              <th className="px-4 py-2 text-left">Preço</th>
              <th className="px-4 py-2 text-left">Quantidade</th>
              <th className="px-4 py-2 text-center">Promoção</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Carregando produtos...
                </td>
              </tr>
            ) : itensFiltrados.length > 0 ? (
              itensFiltrados.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-white/60" : "bg-gray-100/70"
                  } hover:bg-amber-100/60 transition`}
                >
                  <td className="px-4 py-2 font-semibold text-gray-900">
                    {item.nome}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {getTipo(item.tipo)}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{item.tamanho}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {getEstampa(item.estampa)}
                  </td>
                  <td className="px-4 py-2 text-green-700 font-semibold">
                    R$ {item.preco.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{item.quantidade}</td>
                  <td className="px-4 py-2 text-center text-gray-800">
                    {mostrarPrecoPromo(item.preco, item.precoPromo, item.promo)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-3 text-gray-500 italic"
                >
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaItensCadastro;

