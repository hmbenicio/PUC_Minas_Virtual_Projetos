"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LayoutHome from "@/components/LayoutHome";
import { Item, resolveTipoDescricao } from "@/components/TabelaItensCadastro";
import {
  CartItem,
  SELECTED_PRODUCT_KEY,
  readCartFromStorage,
  removeCartItem,
  upsertCartItemQuantity,
} from "@/lib/cart";

const DEFAULT_IMAGE = "/image.png";

const resolveProductImage = (imagem?: string | null): string => {
  if (!imagem) return DEFAULT_IMAGE;

  const trimmed = imagem.trim();
  if (trimmed === "" || trimmed === "Imagem_01") return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const resolveUnitPrice = (item: Item) =>
  item.promo && item.precoPromo ? item.precoPromo : item.preco;

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function CartPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    setRole(roleFromStorage === "admin" ? "admin" : "cliente");
    setCartItems(readCartFromStorage());
  }, []);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (accumulator, entry) =>
          accumulator + entry.quantity * resolveUnitPrice(entry.product),
        0
      ),
    [cartItems]
  );

  const totalItems = useMemo(
    () =>
      cartItems.reduce((accumulator, entry) => accumulator + entry.quantity, 0),
    [cartItems]
  );

  const updateQuantity = (product: Item, quantity: number) => {
    const sanitized = Math.max(1, Math.floor(quantity) || 1);
    setCartItems((previous) =>
      upsertCartItemQuantity(product, sanitized, previous)
    );
  };

  const handleRemove = (productId: string) => {
    setCartItems((previous) => removeCartItem(productId, previous));
  };

  const handleSelectForCheckout = (entry?: CartItem) => {
    const target = entry ?? cartItems[0];
    if (!target) return;

    try {
      window.localStorage.setItem(
        SELECTED_PRODUCT_KEY,
        JSON.stringify(target.product)
      );
    } catch (error) {
      console.error("Nao foi possivel salvar o produto selecionado:", error);
    }

    setCartItems((previous) =>
      upsertCartItemQuantity(target.product, target.quantity, previous)
    );
    router.push("/shop");
  };

  return (
    <LayoutHome role={role}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meu carrinho
          </h1>
          <p className="text-gray-800 dark:text-gray-300">
            REVISE OS ITENS ADICIONADOS ANTES DE FINALIZAR A COMPRA.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/80 p-10 text-center shadow-lg backdrop-blur dark:bg-neutral-900/70">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Seu carrinho ainda está vazio.
            </p>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700"
            >
              Explorar produtos
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              {cartItems.map((entry) => (
                <article
                  key={entry.product._id}
                  className="flex flex-col gap-4 rounded-2xl bg-white/85 p-4 shadow-lg backdrop-blur dark:bg-neutral-900/70 sm:flex-row sm:items-stretch"
                >
                  <div className="flex w-full justify-center sm:w-40">
                    <div className="relative h-36 w-36 overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800">
                      <Image
                        src={resolveProductImage(entry.product.imagem)}
                        alt={`Imagem do produto ${entry.product.nome}`}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                        {entry.product.nome}
                      </h2>
                      <p className="text-sm uppercase tracking-wide text-red-700 dark:text-red-300">
                        {resolveTipoDescricao(entry.product.tipo)} · Tam.{" "}
                        {entry.product.tamanho}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {entry.product.estampa
                          ? "Produto com estampa exclusiva."
                          : "Produto sem estampa."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(entry.product, entry.quantity - 1)
                          }
                          className="h-9 w-9 rounded-full bg-gray-200 text-lg font-bold text-gray-700 transition hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={entry.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              entry.product,
                              Number(event.target.value)
                            )
                          }
                          className="h-9 w-16 rounded-lg border border-gray-300 bg-white text-center text-base font-semibold text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(entry.product, entry.quantity + 1)
                          }
                          className="h-9 w-9 rounded-full bg-gray-200 text-lg font-bold text-gray-700 transition hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleSelectForCheckout(entry)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Comprar agora
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(entry.product._id)}
                          className="rounded-xl border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-neutral-800"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2 text-right">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Preço unitário
                    </div>
                    <div className="text-xl font-semibold text-red-700 dark:text-red-300">
                      {formatCurrency(resolveUnitPrice(entry.product))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total parcial
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(
                        entry.quantity * resolveUnitPrice(entry.product)
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-5 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/70">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Itens no carrinho
                </span>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-200">
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-4 text-lg font-semibold text-gray-900 dark:border-neutral-700 dark:text-gray-100">
                <span>Total estimado</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Escolha um item e prossiga para finalizar a compra
                individualmente.
              </p>
              <button
                type="button"
                onClick={() => handleSelectForCheckout()}
                className="w-full rounded-xl bg-red-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-red-700"
              >
                Ir para checkout
              </button>
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="w-full rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
              >
                Continuar comprando
              </button>
            </aside>
          </div>
        )}
      </div>
    </LayoutHome>
  );
}
