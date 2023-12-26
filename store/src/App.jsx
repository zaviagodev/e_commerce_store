import { FrappeProvider } from "frappe-react-sdk";
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
import { UserProvider, useUser } from "./hooks/useUser";
import { getToken } from "./utils/helper";
import BankInfoPage from "./pages/BankInfoPage";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import { OrderProvider } from "./hooks/useOrders";


function App() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("currentUser", user);
    if (!getToken() && !user?.name) {
      //navigate("/login");
    }
  }, [navigate, user?.name]);

  return (
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
  )
}

export const AppWrapper = () => {
  return (
    <FrappeProvider
      url={import.meta.env.VITE_ERP_URL ?? ""}
      enableSocket={false}
      tokenParams={
        process.env.USE_TOKEN_AUTH ?
          {
            type: "token",
            useToken: true,
            token: getToken,
          }
          :
          null
      }
    >
      <OrderProvider>
      <UserProvider>
        <App />
      </UserProvider>
      </OrderProvider>
    </FrappeProvider>
  )
}


export default AppWrapper;
