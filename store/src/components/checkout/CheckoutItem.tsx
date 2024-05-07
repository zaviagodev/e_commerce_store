import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import { useOne } from "@refinedev/core";
import { Skeleton } from "../ui/skeleton";
import ItemSkeleton from "../skeletons/ItemSkeleton";

type CheckoutItemProps = {
  itemCode: string;
  qty: number;
};

const CheckoutItem = ({ itemCode, qty }: CheckoutItemProps) => {
  const { config } = useConfig();
  const { data, isLoading } = useOne({
    resource: "products",
    id: itemCode,
  });

  if (isLoading) {
    return <ItemSkeleton />
  }

  const item = data?.message.product_info;

  return (
    <div key={itemCode} className="flex gap-x-4">
      <div className="w-[53px] h-[53px] bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={
            getFileURL(item.thumbnail) ??
            getFileURL(config?.default_product_image) ??
            ""
          }
          alt={item.web_item_name || "product-item"}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm text-darkgray-500">{item.web_item_name}</p>
        <strong className="text-sm">
          {qty} {`${item.uom}${(qty ?? 0) > 1 ? "s" : ""}`}
        </strong>
      </div>
      <div>
        <p className="text-sm font-semibold">
          {item.price?.formatted_price}
        </p>
      </div>
    </div>
  );
};

export default CheckoutItem;
