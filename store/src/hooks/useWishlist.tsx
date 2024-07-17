import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { wishlist as serverSideWishlist } from "../client/api";
import { useIsAuthenticated } from "@refinedev/core";
import _debounce from "lodash/debounce";
import { TOKEN_KEY } from "@/authProvider";

/**
 * A custom React hook that provides wishlist functionality.
 * The hook manages the wishlist state, including adding items to the wishlist, removing items from the wishlist,
 * resetting the wishlist, and keeping track of the wishlist count and total.
 * The wishlist state is synchronized with the server-side wishlist and stored in the local storage.
 * The local wishlist is used as the single source of truth for the wishlist data.
 *
 * @returns An object containing the wishlist state and functions to interact with the wishlist:
 *   - `wishlist`: A record of item codes and their quantities in the wishlist.
 *   - `isOpen`: A boolean indicating whether the wishlist is open or closed.
 *   - `wishlistCount`: The total number of items in the wishlist.
 *   - `addToWishlist`: A function to add an item to the wishlist.
 *   - `removeFromWishlist`: A function to remove an item from the wishlist.
 *   - `resetWishlist`: A function to reset the wishlist.
 *   - `setIsOpen`: A function to toggle the wishlist open or closed.
 */

interface Wishlist {
  wishlist: string[];
  serverWishlist: Record<string, any>;
  wishlistCount: number;
  addToWishlist: (itemCode: string, quantity?: number) => void;
  removeFromWishlist: (itemCode: string) => void;
  resetWishlist: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean | undefined | null) => void;
}

export const WishlistContext = createContext<Wishlist>({
  wishlist: [],
  serverWishlist: {},
  wishlistCount: 0,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  resetWishlist: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isOpen, _] = useState<boolean>(false);
  const wishlistCount: number = wishlist.length ?? 0;

  const { isLoading, data: authState } = useIsAuthenticated();

  const { data: serverWishlist, refetch: refreshServerWishlist } = useQuery({
    queryKey: ["data", "storeProvider", "wishlist", "list", {}],
    queryFn: () =>
      serverSideWishlist.list(localStorage.getItem(TOKEN_KEY) ?? ""),
    enabled: authState?.authenticated && !isLoading,
    initialData: {
      data: {
        items: [],
      },
    },
  });

  const syncWishlistToServer = useCallback(
    _debounce(
      (wishlist: string[]) =>
        serverSideWishlist.update(wishlist).then(() => refreshServerWishlist()),
      500
    ),
    []
  );

  useEffect(() => {
    const wishlist = localStorage.getItem("wishlist");
    if (wishlist && wishlist !== "[]") {
      setWishlist(JSON.parse(wishlist));
    } else {
      //   get from server
      refreshServerWishlist().then(({ data }) => {
        setWishlist(data.data.items?.map((item: any) => item.item_code) ?? []);
      });
    }
  }, []);

  useEffect(() => {
    // sync wishlist state in local storage
    if (wishlist.length) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    // sync wishlist state in server
    if (authState?.authenticated) {
      syncWishlistToServer(wishlist);
    }
  }, [wishlist]);

  const setIsOpen = (value: boolean | undefined | null) => {
    if (value !== undefined && value !== null) {
      return _(value);
    }
    return _(!isOpen);
  };

  const addToWishlist = async (itemCode: string) => {
    setWishlist((prevWishlist) => {
      return Array.from(new Set([...prevWishlist, itemCode]));
    });
  };

  const removeFromWishlist = (itemCode: string) => {
    setWishlist((prevWishlist) => {
      return prevWishlist.filter((code) => code !== itemCode);
    });
  };

  const resetWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        serverWishlist,
        isOpen,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        resetWishlist,
        setIsOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
