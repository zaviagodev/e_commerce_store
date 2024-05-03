import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import ProductCard from "./ProductCard";
import { useTable, useTranslate } from "@refinedev/core";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";

const RelatedProducts = () => {
  const t = useTranslate();
  const { config } = useConfig();

  const {
    tableQueryResult: { data: tableData, isFetching, isLoading, isRefetching },
  } = useTable();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-semibold">
        {t("Related Products")}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 mx-1 my-4">
        {isFetching || isLoading || isRefetching ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          <>
            {(tableData?.data ?? [])
              .map((item) => (
                <ProductCard
                  key={item.item_code}
                  itemCode={item.item_code}
                  name={item.item_name}
                  price={item.formatted_price}
                  originalPrice={item.formatted_mrp}
                  image={
                    getFileURL(item.website_image) ??
                    getFileURL(config?.default_product_image) ??
                    ""
                  }
                  width={341}
                  height={341}
                />
              ))
              .slice(0, 4)}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
