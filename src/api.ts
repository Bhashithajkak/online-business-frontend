export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  active: boolean;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export interface Order {
  id: number;
  status: OrderStatus;
  totalCents: number;
  shippingAddress: string;
  createdAt: string;
  user?: { name: string; email: string };
  items: {
    id: number;
    productId: number;
    quantity: number;
    unitPriceCents: number;
    product: { name: string; imageUrl?: string };
  }[];
}

export const TOKEN_KEY = 'shop.token';

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const money = (cents: number) => fmt.format(cents / 100);
