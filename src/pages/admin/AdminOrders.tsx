import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, type Order, type OrderStatus } from '../../api';

const STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Order[]>('/admin/orders').then(setOrders).catch((e) => setError(e.message));
  }, []);

  async function updateStatus(id: number, status: OrderStatus) {
    try {
      await api(`/admin/orders/${id}`, { method: 'PATCH', body: { status } });
      setOrders((cur) => cur!.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!orders) return error ? <p className="error">{error}</p> : <p>Loading…</p>;

  return (
    <>
      <h1>Orders</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/orders/${o.id}`}>#{o.id}</Link></td>
                <td>{o.user?.name}<br /><span className="muted">{o.user?.email}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.items.map((i) => `${i.quantity}× ${i.product.name}`).join(', ')}</td>
                <td>{money(o.totalCents)}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
