"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from "react";

interface ImagemItem {
  src: string;
  label: string;
}

interface ImageSelectProps {
  value?: string;
  onChange: (src: string) => void;
  options: ImagemItem[];
}

const ImageSelect: React.FC<ImageSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora ou apertar ESC
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setDropdownAberto(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownAberto(false);
    };
    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (!dropdownAberto) {
      setSearchTerm("");
    }
  }, [dropdownAberto]);

  const filteredOptions = options.filter((img) =>
    img.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={selectRef}>
      {/* Botão do select */}
      <div
        className="border p-2 rounded bg-white/70 dark:bg-neutral-700/60 cursor-pointer flex items-center justify-between"
        onClick={() => setDropdownAberto((prev) => !prev)}
        style={{ zIndex: 10000 }}
      >
        {value ? (
          <div className="flex items-center gap-2">
            <img
              src={value}
              alt="Selecionada"
              className="w-16 h-16 object-cover border rounded"
            />
            <span>{options.find((i) => i.src === value)?.label}</span>
          </div>
        ) : (
          <span>Selecione uma imagem</span>
        )}
        <span className="ml-2">&#9662;</span>
      </div>

      {/* Dropdown horizontal */}
      {dropdownAberto && (
        <div className="absolute bg-white dark:bg-neutral-700 border rounded shadow-lg mt-1 z-50 w-full p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Pesquisar imagem por nome"
            className="w-full mb-2 rounded border border-gray-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
          <div className="flex gap-2 overflow-x-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((img) => (
                <div
                  key={img.src}
                  className="flex-shrink-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-600 p-1 rounded"
                  onClick={() => {
                    onChange(img.src);
                    setDropdownAberto(false);
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-20 h-20 object-cover border rounded mb-1"
                  />
                  <div className="text-center text-sm">{img.label}</div>
                </div>
              ))
            ) : (
              <div className="w-full py-4 text-center text-sm text-gray-500 dark:text-neutral-300">
                Nenhuma imagem encontrada
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelect;
