import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import ProductCard from "../ProductCard";
import { useTable, useTranslate } from "@refinedev/core";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import { showProductSkeletons } from "../skeletons/ProductListSkeleton";
import { Skeleton } from "../ui/skeleton";

const RelatedProducts = () => {
  const { config } = useConfig();
  const t = useTranslate()

  const {
    tableQueryResult: { data: tableData, isFetching, isLoading, isRefetching },
    current,
    setCurrent,
    pageCount,
    filters: appliedFilters,
    setFilters,
    setPageSize,
  } = useTable();

  return (
    <>
      {isFetching || isLoading || isRefetching ? (
        <div className="space-y-6">
          <Skeleton className="h-6 w-40"/>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 mx-1 my-4">
            {showProductSkeletons(4)}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl lg:text-3xl font-semibold">{t("Related Products")}</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 mx-1 my-4">
            {(tableData?.data ?? []).map((item) => (
              <ProductCard
                key={item.item_code}
                itemCode={item.item_code}
                name={item.item_name}
                price={item.formatted_price}
                fullPrice={item.formatted_mrp}
                image={
                  getFileURL(item.website_image) ??
                  getFileURL(config?.default_product_image) ??
                  ""
                }
                width={341}
                height={341}
              />
            )).slice(0, 4)}
          </div>
        </div>
      )}
    </>
  )
}

export default RelatedProducts