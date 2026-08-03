"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

import LayoutHome from "@/components/LayoutHome";
import {
  Item,
  TIPOS_PRODUTO,
  resolveTipoDescricao,
} from "@/components/TabelaItensCadastro";
import { SELECTED_PRODUCT_KEY, addOrIncrementCartItem } from "@/lib/cart";
import useQuadHdMobile from "@/lib/hooks/useQuadHdMobile";

const ads = [
  { id: 1, title: "Promoção Imperdível!", image: "/ads1.png" },
  { id: 2, title: "Novas Coleções 2025", image: "/ads2.png" },
  {
    id: 3,
    title: "Frete Grátis em Compras Acima de R$100",
    image: "/ads3.png",
  },
];

const imagemFixa = "/image.png";
const ITENS_POR_PAGINA = 10;

const resolveProductImage = (imagem?: string | null): string => {
  if (!imagem) return imagemFixa;

  const trimmed = imagem.trim();
  if (trimmed === "" || trimmed === "Imagem_01") return imagemFixa;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const normalizeText = (value: string | null | undefined) =>
  value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
    : "";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [role, setRole] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const router = useRouter();
  const isMobileQuadHd = useQuadHdMobile();

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTamanho, setFiltroTamanho] = useState("");
  const [filtroEstampa, setFiltroEstampa] = useState("");

  const API_BASE_URL = "/api/proxy";

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    const determinedRole = roleFromStorage === "admin" ? "admin" : "cliente";
    setRole(determinedRole);

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + ads.length) % ads.length);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % ads.length);
  const goToSlide = (index: number) => setActiveSlide(index);

  // 🔹 Buscar produtos do backend
  const fetchProdutos = async () => {
    try {
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

      const produtos = Array.isArray(data) ? data : data.products;
      setItens(produtos || []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // 🔹 Filtragem
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

  // 🔹 Paginação
  const totalPaginas = Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA);

  const handleComprar = (selectedItem: Item) => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        SELECTED_PRODUCT_KEY,
        JSON.stringify(selectedItem)
      );
    } catch (error) {
      console.error("Erro ao salvar produto selecionado:", error);
    }

    addOrIncrementCartItem(selectedItem);
    router.push("/shop");
  };
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const itensPaginados = itensFiltrados.slice(inicio, fim);

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const productGridClasses = isMobileQuadHd
    ? "grid grid-cols-2 gap-4 max-w-4xl mx-auto px-2"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto";

  const productCardClasses = isMobileQuadHd
    ? "gpu-fix relative bg-white/60 dark:bg-neutral-800/60 rounded-xl shadow-md flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    : "gpu-fix relative bg-white/50 dark:bg-neutral-800/50 rounded-2xl shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group";

  const cardImageHeight = isMobileQuadHd
    ? "h-36"
    : "h-48 sm:h-56 md:h-48 lg:h-56";

  const cardBodyClasses = isMobileQuadHd
    ? "p-3 flex flex-col justify-between flex-1 gap-2"
    : "p-4 flex flex-col justify-between flex-1";

  const cardTitleClass = isMobileQuadHd
    ? "font-semibold text-gray-800 dark:text-gray-200 text-base truncate"
    : "font-semibold text-gray-800 dark:text-gray-200 text-lg truncate";

  const priceClass = isMobileQuadHd
    ? "text-gray-800 dark:text-gray-200 font-bold text-lg mt-1"
    : "text-gray-800 dark:text-gray-200 font-bold text-xl mt-1";

  const buyButtonClasses = isMobileQuadHd
    ? "mt-3 w-full flex justify-center items-center gap-2 px-3 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition"
    : "mt-4 w-full flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition";

  const searchBoxWidthClasses = isMobileQuadHd
    ? "w-40"
    : "flex-1 md:flex-none w-40 md:w-48 lg:w-60 min-w-[280px] md:min-w-[450px]";

  const filterWidthClasses = isMobileQuadHd ? "w-40" : "w-40 md:w-48 lg:w-60";

  return (
    <LayoutHome role={role}>
      {/* 🔸 Carrossel */}
      <div className="mb-10 relative h-52 md:h-64">
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={`gpu-fix absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="gpu-fix bg-white/60 dark:bg-neutral-800/60 rounded-2xl shadow-md flex items-center justify-center h-52 md:h-64 p-4">
              <Image
                src={ad.image}
                alt={ad.title}
                width={600}
                height={200}
                className="object-cover rounded-2xl w-full h-full gpu-fix"
              />
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 dark:bg-neutral-800/60 p-2 rounded-full shadow hover:scale-110 hover:bg-red-200 transition-all duration-300"
        >
          <FaChevronLeft className="text-red-800 dark:text-red-400" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 dark:bg-neutral-800/60 p-2 rounded-full shadow hover:scale-110 hover:bg-red-200 transition-all duration-300"
        >
          <FaChevronRight className="text-red-800 dark:text-red-400" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "bg-red-600 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-red-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 🔸 Filtros profissionais alinhados */}
      <div className="sticky top-24 z-20 bg-white/95 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-md p-4 mb-6 max-w-7xl mx-auto flex flex-wrap items-center gap-4 justify-start">
        {/* Busca alinhada com selects */}
        <div
          className={`flex items-center bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition ${searchBoxWidthClasses}`}
        >
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-200 text-base"
          />
        </div>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className={`border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition ${filterWidthClasses}`}
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
          className="border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition w-40 md:w-48 lg:w-60"
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
          className="border border-gray-300 dark:border-neutral-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition w-40 md:w-48 lg:w-60"
        >
          <option value="">Com/sem estampa</option>
          <option value="true">Com estampa</option>
          <option value="false">Sem estampa</option>
        </select>
      </div>

      {/* 🔸 Produtos com cards estilizados e badge de desconto */}
      <div className={productGridClasses}>
        {itensPaginados.map((item) => {
          const desconto = item.promo
            ? Math.round(
                ((item.preco - (item.precoPromo || 0)) / item.preco) * 100
              )
            : 0;
          const imageSrc = resolveProductImage(item.imagem);

          return (
            <div key={item._id} className={productCardClasses}>
              {desconto > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{desconto}%
                </span>
              )}
              <div
                className={`gpu-fix relative w-full ${cardImageHeight} overflow-hidden group`}
              >
                <Image
                  src={imageSrc}
                  alt={item.nome}
                  fill
                  className="gpu-fix object-contain p-4 transition-transform duration-500 ease-out transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3"
                />
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">
                  <FaHeart size={20} />
                </button>
              </div>

              <div className={cardBodyClasses}>
                <div className="text-center">
                  <h2 className={cardTitleClass}>{item.nome}</h2>
                  {!item.promo && (
                    <p className={priceClass}>R$ {item.preco.toFixed(2)}</p>
                  )}
                  {item.promo && (
                    <>
                      <span className="text-green-600 font-medium">
                        R$ {item.precoPromo?.toFixed(2)}
                      </span>
                      <span className="block text-xs text-gray-500 line-through">
                        R$ {item.preco.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleComprar(item)}
                  className={buyButtonClasses}
                >
                  <FaShoppingCart /> Comprar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔸 Paginação estilizada */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-16">
          <button
            onClick={() => irParaPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="flex items-center justify-center px-3 py-2 rounded-full bg-white/70 dark:bg-neutral-700 text-red-800 dark:text-red-400 shadow hover:bg-red-100 disabled:opacity-40 transition-all duration-300"
          >
            <FaChevronLeft />
          </button>

          {[...Array(totalPaginas)].map((_, index) => (
            <button
              key={index}
              onClick={() => irParaPagina(index + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                paginaAtual === index + 1
                  ? "bg-red-600 text-white shadow-md scale-110"
                  : "bg-white/60 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-red-300/70 hover:scale-105"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => irParaPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="flex items-center justify-center px-3 py-2 rounded-full bg-white/70 dark:bg-neutral-700 text-red-800 dark:text-red-400 shadow hover:bg-red-100 disabled:opacity-40 transition-all duration-300"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </LayoutHome>
  );
}
