import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">ShopLite</Link>
        <nav>
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart ({count})</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/products">Products</NavLink>
              <NavLink to="/admin/orders">Orders</NavLink>
            </>
          )}
          {user ? (
            <button
              className="link-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out ({user.name})
            </button>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
