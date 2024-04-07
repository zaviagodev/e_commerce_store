import { useCallback } from "react";

const usePagenation = ({ current, setCurrent, pageCount }: any) => {
  const getCanNextPage = useCallback(
    () => current < pageCount,
    [current, pageCount]
  );

  const nextPage = useCallback(() => {
    if (getCanNextPage()) {
      setCurrent((prev: number) => prev + 1);
    }
  }, [getCanNextPage, setCurrent]);

  const getCanPreviousPage = useCallback(() => current > 1, [current]);

  const previousPage = useCallback(() => {
    if (getCanPreviousPage()) {
      setCurrent((prev: number) => prev - 1);
    }
  }, [current, setCurrent]);

  return {
    getCanNextPage,
    nextPage,
    getCanPreviousPage,
    previousPage,
  };
};

export default usePagenation;
