import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Home } from './Pages/Home';
import { Layout } from './Components/Layout';
import { Cart } from "./Pages/Cart";
import { CartProvider } from "./context/CartContext";
import { Feedback } from "./Pages/Feedback";
import Checkout from "./Pages/Checkout";
import { Toast } from "./Components/Toast";
import { Admin } from "./Pages/Admin";
import { isAdminAuthenticated, Login } from "./Pages/Login";

const ProtectedAdminRoute = ({ children }) => (
  isAdminAuthenticated() ? children : <Navigate to="/login" replace />
);

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/orders" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toast />
      </CartProvider>
    </>
  );
}

export default App;
