import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import About from './components/About';
import Login from './components/Login';
import FormalLogin from './components/FormalLogin';
import DealerLogin from './components/DealerLogin';
import AdminLogin from './components/AdminLogin';
import FarmerLogin from './components/FarmerLogin';
import AdminDashboard from './components/AdminDashboard';
import DealerDashboard from './components/DealerDashboard';
import FarmerDashboard from './components/FarmerDashboard';
import DealerPanel from './components/DealerPanel';
import Signup from './components/Signup';
import './App.css';

// Component to conditionally render Header/Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isDealerLogin = location.pathname === '/dealer/login' || location.pathname === '/login/dealer';
  
  if (isDealerLogin) {
    // Standalone dealer login page - no header/footer
    return <>{children}</>;
  }
  
  // Regular pages with header and footer
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <AppLayout>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
                <Route path="/login/farmer" element={<FarmerLogin />} />
                <Route path="/dealer/login" element={<DealerLogin />} />
              <Route path="/login/dealer" element={<DealerLogin />} />
                <Route path="/dealer" element={<DealerPanel />} />
                <Route path="/dealer/panel" element={<DealerPanel />} />
              <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/dealer/dashboard" element={<DealerDashboard />} />
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/signup" element={<Signup />} />
              </Routes>
            </AppLayout>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


