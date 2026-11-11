import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api, money, type Order } from '../api';

export default function OrderDetail() {
  const { id } = useParams();
  const justPlaced = (useLocation().state as { justPlaced?: boolean } | null)?.justPlaced;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Order>(`/orders/${id}`).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Loading…</p>;

  return (
    <>
      {justPlaced && <p className="success">Thank you! Your order has been placed.</p>}
      <h1>Order #{order.id}</h1>
      <p>
        <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>{' '}
        <span className="muted">placed {new Date(order.createdAt).toLocaleString()}</span>
      </p>
      <table className="table">
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id}>
              <td>{i.product.name}</td>
              <td>{i.quantity} × {money(i.unitPriceCents)}</td>
              <td>{money(i.quantity * i.unitPriceCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total: {money(order.totalCents)}</strong></p>
      <p className="muted">Ships to: {order.shippingAddress}</p>
      <Link to="/orders">← All orders</Link>
    </>
  );
}
