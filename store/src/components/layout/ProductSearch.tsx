import { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import { LoaderCircle, Smile } from "lucide-react";
import { useList, useTranslate } from "@refinedev/core";
import { SearchLg, XClose } from "@untitled-ui/icons-react";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

const ProductSearch = ({
  onSelect = (product: object) => {},
  className,
}: {
  onSelect: Function;
  className?: string;
}) => {
  const [search, setSearch] = useState("");
  const t = useTranslate();
  const { data, refetch, isFetching, isLoading } = useList({
    dataProviderName: "storeProvider",
    resource: "products",
    queryOptions: {
      enabled: false,
    },
    filters: [
      {
        field: "search",
        operator: "eq",
        value: search,
      },
    ],
  });

  const refetchProducts = useCallback(_debounce(refetch, 200), []);

  useEffect(() => {
    if (search !== "") {
      refetchProducts();
    }
  }, [search]);

  const products = data?.data ?? [];

  return (
    <>
      <div className="w-full flex flex-col gap-y-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={`relative flex items-center ${className}`}>
            <SearchLg className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("Search products")}
              className={`pl-12 w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-neutral-100 rounded-full border-neutral-100`}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            {search !== "" && (
              <XClose
                className="absolute right-4 h-5 w-5"
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </form>

        {isFetching ? (
          <p className="flex items-center gap-2">
            <LoaderCircle className="animate-spin" />
            {t("Searching")}...
          </p>
        ) : (
          <div className="space-y-6 font-semibold">
            <h2 className="text-darkgray-300 whitespace-pre">
              {products.length === 0 && search !== ""
                ? t("No products found")
                : t("Suggestions")}
            </h2>

            {search !== "" ? (
              <ul className="space-y-6">
                {products.map((product, index) => (
                  <li
                    key={product.item_code}
                    style={{
                      animation: `search-list 200ms forwards`,
                      opacity: 0,
                      animationDelay: `${50 * (index + 1)}ms`,
                    }}
                  >
                    <Link
                      to={`/product/${product.item_code}`}
                      className="flex items-center space-x-4"
                      onClick={() => onSelect(product)}
                    >
                      <img
                        src={product.website_image}
                        alt={product.item_name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex flex-col">
                        <span className="text-darkgray-300">
                          {product.web_item_name}
                        </span>
                        <span className="text-muted-foreground">
                          {product.formatted_price}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductSearch;
