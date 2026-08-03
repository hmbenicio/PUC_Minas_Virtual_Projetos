"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LayoutHome from "@/components/LayoutHome";
import { Item, resolveTipoDescricao } from "@/components/TabelaItensCadastro";
import {
  CartItem,
  SELECTED_PRODUCT_KEY,
  readCartFromStorage,
  upsertCartItemQuantity,
  persistCartItems,
} from "@/lib/cart";
import type { PaymentStatus, User } from "../types";

type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

type ApiAddress = User["endereco"] & {
  bairro?: string;
  complemento?: string;
};

const DEFAULT_IMAGE = "/image.png";
const API_BASE_URL = "/api/proxy";
const MERCADO_PAGO_CHECKOUT_API = "/api/payments/mercadopago";
const ORDER_DRAFT_KEY = "alfastore:last-order-draft";

const MercadoPagoWallet = dynamic(
  () => import("@mercadopago/sdk-react").then((module) => module.Wallet),
  { ssr: false }
);

const resolveProductImage = (imagem?: string | null): string => {
  if (!imagem) return DEFAULT_IMAGE;

  const trimmed = imagem.trim();
  if (trimmed === "" || trimmed === "Imagem_01") return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const sanitizeDigits = (value: string) => value.replace(/\D/g, "");

const resolveNameParts = (fullName?: string | null) => {
  if (!fullName) {
    return { firstName: undefined, lastName: undefined };
  }

  const normalized = fullName.trim().split(/\s+/);
  if (normalized.length === 0) {
    return { firstName: undefined, lastName: undefined };
  }

  const [firstName, ...rest] = normalized;
  return {
    firstName,
    lastName: rest.length ? rest.join(" ") : undefined,
  };
};

type OrderDraft = {
  preferenceId?: string;
  externalReference?: string;
  items: {
    id?: string;
    title: string;
    quantity: number;
    unit_price: number;
  }[];
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  address?: Address;
  createdAt: number;
};

const saveOrderDraft = (draft: OrderDraft) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("Nao foi possivel salvar rascunho de pedido:", error);
  }
};

const loadOrderDraft = (): OrderDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ORDER_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderDraft;
  } catch (error) {
    console.error("Nao foi possivel ler rascunho de pedido:", error);
    return null;
  }
};

const clearOrderDraft = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ORDER_DRAFT_KEY);
  } catch (error) {
    console.error("Nao foi possivel limpar rascunho de pedido:", error);
  }
};

const getInitialAddress = (): Address => ({
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
});

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const resolveUnitPrice = (item: Item) => {
  if (item.promo && item.precoPromo) return item.precoPromo;
  return item.preco;
};

const decodeJwtId = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64url = parts[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window !== "undefined"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(json) as Record<string, unknown>;
    return (
      (payload.id as string | undefined) ??
      (payload._id as string | undefined) ??
      (payload.userId as string | undefined) ??
      (payload.sub as string | undefined) ??
      null
    );
  } catch (error) {
    console.error("Nao foi possivel interpretar o token JWT:", error);
    return null;
  }
};

