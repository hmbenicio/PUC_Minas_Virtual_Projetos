import type { Item } from "@/components/TabelaItensCadastro";

const CART_STORAGE_KEY = "alfastore:cart";
export const SELECTED_PRODUCT_KEY = "alfastore:selected-product";
export const CART_UPDATED_EVENT = "alfastore:cart-updated";

export type CartUpdatedDetail = {
  items: CartItem[];
  quantity: number;
};

export type CartItem = {
  product: Item;
  quantity: number;
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch (error) {
    console.error("Nao foi possivel acessar o localStorage:", error);
    return null;
  }
};

const sanitizeQuantity = (value: number): number => {
  if (!Number.isFinite(value)) return 1;
  const integer = Math.floor(value);
  return integer > 0 ? integer : 1;
};

const dispatchCartUpdatedEvent = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    const quantity = items.reduce((accumulator, entry) => accumulator + entry.quantity, 0);
    const detail: CartUpdatedDetail = { items, quantity };
    window.dispatchEvent(new CustomEvent<CartUpdatedDetail>(CART_UPDATED_EVENT, { detail }));
  } catch (error) {
    console.error("Nao foi possivel emitir o evento do carrinho:", error);
  }
};

const sanitizeCartItems = (input: unknown): CartItem[] => {
  if (!Array.isArray(input)) return [];

  return input
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const { product, quantity } = entry as Partial<CartItem>;

      if (!product || typeof product !== "object") return null;
      if (typeof (product as Item)._id !== "string") return null;

      return {
        product: product as Item,
        quantity: sanitizeQuantity(quantity ?? 1),
      };
    })
    .filter((entry): entry is CartItem => Boolean(entry));
};

export const persistCartItems = (items: CartItem[]): CartItem[] => {
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Nao foi possivel salvar o carrinho:", error);
    }
  }

  dispatchCartUpdatedEvent(items);
  return items;
};

export const readCartFromStorage = (): CartItem[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const rawValue = storage.getItem(CART_STORAGE_KEY);
    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue) as unknown;
    return sanitizeCartItems(parsed);
  } catch (error) {
    console.error("Nao foi possivel ler o carrinho salvo:", error);
    return [];
  }
};

const resolveCartSnapshot = (items?: CartItem[]): CartItem[] =>
  items ? [...items] : readCartFromStorage();

export const upsertCartItemQuantity = (
  product: Item,
  quantity: number,
  currentCartItems?: CartItem[]
): CartItem[] => {
  const sanitizedQuantity = sanitizeQuantity(quantity);
  const cartItems = resolveCartSnapshot(currentCartItems);
  const index = cartItems.findIndex((entry) => entry.product._id === product._id);

  if (index >= 0) {
    cartItems[index] = {
      product,
      quantity: sanitizedQuantity,
    };
  } else {
    cartItems.push({
      product,
      quantity: sanitizedQuantity,
    });
  }

  return persistCartItems(cartItems);
};

export const addOrIncrementCartItem = (
  product: Item,
  increment = 1,
  currentCartItems?: CartItem[]
): CartItem[] => {
  const cartItems = resolveCartSnapshot(currentCartItems);
  const index = cartItems.findIndex((entry) => entry.product._id === product._id);
  const sanitizedIncrement = sanitizeQuantity(increment);

  if (index >= 0) {
    cartItems[index] = {
      product,
      quantity: cartItems[index].quantity + sanitizedIncrement,
    };
  } else {
    cartItems.push({
      product,
      quantity: sanitizedIncrement,
    });
  }

  return persistCartItems(cartItems);
};

export const removeCartItem = (
  productId: string,
  currentCartItems?: CartItem[]
): CartItem[] => {
  const cartItems = resolveCartSnapshot(currentCartItems).filter(
    (entry) => entry.product._id !== productId
  );
  return persistCartItems(cartItems);
};
