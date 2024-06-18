import {
  IResourceComponentsProps,
  useParsed,
  useTranslate,
  useTable,
} from "@refinedev/core";
import React, { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "@/components/ProductCard";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";
import { useSearchParams } from "react-router-dom";
import usePagenation from "@/hooks/usePagenation";
import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterLines } from "@untitled-ui/icons-react";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const {
    params: { filters, resetPagenation },
  } = useParsed();
  const [_, SetURLSearchParams] = useSearchParams();
  const t = useTranslate();
  const { config } = useConfig();

  const {
    tableQueryResult: { data: tableData, isFetching, isLoading, isRefetching },
    current,
    setCurrent,
    pageCount,
    filters: appliedFilters,
    setFilters,
    setPageSize,
  } = useTable();

  // set the page size from the config for pagination
  useEffect(() => {
    if (config?.products_per_page) {
      setPageSize(config.products_per_page);
    }
  }, [config?.products_per_page]);

  const numberOfLastPageLinks = 4;

  const { nextPage, getCanNextPage, getCanPreviousPage, previousPage } =
    usePagenation({ current, setCurrent, pageCount });

  useEffect(() => {
    if (filters?.length) {
      // compare filters with appliedFilters
      // if they are not equal then update the filters
      if (JSON.stringify(filters) !== JSON.stringify(appliedFilters)) {
        setFilters(filters);
      }
    }

    if (resetPagenation == 1) {
      setCurrent(1);
      setFilters([], "replace");
      SetURLSearchParams({
        resetPagenation: "0",
      });
    }
  }, [filters, resetPagenation]);

  return (
    <div className="flex flex-col gap-y-6">
      {isFetching || isLoading || isRefetching ? (
        <Skeleton className="h-10 w-[200px] mx-auto mb-6" />
      ) : (
        <h1 className="text-4xl font-semibold text-center mb-6">
          {t("All products")}
        </h1>
      )}
      <div className="flex justify-between items-center">
        <div>
          <strong>{t("All products")}</strong>
          <span className="text-darkgray-300">
            {" "}
            {tableData?.total && (
              <>
                ({tableData?.total}{" "}
                {t(tableData?.total === 1 ? "Item" : "Items")})
              </>
            )}
          </span>
        </div>
        {/* TODO: integrate it later 
        <div className="flex items-center gap-4">
          <FilterLines className="h-5 w-5"/>
          <strong>{t("Sort by")}</strong>
          <Select>
            <SelectTrigger className="w-[140px] bg-darkgray-100 border-0 text-[#7A7A7A] font-semibold h-9">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("Default")}</SelectItem>
              <SelectItem value="dark">{t("Price High to Low")}</SelectItem>
              <SelectItem value="system">{t("Price Low to High")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        */}
      </div>
      {isFetching || isLoading || isRefetching ? (
        <ProductListSkeleton />
      ) : (
        <>
          {(tableData?.data as any).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
              {(tableData?.data ?? []).map((item) => (
                <ProductCard
                  key={item.item_code}
                  itemCode={item.item_code}
                  name={item.item_name}
                  price={item.formatted_price}
                  discount={item.discount}
                  originalPrice={item.formatted_mrp}
                  image={
                    getFileURL(item.website_image) ??
                    getFileURL(config?.default_product_image) ??
                    ""
                  }
                  hasVariants={item.has_variants}
                  width={341}
                  height={341}
                />
              ))}
            </div>
          ) : (
            <p className="text-darkgray-200 text-sm font-semibold text-center mt-8">{t("No products in this category")}</p>
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  title="Previous Page"
                  onClick={() => previousPage()}
                  disabled={!getCanPreviousPage()}
                />
              </PaginationItem>
              {Array.from({
                length: 4,
              }).map((_, index) => {
                if (index + 1 > pageCount) {
                  return null;
                }
                return (
                  <PaginationItem key={index} className="hidden md:block">
                    <PaginationLink
                      onClick={() => setCurrent(index + 1)}
                      disabled={current === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {pageCount > numberOfLastPageLinks && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pageCount > numberOfLastPageLinks &&
                Array.from({
                  length: 4,
                }).map((_, index) => {
                  if (
                    pageCount - (numberOfLastPageLinks - 1) + index <=
                      numberOfLastPageLinks ||
                    pageCount - (numberOfLastPageLinks - 1) + index > pageCount
                  ) {
                    return null;
                  }
                  return (
                    <PaginationItem key={index} className="hidden md:block">
                      <PaginationLink
                        onClick={() =>
                          setCurrent(
                            pageCount - (numberOfLastPageLinks - 1) + index
                          )
                        }
                        disabled={
                          current ===
                          pageCount - (numberOfLastPageLinks - 1) + index
                        }
                      >
                        {pageCount - (numberOfLastPageLinks - 1) + index}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  disabled={!getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};