export default function ShopPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState<Address>(getInitialAddress);
  const [isLoading, setIsLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [externalReference, setExternalReference] = useState<string | null>(null);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false);
  const [paymentStatusAlert, setPaymentStatusAlert] = useState<{
    type: "success" | "failure" | "pending";
    message: string;
  } | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    const determinedRole = roleFromStorage === "admin" ? "admin" : "cliente";
    setRole(determinedRole);

    const storedCart = readCartFromStorage();
    setCartItems(storedCart);

    const storedProduct = localStorage.getItem(SELECTED_PRODUCT_KEY);
    if (storedProduct) {
      try {
        const parsed: Item = JSON.parse(storedProduct);
        setProduct(parsed);
      } catch (error) {
        console.error("Erro ao interpretar produto selecionado:", error);
        setProduct(null);
      }
    } else if (storedCart.length > 0) {
      setProduct(storedCart[0].product);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    if (!statusParam) return;

    const normalized = statusParam.toLowerCase();
    const statusMap: Record<
      "success" | "failure" | "pending",
      { type: "success" | "failure" | "pending"; message: string }
    > = {
      success: {
        type: "success",
        message: "Pagamento confirmado pelo Mercado Pago. Obrigado pela compra!",
      },
      failure: {
        type: "failure",
        message: "Pagamento cancelado. Seus itens permanecem no carrinho.",
      },
      pending: {
        type: "pending",
        message:
          "Pagamento pendente de aprovação. Você pode tentar novamente quando preferir.",
      },
    };

    if (normalized === "success" || normalized === "failure" || normalized === "pending") {
      setPaymentStatusAlert(statusMap[normalized]);
      setPreferenceId(null);
      const paymentStatus: PaymentStatus =
        normalized === "success"
          ? "approved"
          : normalized === "failure"
            ? "failure"
            : "pending";
      persistOrder(paymentStatus);
    }

    params.delete("status");
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!isLoading && !product) {
      router.replace("/home");
    }
  }, [isLoading, product, router]);

  useEffect(() => {
    if (!publicKey) {
      console.error("Chave publica do Mercado Pago nao configurada.");
      setIsMercadoPagoReady(false);
      return;
    }

    let isCancelled = false;

    const initializeMercadoPago = async () => {
      try {
        const { initMercadoPago } = await import("@mercadopago/sdk-react");
        if (isCancelled) return;
        initMercadoPago(publicKey, { locale: "pt-BR" });
        setIsMercadoPagoReady(true);
      } catch (error) {
        console.error("Nao foi possivel inicializar o SDK do Mercado Pago:", error);
        if (!isCancelled) {
          setCheckoutError(
            "Falha ao carregar o modulo do Mercado Pago. Recarregue a pagina e tente novamente."
          );
          setIsMercadoPagoReady(false);
        }
      }
    };

    initializeMercadoPago();

    return () => {
      isCancelled = true;
    };
  }, [publicKey]);

  useEffect(() => {
    setPreferenceId(null);
    setCheckoutError(null);
  }, [quantity, product]);

  useEffect(() => {
    if (!product) return;
    const entry = cartItems.find((item) => item.product._id === product._id);
    if (entry) {
      setQuantity(entry.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, product]);

  useEffect(() => {
    const loadUser = async () => {
      const rawToken = localStorage.getItem("userToken");
      if (!rawToken) return;

      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = decodeJwtId(rawToken);
        if (userId) {
          localStorage.setItem("userId", userId);
        }
      }

      if (!userId) return;

      const authorizationHeader = rawToken.startsWith("Bearer ")
        ? rawToken
        : `Bearer ${rawToken}`;

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: authorizationHeader,
          },
        });

        const data = (await response.json().catch(() => ({}))) as User & {
          endereco?: ApiAddress;
          message?: string;
        };

        if (!response.ok) {
          throw new Error(
            data?.message || "Falha ao carregar dados do usuario autenticado."
          );
        }

        setUser(data);

        const endereco = data?.endereco;
        if (endereco) {
          setAddress((prev) => ({
            cep: endereco.cep ?? prev.cep,
            street: endereco.rua ?? prev.street,
            number: endereco.numero ?? prev.number,
            complement: endereco.complemento ?? prev.complement,
            district: endereco.bairro ?? prev.district,
            city: endereco.cidade ?? prev.city,
            state: endereco.estado ?? prev.state,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuario:", error);
      }
    };

    loadUser();
  }, []);

  const unitPrice = useMemo(
    () => (product ? resolveUnitPrice(product) : 0),
    [product]
  );

  const { cartSubtotal, cartQuantity } = useMemo(
    () =>
      cartItems.reduce(
        (accumulator, entry) => {
          const unit = resolveUnitPrice(entry.product);
          accumulator.cartSubtotal += entry.quantity * unit;
          accumulator.cartQuantity += entry.quantity;
          return accumulator;
        },
        { cartSubtotal: 0, cartQuantity: 0 }
      ),
    [cartItems]
  );
  const hasCartItems = cartItems.length > 0;

  const orderTotal = useMemo(() => {
    const fallbackTotal = product ? quantity * unitPrice : 0;
    const rawTotal = hasCartItems ? cartSubtotal : fallbackTotal;
    return Number(rawTotal.toFixed(2));
  }, [hasCartItems, cartSubtotal, product, quantity, unitPrice]);

  const preferenceItems = useMemo(() => {
    if (cartItems.length > 0) {
      return cartItems.map((entry) => {
        const entryUnitPrice = resolveUnitPrice(entry.product);
        return {
          id: entry.product._id,
          title: entry.product.nome,
          description: `Produto ${resolveTipoDescricao(entry.product.tipo)} - Tamanho ${
            entry.product.tamanho
          }`,
          quantity: entry.quantity,
          unit_price: parseFloat(entryUnitPrice.toFixed(2)),
          currency_id: "BRL",
        };
      });
    }

    if (product) {
      return [
        {
          id: product._id,
          title: product.nome,
          description: `Produto ${resolveTipoDescricao(product.tipo)} - Tamanho ${
            product.tamanho
          }`,
          quantity,
          unit_price: parseFloat(unitPrice.toFixed(2)),
          currency_id: "BRL",
        },
      ];
    }

    return [];
  }, [cartItems, product, quantity, unitPrice]);

  const handleQuantityChange = (value: number) => {
    if (!product) return;
    if (Number.isNaN(value)) return;

    const sanitizedValue = Math.max(1, Math.floor(value) || 1);
    setQuantity(sanitizedValue);
    setCartItems((previous) =>
      upsertCartItemQuantity(product, sanitizedValue, previous)
    );
    setPreferenceId(null);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPreferenceId(null);
  };

  const persistOrder = async (paymentStatus: PaymentStatus) => {
    const rawToken = localStorage.getItem("userToken");
    if (!rawToken) return;

    const authorizationHeader = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

    const draft = loadOrderDraft();
    const itemsForOrder = (draft?.items ?? preferenceItems).map((item) => ({
      productId: item.id,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));

    const body = {
      external_reference:
        draft?.externalReference ??
        externalReference ??
        `order-${Date.now()}`,
      preference_id: draft?.preferenceId ?? preferenceId ?? undefined,
      payment_status: paymentStatus,
      status: paymentStatus === "approved" ? "paid" : undefined,
      total_amount: draft?.totalAmount ?? orderTotal,
      customer_name: draft?.customerName ?? user?.nome,
      customer_email: draft?.customerEmail ?? user?.email,
      items: itemsForOrder,
      shipping_address: draft?.address ?? address,
      metadata: {
        cartItemIds: cartItems.map((entry) => entry.product._id),
        cartQuantity,
        orderTotal,
      },
    };

    try {
      await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationHeader,
        },
        body: JSON.stringify(body),
      });

      if (paymentStatus === "approved") {
        persistCartItems([]);
        localStorage.removeItem(SELECTED_PRODUCT_KEY);
      }
    } catch (error) {
      console.error("Nao foi possivel registrar o pedido:", error);
    } finally {
      clearOrderDraft();
    }
  };

  const handleGeneratePayment = async () => {
    if (!publicKey) {
      setCheckoutError(
        "Chave publica do Mercado Pago nao configurada. Verifique o arquivo .env.local."
      );
      return;
    }

    if (preferenceItems.length === 0) {
      setCheckoutError("Adicione ao menos um item ao carrinho para pagar.");
      return;
    }

    if (orderTotal <= 0) {
      setCheckoutError("O total do pedido deve ser maior que zero para realizar o pagamento.");
      return;
    }

    const rawToken = localStorage.getItem("userToken");
    if (!rawToken) {
      setCheckoutError("Faca login para gerar o pagamento.");
      return;
    }

    const authorizationHeader = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

    setCheckoutError(null);
    setIsCreatingPreference(true);
    setPreferenceId(null);

    try {
      const storedUserId = localStorage.getItem("userId");
      const { firstName, lastName } = resolveNameParts(user?.nome);

      const payerPayload = user
        ? {
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            identification: user.cpf
              ? {
                  type: "CPF",
                  number: sanitizeDigits(user.cpf),
                }
              : undefined,
            phone: user.telefone
              ? {
                  number: sanitizeDigits(user.telefone),
                }
              : undefined,
            address: {
              zip_code: sanitizeDigits(address.cep),
              street_name: address.street,
              street_number: address.number,
              neighborhood: address.district,
              city: address.city,
              state: address.state,
            },
          }
        : undefined;

      const shipmentsPayload =
        address.cep ||
        address.street ||
        address.number ||
        address.city ||
        address.state
          ? {
              receiver_address: {
                zip_code: sanitizeDigits(address.cep),
                street_name: address.street,
                street_number: address.number,
                neighborhood: address.district,
                city_name: address.city,
                state_name: address.state,
                floor: address.complement || undefined,
              },
            }
          : undefined;

      const externalReference =
        product?._id ?? preferenceItems[0]?.id ?? `order-${Date.now()}`;
      setExternalReference(externalReference);

      const response = await fetch(MERCADO_PAGO_CHECKOUT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationHeader,
        },
        body: JSON.stringify({
          items: preferenceItems,
          external_reference: externalReference,
          payer: payerPayload,
          shipments: shipmentsPayload,
          metadata: {
            productId: product?._id,
            quantity,
            cartSubtotal: orderTotal,
            cartItemIds: cartItems.map((entry) => entry.product._id),
            userId: storedUserId,
            orderTotal,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Nao foi possivel criar a preferencia de pagamento. Tente novamente."
        );
      }

      if (!data?.id) {
        throw new Error(
          "A resposta do Mercado Pago nao retornou o identificador da preferencia."
        );
      }

      setPaymentStatusAlert(null);
      setPreferenceId(data.id);
      saveOrderDraft({
        preferenceId: data.id,
        externalReference,
        items: preferenceItems,
        totalAmount: orderTotal,
        customerName: user?.nome ?? undefined,
        customerEmail: user?.email ?? undefined,
        address,
        createdAt: Date.now(),
      });
    } catch (error) {
      if (error instanceof Error) {
        setCheckoutError(error.message);
      } else {
        setCheckoutError("Erro inesperado ao iniciar o checkout.");
      }
    } finally {
      setIsCreatingPreference(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGeneratePayment();
  };

  if (isLoading) {
    return (
      <LayoutHome role={role}>
        <div className="flex h-full items-center justify-center text-lg font-medium text-gray-800 dark:text-gray-200">
          Carregando resumo da compra...
        </div>
      </LayoutHome>
    );
  }

  if (!product) {
    return (
      <LayoutHome role={role}>
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-800 dark:text-gray-200">
          <p className="text-xl font-semibold">
            Nao foi possivel recuperar o produto selecionado.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
          >
            Voltar para a vitrine
          </button>
        </div>
      </LayoutHome>
    );
  }

  return (
    <LayoutHome role={role}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Resumo da compra
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Revise as informacoes antes de finalizar o pedido.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          <section className="space-y-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/70">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex h-60 w-full items-center justify-center rounded-xl bg-gray-100/80 p-4 dark:bg-neutral-800 md:w-60">
                <Image
                  src={resolveProductImage(product.imagem)}
                  alt={`Imagem do produto ${product.nome}`}
                  width={220}
                  height={220}
                  className="h-full w-full rounded-lg object-cover shadow"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {product.nome}
                  </h2>
                  <p className="text-sm uppercase tracking-wide text-red-700 dark:text-red-300">
                    {resolveTipoDescricao(product.tipo)} - Tamanho {product.tamanho}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.estampa
                      ? "Modelo com estampa exclusiva"
                      : "Modelo basico sem estampa"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Preco unitario
                    </span>
                    <span className="text-2xl font-semibold text-red-700 dark:text-red-300">
                      {formatCurrency(unitPrice)}
                    </span>
                    {product.promo && product.precoPromo && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.preco)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="h-10 w-10 rounded-full bg-gray-200 text-xl font-bold text-gray-700 transition hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(event) =>
                        handleQuantityChange(Number(event.target.value))
                      }
                      className="h-10 w-16 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="h-10 w-10 rounded-full bg-gray-200 text-xl font-bold text-gray-700 transition hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Endereco de entrega
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  CEP
                  <input
                    type="text"
                    value={address.cep}
                    onChange={(event) =>
                      handleAddressChange("cep", event.target.value)
                    }
                    placeholder="00000-000"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Rua
                  <input
                    type="text"
                    value={address.street}
                    onChange={(event) =>
                      handleAddressChange("street", event.target.value)
                    }
                    placeholder="Nome da rua"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Numero
                  <input
                    type="text"
                    value={address.number}
                    onChange={(event) =>
                      handleAddressChange("number", event.target.value)
                    }
                    placeholder="Numero"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Complemento
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(event) =>
                      handleAddressChange("complement", event.target.value)
                    }
                    placeholder="Apartamento, bloco..."
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Bairro
                  <input
                    type="text"
                    value={address.district}
                    onChange={(event) =>
                      handleAddressChange("district", event.target.value)
                    }
                    placeholder="Nome do bairro"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Cidade
                  <input
                    type="text"
                    value={address.city}
                    onChange={(event) =>
                      handleAddressChange("city", event.target.value)
                    }
                    placeholder="Cidade"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Estado
                  <input
                    type="text"
                    value={address.state}
                    onChange={(event) =>
                      handleAddressChange("state", event.target.value)
                    }
                    placeholder="UF"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                  />
                </label>
              </div>
            </div>
          </section>

          <div className="flex h-fit flex-col gap-6">
            <section className="space-y-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/70">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Detalhes do pedido
                </h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex justify-between">
                    <span>Itens no carrinho</span>
                    <span>
                      {cartQuantity} {cartQuantity === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <span>Subtotal dos itens</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-4 text-lg font-semibold text-gray-900 dark:border-neutral-700 dark:text-gray-100">
                <span>Total do pedido</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>

              {paymentStatusAlert && (
                <div
                  className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-sm ${
                    paymentStatusAlert.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200"
                      : paymentStatusAlert.type === "failure"
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200"
                  }`}
                >
                  <span>{paymentStatusAlert.message}</span>
                  <button
                    type="button"
                    onClick={() => setPaymentStatusAlert(null)}
                    className="text-xs font-semibold uppercase tracking-wide transition hover:opacity-80"
                  >
                    Fechar
                  </button>
                </div>
              )}

              {checkoutError && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
                  {checkoutError}
                </div>
              )}

              <div className="w-full">
                {preferenceId ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center dark:border-neutral-700">
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                      Utilize o botao oficial do Mercado Pago para finalizar o pedido.
                    </p>
                    <div className="flex justify-center">
                      <div className="w-full max-w-xs">
                        {isMercadoPagoReady ? (
                          <MercadoPagoWallet initialization={{ preferenceId }} />
                        ) : (
                          <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600 dark:bg-neutral-800 dark:text-gray-200">
                            Carregando modulo de pagamento...
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferenceId(null)}
                      className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600 hover:text-red-700 dark:text-red-300"
                    >
                      Atualizar resumo antes de pagar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGeneratePayment}
                    disabled={isCreatingPreference || !publicKey}
                    className="w-full rounded-xl bg-[#00a650] px-6 py-3 text-center text-lg font-semibold text-white shadow-lg transition hover:bg-[#009245] disabled:cursor-not-allowed disabled:bg-[#7cd5a1]"
                  >
                    {isCreatingPreference ? "Preparando checkout..." : "Gerar pagamento"}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => router.push("/home")}
                className="w-full rounded-xl border border-red-500 px-6 py-3 text-center text-lg font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-300 dark:text-red-300 dark:hover:bg-neutral-800"
              >
                Continuar comprando
              </button>
            </section>

            <section className="space-y-4 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/70">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Resumo do carrinho
                </h3>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-200">
                  {cartQuantity} {cartQuantity === 1 ? "item" : "itens"}
                </span>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Seu carrinho ainda nao possui produtos. Volte a vitrine para escolher um item.
                </p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((entry) => (
                    <li
                      key={entry.product._id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-white/70 p-3 text-sm shadow-sm dark:bg-neutral-800/70"
                    >
                      <div className="flex flex-1 flex-col">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {entry.product.nome}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {resolveTipoDescricao(entry.product.tipo)} · Tam. {entry.product.tamanho}
                        </span>
                        {entry.product._id === product?._id && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-300">
                            ✔ Produto atual
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                        <span>{entry.quantity}x</span>
                        <span>{formatCurrency(resolveUnitPrice(entry.product))}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-4 text-base font-semibold text-gray-900 dark:border-neutral-700 dark:text-gray-100">
                <span>Total do carrinho</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="w-full rounded-xl border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
              >
                Ver carrinho completo
              </button>
            </section>
          </div>
        </form>
      </div>
    </LayoutHome>
  );
}

