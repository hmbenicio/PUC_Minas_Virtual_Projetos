"use client";

import React from "react";
import ImageSelect from "./ui/imageSelect";
import type { Item, TipoProduto } from "./TabelaItensCadastro";
import { TAMANHOS_POR_TIPO, TIPOS_PRODUTO } from "./TabelaItensCadastro";

interface FormCadastroProdutoProps {
  form: Item;
  setForm: React.Dispatch<React.SetStateAction<Item>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  modoEdicao?: boolean;
  cancelarEdicao?: () => void;
}

// Array com src e label customizado
const imagensDisponiveis = [
  { src: "product_1.png", label: "Produto 1" },
  { src: "product_2.png", label: "Produto 2" },
  { src: "ads2.png", label: "Produto 3" },
  { src: "ads3.png", label: "Produto 4" },
];

const FormCadastroProduto: React.FC<FormCadastroProdutoProps> = ({
  form,
  setForm,
  handleSubmit,
  loading = false,
  modoEdicao = false,
  cancelarEdicao,
}) => {
  const tamanhosDisponiveis = form.tipo
    ? TAMANHOS_POR_TIPO[form.tipo as TipoProduto] ?? []
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "tipo") {
      setForm((prev) => ({
        ...prev,
        tipo: value as TipoProduto | "",
        tamanho: "",
      }));
    } else if (name === "estampa") {
      setForm((prev) => ({ ...prev, estampa: value === "Sim" }));
    } else if (type === "number") {
      const sanitized = value.replace(",", ".").trim();
      const numericValue = sanitized === "" ? 0 : Number(sanitized);
      const safeValue = Number.isNaN(numericValue) ? 0 : numericValue;

      setForm((prev) => {
        switch (name) {
          case "preco":
            return { ...prev, preco: safeValue };
          case "quantidade":
            return {
              ...prev,
              quantidade: Math.max(0, Math.floor(safeValue)),
            };
          case "precoPromo":
            return { ...prev, precoPromo: safeValue };
          default:
            return prev;
        }
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fecha dropdown ao clicar fora ou apertar ESC
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-white/50 dark:bg-neutral-800/50 p-6 rounded-2xl shadow-md backdrop-blur-md"
    >
      {/* Coluna 1 */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome do Produto"
          required
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        />

        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        >
          <option value="">Tipo do produto</option>
          {TIPOS_PRODUTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <select
          name="tamanho"
          value={form.tamanho || ""}
          onChange={handleChange}
          required
          disabled={!form.tipo}
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            {form.tipo ? "Selecione o tamanho" : "Escolha um tipo primeiro"}
          </option>
          {tamanhosDisponiveis.map((tam) => (
            <option key={tam} value={tam}>
              {tam}
            </option>
          ))}
        </select>

        <select
          name="estampa"
          value={form.estampa ? "Sim" : "Nao"}
          onChange={handleChange}
          required
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        >
          <option value="">Estampa (Sim ou Nao)</option>
          <option value="Sim">Sim</option>
          <option value="Nao">Nao</option>
        </select>
      </div>

      {/* Coluna 2 */}
      <div className="flex flex-col gap-4">
        <input
          type="number"
          name="preco"
          value={form.preco || ""}
          onChange={handleChange}
          placeholder="Preco (R$)"
          required
          step="0.01"
          min="0"
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        />

        <input
          type="number"
          name="quantidade"
          value={form.quantidade || ""}
          onChange={handleChange}
          placeholder="Quantidade"
          required
          step="1"
          min="0"
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        />

        {/* Select customizado de imagens */}
        <ImageSelect
          value={form.imagem}
          onChange={(src) => setForm((prev) => ({ ...prev, imagem: src }))}
          options={imagensDisponiveis}
        />

        {/* Botoes */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            type="submit"
            disabled={loading}
            className={`border p-2 rounded text-white transition w-full ${
              modoEdicao
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-green-600 hover:bg-green-500"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Salvando..."
              : modoEdicao
              ? "Salvar Alteracoes"
              : "Cadastrar Produto"}
          </button>

          {modoEdicao && cancelarEdicao && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="border p-2 rounded bg-gray-400 hover:bg-gray-500 text-white transition w-full"
            >
              Cancelar Edicao
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormCadastroProduto;

