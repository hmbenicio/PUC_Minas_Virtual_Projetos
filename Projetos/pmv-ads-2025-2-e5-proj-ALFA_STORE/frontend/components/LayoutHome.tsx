"use client";
import { JSX, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBoxes,
  FaChartLine,
  FaTags,
  FaUsers,
  FaInfoCircle,
  FaBars,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useQuadHdMobile from "@/lib/hooks/useQuadHdMobile";
import {
  CART_UPDATED_EVENT,
  readCartFromStorage,
} from "@/lib/cart";
import type { CartItem, CartUpdatedDetail } from "@/lib/cart";

//types:

import BackgroundHome from "@/src/assets/Background_Home2.png";
import Logo from "@/src/assets/Logo.png";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  href: string;
  clearToken?(): void;
}

interface LayoutProps {
  children?: ReactNode;
  role?: string;
}

export default function LayoutHome({ children, role }: LayoutProps) {
  const isMobileQuadHd = useQuadHdMobile();
  const [isOpen, setIsOpen] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const resolveQuantity = (items?: CartItem[]) => {
      const source = items ?? readCartFromStorage();
      const nextQuantity = source.reduce(
        (accumulator, entry) => accumulator + entry.quantity,
        0
      );
      setCartQuantity(nextQuantity);
    };

    resolveQuantity();

    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent<CartUpdatedDetail>).detail;
      if (detail?.items) {
        resolveQuantity(detail.items);
      } else {
        resolveQuantity();
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, []);

  const handleToken = () => {
    localStorage.setItem("userToken", "");
    localStorage.setItem("userRole", "");
    localStorage.setItem("userId", "");
  };

  const menuItemsAdmin: MenuItem[] = [
    { icon: <FaHome />, label: "Home", href: "/home" },
    { icon: <FaUser />, label: "Meu Perfil", href: "/perfil" },
    { icon: <FaShoppingCart />, label: "Meu Carrinho", href: "/cart" },
    { icon: <FaUsers />, label: "Usuários", href: "/users" },
    { icon: <FaBoxes />, label: "Estoque", href: "/estoque" },
    { icon: <FaTags />, label: "Promoções", href: "/promocoes" },
    { icon: <FaChartLine />, label: "Vendas", href: "/vendas" },
    { icon: <FaInfoCircle />, label: "Sobre", href: "/sobre" },
    { icon: <FiLogOut />, label: "Sair", href: "/", clearToken: handleToken },
  ];

  const menuItemsClient: MenuItem[] = [
    { icon: <FaHome />, label: "Home", href: "/home" },
    { icon: <FaUser />, label: "Meu Perfil", href: "/perfil" },
    { icon: <FaShoppingCart />, label: "Meu Carrinho", href: "/cart" },
    { icon: <FaInfoCircle />, label: "Sobre", href: "/sobre" },
    { icon: <FiLogOut />, label: "Sair", href: "/", clearToken: handleToken },
  ];

  const menuItems = role === "admin" ? menuItemsAdmin : menuItemsClient;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuClick = (item: MenuItem) => {
    if (item.clearToken) {
      item.clearToken();
    }
  };

  const containerClasses = [
    "relative min-h-screen overflow-hidden",
    "flex",
    isMobileQuadHd ? "flex-col" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sidebarClasses = isMobileQuadHd
    ? "fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 bg-white/90 dark:bg-neutral-900/80 px-5 py-4 shadow-[0_-14px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    : `flex flex-col bg-white/70 dark:bg-neutral-800/50 backdrop-blur-md shadow-lg p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`;

  const navClasses = isMobileQuadHd
    ? "flex w-full items-center justify-between gap-2"
    : "flex flex-col gap-4";

  return (
    <div className={containerClasses}>
      {/* Fundo */}
      <Image
        src={BackgroundHome}
        alt="Fundo Loja"
        fill
        className="object-cover opacity-60 -z-10 gpu-fix"
        priority
      />

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {!isMobileQuadHd && (
          <button
            onClick={toggleSidebar}
            className="mb-6 p-2 rounded hover:bg-red-100/60 dark:hover:bg-neutral-700/60 transition"
          >
            <FaBars className="text-red-800 dark:text-red-400" />
          </button>
        )}

        {!isMobileQuadHd && (
          <div
            className={`mb-6 flex items-center justify-center transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={Logo}
              alt="Logo AlfaStore"
              className="h-50 w-auto object-contain"
              priority
            />
          </div>
        )}

        <nav className={navClasses}>
          {menuItems.map((item, index) => {
            const isCartLink = item.href === "/cart";
            const showCartBadge = isCartLink && cartQuantity > 0;
            const shouldShowIconBadge = showCartBadge && isMobileQuadHd;
            const shouldShowLabelBadge = showCartBadge && !isMobileQuadHd && isOpen;
            const isActive =
              pathname === item.href ||
              (!!pathname && pathname.startsWith(item.href));

            const baseMobileClasses =
              "flex flex-1 items-center justify-center rounded-xl p-2 text-xl";
            const mobileActiveClasses = "bg-red-600 text-white shadow-lg";
            const mobileInactiveClasses =
              "text-gray-800 dark:text-gray-200 hover:bg-red-100/40 dark:hover:bg-neutral-700/60";

            const desktopClasses = `flex items-center gap-4 overflow-hidden whitespace-nowrap text-gray-800 dark:text-gray-200 hover:text-red-600 ${
              isActive ? "text-red-600" : ""
            }`;

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => handleMenuClick(item)}
                aria-current={isActive ? "page" : undefined}
                className={`transition ${
                  isMobileQuadHd
                    ? `${baseMobileClasses} ${
                        isActive ? mobileActiveClasses : mobileInactiveClasses
                      }`
                    : desktopClasses
                }`}
              >
                <span
                  className={`relative text-lg ${
                    isMobileQuadHd && isActive ? "text-white" : ""
                  }`}
                >
                  {item.icon}
                  {shouldShowIconBadge && (
                    <span className="absolute -top-2 -right-3 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
                      {cartQuantity}
                    </span>
                  )}
                </span>
                {!isMobileQuadHd && isOpen && (
                  <span className="font-medium flex items-center gap-2">
                    {item.label}
                    {shouldShowLabelBadge && (
                      <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {cartQuantity}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Área de conteúdo injetado */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isMobileQuadHd ? "px-4 pt-8 pb-32" : "p-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
