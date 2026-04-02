import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiPlusCircle, FiLogOut, FiUser, FiShield, FiHome } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await getCart();
        const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch {
        // Backend might not be running yet
      }
    };
    fetchCartCount();
  }, [location, user]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Back to EduLink main site */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" className="nav-link back-to-main" title="Back to EduLink Home">
            <FiHome size={18} />
            <span>EduLink</span>
          </Link>
          <span style={{ color: "var(--gray-400)", fontSize: "1.2rem" }}>|</span>
          <Link to="/marketplace" className="navbar-brand">
            <div className="brand-logo">
              <span className="brand-icon">S</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">Marketplace</span>
              <span className="brand-tagline">Student Store</span>
            </div>
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/marketplace"
            className={`nav-link ${location.pathname === "/marketplace" ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Browse
          </Link>

          <Link
            to="/marketplace/cart"
            className="nav-link cart-link"
            onClick={() => setMenuOpen(false)}
          >
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <>
              <Link
                to="/marketplace/sell"
                className={`nav-link ${location.pathname === "/marketplace/sell" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiPlusCircle size={16} /> Sell
              </Link>
              <Link
                to="/marketplace/my-listings"
                className={`nav-link ${location.pathname === "/marketplace/my-listings" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                My Listings
              </Link>
              <Link
                to="/marketplace/orders"
                className={`nav-link ${location.pathname === "/marketplace/orders" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link admin-link ${location.pathname === "/admin" ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <FiShield size={16} /> Admin
                </Link>
              )}
              <Link
                to="/marketplace/profile"
                className={`nav-link ${location.pathname === "/marketplace/profile" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiUser size={16} /> Profile
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-gold btn-sm"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
