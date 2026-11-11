import { Link } from 'react-router-dom';
import { money } from '../api';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, totalCents, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <p>
        Your cart is empty. <Link to="/">Continue shopping</Link>
      </p>
    );
  }

  return (
    <>
      <h1>Your cart</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.productId}>
              <td>{i.name}</td>
              <td>{money(i.priceCents)}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => setQty(i.productId, Math.max(1, Number(e.target.value)))}
                />
              </td>
              <td>{money(i.priceCents * i.qty)}</td>
              <td>
                <button className="link-btn" onClick={() => remove(i.productId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="summary">
        <strong>Total: {money(totalCents)}</strong>
        <Link className="button" to="/checkout">Checkout</Link>
      </div>
    </>
  );
}
