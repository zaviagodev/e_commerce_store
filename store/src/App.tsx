import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { type ClientParams } from "refine-frappe-provider";
import { authProvider } from "./authProvider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/layout";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notificationProvider } from "./providers/notificationProvider";
import { ProductList } from "./pages/products/list";
import { storeProvider } from "./dataProviders/storeProvider";
import {
  dataProvider as frappeDataProvider,
  authProvider as frappeAuthProvider,
} from "refine-frappe-provider";
import { AddressList } from "./pages/address/list";
import AddressCreate from "./pages/account/AddressCreate";
import { AddressEdit } from "./pages/account/AddressEdit";
import { CartProvider } from "./hooks/useCart";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProductShow } from "./pages/products/show";
import { WishlistProvider } from "./hooks/useWishlist";
import Account from "./pages/account";
import Profile from "./pages/account/Profile";
import Addresses from "./pages/account/Addresses";
import Checkout from "./pages/checkout";
import { ResetPassword } from "./pages/resetPassword";
import LangSelect from "./components/LangSelect";
import OrderList from "./pages/orders/list";
import OrderDetail from "./pages/orders/show";
import { PaymentProvider } from "./pages/checkout/Payment";
import { ConfigProvider, useConfig } from "./hooks/useConfig";
import { useEffect } from "react";

const providerConfig = {
  url: import.meta.env.VITE_BACKEND_URL,
} satisfies ClientParams;

function App() {
  const { t, i18n } = useTranslation();
  const { config } = useConfig();

  useEffect(() => {
    if (!localStorage.getItem("locale") && config?.default_language) {
      i18n.changeLanguage(config.default_language);
    }
  }, [config]);

  const i18nProvider = {
    translate: (key: string, params: Record<string, string>) => t(key, params),
    changeLocale: (lang: string) => {
      localStorage.setItem("locale", lang);
      return i18n.changeLanguage(lang);
    },
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter basename="/store">
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={{
              default: dataProvider("https://api.fake-rest.refine.dev"),
              storeProvider: storeProvider,
              frappeeProvider: frappeDataProvider(providerConfig),
            }}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
            resources={[
              {
                name: "products",
                meta: {
                  dataProviderName: "storeProvider",
                },
                list: "/",
                show: "/product/:id",
              },
              {
                name: "address",
                list: "/account/addresses",
                create: "/account/addresses/new",
                edit: "/account/addresses/:id",
                meta: {
                  dataProviderName: "storeProvider",
                },
              },
              {
                name: "orders",
                list: "/account/orders",
                show: "/account/orders/:id",
                meta: {
                  dataProviderName: "storeProvider",
                },
              },
              {
                name: "blog_posts",
                list: "/blog-posts",
                create: "/blog-posts/create",
                edit: "/blog-posts/edit/:id",
                show: "/blog-posts/show/:id",
                meta: {
                  canDelete: true,
                },
              },
            ]}
            options={{
              reactQuery: {
                clientConfig: {
                  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
                },
              },
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "z8IRvt-f1kOr3-1a0UTY",
            }}
          >
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  <Route
                    element={
                      <Layout>
                        <Outlet />
                      </Layout>
                    }
                  >
                    <Route index element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductShow />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="products" />}
                    />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />}>
                      <Route index element={<Profile />} />
                      <Route path="addresses">
                        <Route index element={<Addresses />} />
                        <Route path=":id" element={<AddressEdit />} />
                        {/* <Route path="new" element={<AddressCreate />} /> */}
                      </Route>
                      <Route path="orders">
                        <Route index element={<OrderList />} />
                        <Route path=":id" element={<OrderDetail />} />
                      </Route>
                    </Route>
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />R
                    </Route>
                    <Route path="/address">
                      <Route index element={<AddressList />} />
                      <Route path="create" element={<AddressCreate />} />
                      <Route path="edit/:id" element={<AddressEdit />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Outlet />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/checkout/payment"
                      element={<PaymentProvider />}
                    />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/reset-password/:key"
                      element={<ResetPassword />}
                    />
                  </Route>
                </Routes>
              </WishlistProvider>
            </CartProvider>
            <RefineKbar />
            {config?.enable_i18n && (
              <LangSelect className="fixed bottom-16 right-4 w-max max-w-[180px] z-30" />
            )}
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

function AppWrapper() {
  return (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  );
}

export default AppWrapper;
