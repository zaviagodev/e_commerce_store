import { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import { Calculator, Calendar, Smile } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useList, useTranslate } from "@refinedev/core";

const ProductSearch = () => {
  const [search, setSearch] = useState("");
  const t = useTranslate();
  const { data, refetch } = useList({
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

  const refetchProducts = useCallback(_debounce(refetch, 300), []);

  useEffect(() => {
    if (search !== "") {
      refetchProducts();
    }
  }, [search]);

  const products = data?.data ?? [];

  return (
    <Command className="rounded-lg bg-input relative overflow-visible z-50">
      <CommandInput
        placeholder={t("Search...")}
        value={search ?? ""}
        onValueChange={setSearch}
      />
      {products.length > 0 && (
        <CommandList className="absolute w-full top-10  bg-input rounded-b-lg">
          <CommandEmpty>{t("No results found.")}</CommandEmpty>
          <CommandGroup heading={t("Suggestions")}>
            {products.map((product) => (
              <CommandItem key={product.item_code}>
                <span>{product.item_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};

export default ProductSearch;
