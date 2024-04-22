import {
  IResourceComponentsProps,
  useParsed,
  useTranslate,
  useTable,
} from "@refinedev/core";
import React, { useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      SetURLSearchParams({
        resetPagenation: "0",
      });
    }
  }, [filters, resetPagenation]);

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-4xl font-semibold text-center mb-6">
        {t("All products")}
      </h1>
      <div className="flex justify-between items-center">
        {tableData ? (
          <div>
            <strong>{t("All products")}</strong> 
            <span className="text-darkgray-300"> ({tableData?.total} {t(tableData?.total === 1 ? "Item" : "Items")})</span>
          </div>
        ) : null}
        {/* TODO: integrate it later 
        <div className="flex items-center gap-4">
          <strong>{t("Sort by")}</strong>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("Default")}</SelectItem>
              <SelectItem value="dark">{t("Price High to Low")}</SelectItem>
              <SelectItem value="system">{t("Price Low to High")}</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
      {isFetching || isLoading || isRefetching ? (
        <ProductListSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
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
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  title="Previous Page"
                  onClick={() => previousPage()}
                  disabled={!getCanPreviousPage()}
                />
              </PaginationItem>
              {pageCount > numberOfLastPageLinks &&
                Array.from({
                  length: 4,
                }).map((_, index) => {
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
