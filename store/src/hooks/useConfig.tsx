import { useCustom } from "@refinedev/core";

export const useConfig = () => {
  const { data, isLoading, isFetching, isRefetching } = useCustom({
    dataProviderName: "storeProvider",
    url: "get_config",
    method: "get",
  });

  return {
    config: data?.message,
    isLoading: isLoading || isFetching || isRefetching,
  };
};
