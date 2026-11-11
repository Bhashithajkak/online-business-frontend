import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, money, type Order } from '../api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, totalCents, clear } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const order = await api<Order>('/orders', {
        method: 'POST',
        body: {
          items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
          shippingAddress: address,
        },
      });
      clear();
      navigate(`/orders/${order.id}`, { replace: true, state: { justPlaced: true } });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={placeOrder}>
      <h1>Checkout</h1>
      <ul>
        {items.map((i) => (
          <li key={i.productId}>
            {i.qty} × {i.name} — {money(i.priceCents * i.qty)}
          </li>
        ))}
      </ul>
      <p><strong>Total: {money(totalCents)}</strong></p>
      <label>
        Shipping address
        <textarea required minLength={5} value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <p className="muted">Payment is simulated — no card needed.</p>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Placing order…' : 'Place order'}
      </button>
    </form>
  );
}
