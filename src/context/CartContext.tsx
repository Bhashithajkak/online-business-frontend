import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../api';

export interface CartItem {
  productId: number;
  name: string;
  priceCents: number;
  imageUrl: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const CART_KEY = 'shop.cart';
const CartContext = createContext<CartState | null>(null);

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const setQty = (productId: number, qty: number) =>
    setItems((cur) =>
      qty <= 0
        ? cur.filter((i) => i.productId !== productId)
        : cur.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );

  const value: CartState = {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    totalCents: items.reduce((n, i) => n + i.qty * i.priceCents, 0),
    add: (p, qty = 1) =>
      setItems((cur) => {
        const existing = cur.find((i) => i.productId === p.id);
        if (existing) {
          return cur.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + qty } : i));
        }
        return [
          ...cur,
          { productId: p.id, name: p.name, priceCents: p.priceCents, imageUrl: p.imageUrl, qty },
        ];
      }),
    setQty,
    remove: (productId) => setQty(productId, 0),
    clear: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
