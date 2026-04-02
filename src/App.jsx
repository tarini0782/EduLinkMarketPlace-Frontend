import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Dinuja's pages (main site)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DinujaProfile from "./pages/Profile";
import FindingGroups from "./pages/FindingGroups";

// Unified admin dashboard
import AdminDashboard from "./pages/AdminDashboard";

// Tarini's marketplace pages (under /marketplace)
import MarketplaceHome from "./pages/marketplace/Home";
import ProductDetail from "./pages/marketplace/ProductDetail";
import CartPage from "./pages/marketplace/CartPage";
import ConfirmOrder from "./pages/marketplace/ConfirmOrder";
import OrderSuccess from "./pages/marketplace/OrderSuccess";
import OrderHistory from "./pages/marketplace/OrderHistory";
import CreateProduct from "./pages/marketplace/CreateProduct";
import EditProduct from "./pages/marketplace/EditProduct";
import MyListings from "./pages/marketplace/MyListings";
import MarketplaceProfile from "./pages/marketplace/Profile";

// Sahlaan's payment pages
import CreditCardPayment from "./pages/marketplace/CreditCardPayment";
import BankTransfer from "./pages/marketplace/BankTransfer";

// Marketplace navbar wrapper
import Navbar from "./components/Navbar";

import "./App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
}

// Wrapper that adds marketplace navbar
function MarketplaceLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        {/* ===== Main Site Routes (Dinuja's navbar is embedded in Home.jsx) ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<DinujaProfile />} />
        <Route path="/finding-groups" element={<FindingGroups />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* ===== Marketplace Routes (Tarini's navbar via MarketplaceLayout) ===== */}
        <Route path="/marketplace" element={<MarketplaceLayout><MarketplaceHome /></MarketplaceLayout>} />
        <Route path="/marketplace/product/:id" element={<MarketplaceLayout><ProductDetail /></MarketplaceLayout>} />
        <Route path="/marketplace/cart" element={<MarketplaceLayout><CartPage /></MarketplaceLayout>} />
        <Route path="/marketplace/confirm-order" element={<MarketplaceLayout><ConfirmOrder /></MarketplaceLayout>} />
        <Route path="/marketplace/order-success/:orderId" element={<MarketplaceLayout><OrderSuccess /></MarketplaceLayout>} />
        <Route path="/marketplace/orders" element={<MarketplaceLayout><OrderHistory /></MarketplaceLayout>} />
        <Route path="/marketplace/sell" element={<MarketplaceLayout><ProtectedRoute><CreateProduct /></ProtectedRoute></MarketplaceLayout>} />
        <Route path="/marketplace/edit-product/:id" element={<MarketplaceLayout><ProtectedRoute><EditProduct /></ProtectedRoute></MarketplaceLayout>} />
        <Route path="/marketplace/my-listings" element={<MarketplaceLayout><ProtectedRoute><MyListings /></ProtectedRoute></MarketplaceLayout>} />
        <Route path="/marketplace/profile" element={<MarketplaceLayout><ProtectedRoute><MarketplaceProfile /></ProtectedRoute></MarketplaceLayout>} />

        {/* Payment routes */}
        <Route path="/marketplace/payment/credit-card/:orderId" element={<MarketplaceLayout><CreditCardPayment /></MarketplaceLayout>} />
        <Route path="/marketplace/payment/bank-transfer/:orderId" element={<MarketplaceLayout><BankTransfer /></MarketplaceLayout>} />
      </Routes>
    </div>
  );
}

export default App;
