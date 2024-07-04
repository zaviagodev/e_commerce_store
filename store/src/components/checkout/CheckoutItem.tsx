import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import { useOne } from "@refinedev/core";
import { Skeleton } from "../ui/skeleton";
import ItemSkeleton from "../skeletons/ItemSkeleton";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  if (isLoading) {
    return <ItemSkeleton />;
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
          {/* {qty} {`${item.uom}${(qty ?? 0) > 1 ? "s" : ""}`} */}
          {/* I have used the condition of item.uom === "Unit" to translate the word 'Unit' into Thai */}
          {qty}{" "}
          {`${
            item.uom === "Unit" ? ((qty ?? 0) > 1 ? t("Units") : t("Unit")) : ""
          }`}
        </strong>
      </div>
      <div className="text-sm font-semibold">
        <p className={item.price?.formatted_mrp ? "text-red-500" : ""}>
          {item.price?.formatted_price}
        </p>
        {item.price?.formatted_mrp && (
          <p className="text-darkgray-400 line-through">
            {item.price?.formatted_mrp}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutItem;
