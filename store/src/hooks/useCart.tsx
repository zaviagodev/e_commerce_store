import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { products, cart as serverSideCart } from "../client/api";
import { useIsAuthenticated } from "@refinedev/core";
import _debounce from "lodash/debounce";

/**
 * A custom React hook that provides cart functionality.
 * The hook manages the cart state, including adding items to the cart, removing items from the cart,
 * resetting the cart, and keeping track of the cart count and total.
 * The cart state is synchronized with the server-side cart and stored in the local storage.
 * The local cart is used as the single source of truth for the cart data.
 *
 * @returns An object containing the cart state and functions to interact with the cart:
 *   - `cart`: A record of item codes and their quantities in the cart.
 *   - `isOpen`: A boolean indicating whether the cart is open or closed.
 *   - `cartCount`: The total number of items in the cart.
 *   - `cartTotal`: The total price of all items in the cart.
 *   - `addToCart`: A function to add an item to the cart.
 *   - `removeFromCart`: A function to remove an item from the cart.
 *   - `resetCart`: A function to reset the cart.
 *   - `setIsOpen`: A function to toggle the cart open or closed.
 *   - `updateCart`: A function to give loading as a reaction to any cart update.
 */

interface Cart {
  cart: Record<string, number | undefined>;
  isServerCartLoading: boolean;
  serverCart: Record<string, any>;
  cartCount: number;
  addToCart: (itemCode: string, quantity?: number) => void;
  removeFromCart: (itemCode: string) => void;
  resetCart: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean | undefined | null) => void;
  cartTotal: number | "Loading";
  updateCart: (fn: (...args: any) => Promise<any>, ...args: any) => any;
}

export const CartContext = createContext<Cart>({
  cart: {},
  isServerCartLoading: false,
  serverCart: {},
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  resetCart: () => {},
  isOpen: false,
  setIsOpen: () => {},
  cartTotal: 0,
  updateCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number | undefined>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOpen, _] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number | "Loading">(0);
  const cartCount: number = Object.keys(cart).reduce(
    (acc, cur) => acc + (cart[cur] ?? 0),
    0
  );

  const { isLoading, data: authState } = useIsAuthenticated();
  const queryClient = useQueryClient();

  const {
    data: serverCart,
    refetch: refreshServerCart,
    isLoading: isServerCartLoading,
    isFetching: isServerCartFetching,
    isRefetching: isServerCartRefetching,
  } = useQuery({
    queryKey: ["data", "storeProvider", "cart", "list", {}],
    queryFn: serverSideCart.get,
    enabled: authState?.authenticated && !isLoading,
  });

  const syncCartToServer = useCallback(
    _debounce(
      (cart: Record<string, number | undefined>) =>
        serverSideCart.update(cart).then(() => refreshServerCart()),
      3000
    ),
    []
  );

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (
      cart &&
      cart !== "{}" &&
      !!Object.values<number>(JSON.parse(cart ?? "{}")).find((qty) => qty > 0)
    ) {
      setCart(JSON.parse(cart));
    } else {
      // fetch cart from server
      if (authState?.authenticated) {
        console.log("fetching cart from server", localStorage.getItem("cart"));
        refreshServerCart().then(({ data }) => {
          setCart(
            (data?.message?.doc.items ?? []).reduce(
              (acc: Record<string, number>, cur: any) => {
                acc[cur.item_code] = cur.qty;
                return acc;
              },
              {} as Record<string, number>
            )
          );
        });
      }
    }
  }, [authState?.authenticated]);

  useEffect(() => {
    setCartTotal("Loading");
    // sync cart state in local storage
    if (Object.keys(cart).length) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    // sync cart state in server
    if (authState?.authenticated) {
      syncCartToServer(cart);
    }
    // update cart total
    getTotal().then(setCartTotal);
  }, [cart, authState?.authenticated]);

  const setIsOpen = (value: boolean | undefined | null) => {
    if (value !== undefined && value !== null) {
      return _(value);
    }
    return _(!isOpen);
  };

  const addToCart = async (itemCode: string, quantity?: number) => {
    setCart((prevCart) => {
      if (quantity && quantity >= 0) {
        return {
          ...prevCart,
          [itemCode]: quantity,
        };
      }
      if (quantity && quantity < 0) {
        const newQty = (prevCart[itemCode] ?? 0) + quantity;
        if (newQty <= 0) {
          return {
            ...prevCart,
            [itemCode]: 0,
          };
        }
        return {
          ...prevCart,
          [itemCode]: newQty,
        };
      }
      return {
        ...prevCart,
        [itemCode]: quantity ?? (prevCart[itemCode] ?? 0) + 1,
      };
    });
  };

  const removeFromCart = (itemCode: string) => {
    setCart((prevCart) => {
      return {
        ...prevCart,
        [itemCode]: 0,
      };
    });
  };

  const resetCart = () => setCart({});

  const getTotal = async () => {
    const total = await Promise.all(
      Object.keys(cart).map(async (itemCode) =>
        queryClient
          .fetchQuery({
            queryFn: () => products.get(itemCode),
            queryKey: [
              "data",
              "storeProvider",
              "products",
              "one",
              itemCode,
              {},
            ],
            staleTime: 60000 * 5,
          })
          .then(
            (res) =>
              (res.message.product_info?.price?.price_list_rate ?? 0) *
              (cart[itemCode] ?? 0)
          )
      )
    );
    return total.reduce((acc, cur) => acc + cur, 0);
  };

  const updateCart = async (
    fn: (...args: any) => Promise<any>,
    ...args: any
  ) => {
    console.log("start Syncing");
    setIsSyncing(true);
    return fn(...args)
      .then((res: any) => res)
      .finally(() => setIsSyncing(false));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isServerCartLoading:
          isSyncing ||
          isServerCartLoading ||
          isServerCartFetching ||
          isServerCartRefetching,
        serverCart,
        isOpen,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        resetCart,
        setIsOpen,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
