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
import SingleOrderHistory from "./pages/SingleOrderHistory";
import { WishProvider } from "./hooks/useWishe";
import Wish from "./components/Wish";
import { SettingProvider } from "./hooks/useWebsiteSettings";
import MyAddresses from "./pages/MyAddresses";
import Register from "./pages/Register";

const Layer = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const currentPath = window.location.pathname;
    const formattedPath = currentPath.replace(/\/+$/, '');
    if (formattedPath === '/store') {
      navigate('/home/all items');
    }
  
  }, [navigate]);

  return (
    <>
      {window.location.pathname.includes('/checkout') || window.location.pathname.includes('/payment') ? null : <NavHeader />}
        <Outlet />
        <Wish/>
      <Cart />
    </>)
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layer/>}>
      <Route path="order-history" element={<OrderHistory />} />
      <Route path="home/:itemsgroup" element={<Home />} />
      <Route path="home/:itemsgroup/:pageno" element={<Home />} />
      <Route path="products/:id" element={<Product />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="my-addresses" element={<MyAddresses />} />
      <Route path="loyality-program" element={<LoyaltyProgram />} />
      <Route path="payment" element={<BankInfoPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path='order-history/:id' element={<SingleOrderHistory />} />
    </Route>
  ),
  {basename: "/store"}
);

export const AppWrapper = () => {

  return (
    <FrappeProvider
      url={import.meta.env.VITE_ERP_URL ?? ""}
      enableSocket={false}
      tokenParams={
        import.meta.env.VITE_USE_TOKEN_AUTH == 'true' ?
        {
          type: import.meta.env.VITE_TOKEN_TYPE ? import.meta.env.VITE_TOKEN_TYPE : "token", 
          useToken: true,
          token: () => import.meta.env.VITE_TOKEN_API ? `${import.meta.env.VITE_TOKEN_API}:${import.meta.env.VITE_TOKEN_SECRET}` : getToken,
        } : null
    }>
      <UserProvider>
      <SettingProvider>
      <OrderProvider>
      <ProductsProvider>
      <WishProvider>
      <CartProvider>
      <RouterProvider router={router}/>
      </CartProvider>
      </WishProvider>
      </ProductsProvider>
      </OrderProvider>
      </SettingProvider>
      </UserProvider>
    </FrappeProvider>
  )
}

export default AppWrapper;
