import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, type Order } from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Order[]>('/orders/mine').then(setOrders).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p>Loading…</p>;
  if (orders.length === 0) return <p>No orders yet. <Link to="/">Start shopping</Link></p>;

  return (
    <>
      <h1>My orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
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
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
              <td>{money(o.totalCents)}</td>
              <td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
