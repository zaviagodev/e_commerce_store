import { FrappeProvider } from "frappe-react-sdk";
import { createRoutesFromElements, RouterProvider, Outlet, createBrowserRouter, Route, useNavigate } from "react-router-dom";
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
import { OrderProvider } from "./hooks/useOrders";
import OrderHistory from "./pages/OrderHistory";


const Layer = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home/all items")
  }, [])
  return (
    <>
      <NavHeader />
        <Outlet />
      <Cart />
    </>)
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layer/>}>
      <Route path="order-history" element={<OrderHistory />} />
      <Route path="home/:itemsgroup" element={<Home />} />
      <Route path="products/:id" element={<Product />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="loyality-program" element={<LoyaltyProgram />} />
      <Route path="thankyou" element={<BankInfoPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="login" element={<Login />} />
    </Route>
  ),
  {basename: "/store"}
);

export const AppWrapper = () => {
  {/* Change from import.meta to process after completed the code */}
  return (
    <FrappeProvider
      url={import.meta.env.VITE_ERP_URL ?? ""}
      enableSocket={false}
      tokenParams={
        import.meta.env.VITE_USE_TOKEN_AUTH ?
        {
          type: import.meta.env.VITE_TOKEN_TYPE ? import.meta.env.VITE_TOKEN_TYPE : "token", 
          useToken: true,
          token: () => import.meta.env.VITE_TOKEN_API ? `${import.meta.env.VITE_TOKEN_API}:${import.meta.env.VITE_TOKEN_SECRET}` : getToken,
        } : null
    }>
      <OrderProvider>
      <UserProvider>
      <ProductsProvider>
      <CartProvider>
      <RouterProvider router={router}/>
      </CartProvider>
      </ProductsProvider>
      </UserProvider>
      </OrderProvider>
    </FrappeProvider>
  )
}

export default AppWrapper;