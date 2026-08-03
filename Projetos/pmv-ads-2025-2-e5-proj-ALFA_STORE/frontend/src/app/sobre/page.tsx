"use client";

import LayoutHome from "@/components/LayoutHome";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Image from "next/image";
import Logo from "@/src/assets/Logo2.png";

export default function Sobre() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    const determinedRole = roleFromStorage === "admin" ? "admin" : "cliente";
    setRole(determinedRole);
  }, []);

  return (
    <LayoutHome role={role}>
      <div className="max-w-6xl mx-auto mt-12 mb-24 px-4 sm:px-6 lg:px-8">
        {/* 🔹 Logo centralizada */}
        <div className="flex justify-center mb-12">
          <div className="w-32 h-32 relative">
            <Image
              src={Logo}
              alt="Logo do Projeto"
              className="object-contain shadow-lg rounded-full"
              fill
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center">
          Sobre o Projeto
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 🔹 Plataforma e Produtos */}
          <div className="flex flex-col gap-4 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <FaBoxOpen className="text-amber-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Plataforma e Produtos
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Esta plataforma digital, desenvolvida em parceria com a PUC Minas
              (curso de ADS), apresenta um mostruário online de produtos de
              qualidade, com foco em sandálias e chinelos Havaianas. O sistema
              oferece vendas dinâmicas, controle de estoque centralizado e
              gestão eficiente de clientes, garantindo uma experiência de compra
              prática e moderna.
            </p>
          </div>

          {/* 🔹 Mercado */}
          <div className="flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-green-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Mercado de Sandálias
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              O mercado de sandálias e chinelos é competitivo e crescente,
              impulsionado pelo consumo casual e conforto. Marcas como Havaianas
              são reconhecidas nacional e internacionalmente, tornando essencial
              a presença digital para expandir vendas e alcançar novos públicos.
            </p>
          </div>

          {/* 🔹 Objetivo do Projeto */}
          <div className="flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-blue-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Objetivo
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              O projeto visa otimizar processos internos, reduzir erros,
              centralizar informações e expandir o alcance de vendas do
              parceiro, proporcionando uma solução prática e eficiente que
              integra universidade e comunidade.
            </p>
          </div>

          {/* 🔹 Equipe */}
          <div className="flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <FaUsers className="text-purple-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Desenvolvedores
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-base sm:text-lg">
              <li>Bernardo Miguel Soutelo Marra</li>
              <li>Guilherme Brito Fonseca e Silva</li>
              <li>Helbert Miranda Benício</li>
              <li>Jefferson Wagner Silveira e Silva</li>
              <li>Jonatas de Carvalho Brum</li>
            </ul>
          </div>

          {/* 🔹 Orientação */}
          <div className="flex flex-col gap-4 md:col-span-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-red-500 text-3xl" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Orientação
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Professor: Humberto Azevedo Nigri do Carmo
            </p>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
}
