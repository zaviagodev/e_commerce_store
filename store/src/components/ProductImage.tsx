import useConfig from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import { useOne } from "@refinedev/core";
import SvgSkeleton from "./skeletons/SvgSkeleton";

type ProductImageProps = {
  itemCode: string;
  [key: string]: any;
};

const ProductImage = ({ itemCode, ...props }: ProductImageProps) => {
  const { config } = useConfig();
  const { data, isLoading, isFetching, isRefetching } = useOne({
    resource: "products",
    id: itemCode,
  });

  if (isLoading || isFetching || isRefetching) {
    return (
      <SvgSkeleton className="object-cover object-center rounded-lg w-full h-full" />
    );
  }

  const item = data?.message.product_info;
  return (
    <img
      className="min-w-[120px] min-h-[120px] w-[120px] h-full rounded-md bg-gray-100 mx-auto mb-4"
      src={getFileURL(item.thumbnail) ?? "/product_placeholder.png"}
      alt={item.web_item_name}
      {...props}
    />
  );
};

export default ProductImage;
