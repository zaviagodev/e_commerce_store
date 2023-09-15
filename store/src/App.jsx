import { FrappeProvider, useFrappeAuth } from "frappe-react-sdk";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import NavHeader from "./components/NavHeader";
import Home from "./pages/Home";
import Product from "./pages/Product";
import './App.css'
import { useEffect } from "react";
import { ProductsProvider } from "./hooks/useProducts";
import { CartProvider } from "./hooks/useCart";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import { UserProvider } from "./hooks/useUser";
import { getToken } from "./utils/helper";
import BankInfoPage from "./pages/BankInfoPage";
import LoyaltyProgram from "./pages/LoyaltyProgram";


function App() {
  const { currentUser } = useFrappeAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken() || !currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <UserProvider>
      <ProductsProvider>
        <CartProvider>
          <NavHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="products/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/loyality-program" element={<LoyaltyProgram />} />
            <Route path="/thankyou" element={<BankInfoPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Cart />
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  )
}

export const AppWrapper = () => {
  return (
    <FrappeProvider
      enableSocket={false}
      tokenParams={{
        type: "token",
        useToken: true,
        token: getToken,
      }}
    >
      <App />
    </FrappeProvider>
  )
}


export default AppWrapper;
