"use client";

import React, { useState } from "react";

interface FormCadastroPromocaoProps {
  aplicarFiltros: (filtros: {
    alvo: "selecionados" | "todos";
    promocao: "Sim" | "Não";
    desconto: "5%" | "10%" | "15%" | "";
  }) => void;
  atualizarBase: () => void;
  onAplicar?: () => void;
}

const FormCadastroPromocao: React.FC<FormCadastroPromocaoProps> = ({
  aplicarFiltros,
  atualizarBase,
  onAplicar,
}) => {
  const [alvo, setAlvo] = useState<"selecionados" | "todos">("selecionados");
  const [promocao, setPromocao] = useState<"Sim" | "Não">("Não");
  const [desconto, setDesconto] = useState<"5%" | "10%" | "15%" | "">("");

  const handleAplicar = () => {
    console.log({ alvo, promocao, desconto });
    aplicarFiltros({ alvo, promocao, desconto });
    onAplicar?.();
  };

  const handleLimpar = () => {
    setAlvo("selecionados");
    setPromocao("Não");
    setDesconto("");
    aplicarFiltros({ alvo: "selecionados", promocao: "Não", desconto: "" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl shadow-md backdrop-blur-md">
      {/* Alvo */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Filtro</label>
        <select
          value={alvo}
          onChange={(e) => setAlvo(e.target.value as "selecionados" | "todos")}
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        >
          <option value="selecionados">Itens Selecionados</option>
          <option value="todos">Todos os Itens</option>
        </select>
      </div>

      {/* Promoção */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Promoção
        </label>
        <select
          value={promocao}
          onChange={(e) => setPromocao(e.target.value as "Sim" | "Não")}
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
        >
          <option value="Não">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </div>

      {/* Desconto */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Desconto
        </label>
        <select
          value={desconto}
          onChange={(e) =>
            setDesconto(e.target.value as "5%" | "10%" | "15%" | "")
          }
          className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 w-full"
          disabled={promocao === "Não"} // desabilita se promoção for "Não"
        >
          <option value="">Selecione</option>
          <option value="5%">5%</option>
          <option value="10%">10%</option>
          <option value="15%">15%</option>
        </select>
      </div>

      {/* Botões */}
      <div className="flex gap-2 items-end">
        <button
          type="button"
          onClick={handleAplicar}
          className="border p-2 rounded bg-green-600 text-white hover:bg-green-500 transition flex-1"
        >
          Aplicar
        </button>
        <button
          type="button"
          onClick={handleLimpar}
          className="border p-2 rounded bg-gray-400 text-white hover:bg-gray-300 transition flex-1"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={atualizarBase}
          className="border p-2 rounded bg-red-600 text-white hover:bg-red-500 transition flex-1"
        >
          Atualizar Base
        </button>
      </div>
    </div>
  );
};

export default FormCadastroPromocao;
