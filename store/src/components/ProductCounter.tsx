import { useCart } from "@/hooks/useCart";
import { Button } from "./ui/button";
import { Minus, Plus } from "@untitled-ui/icons-react";
import { useTranslate } from "@refinedev/core";

type ProductCounterProps = {
  itemCode: string;
  count?: number;
  onCountChange?: (count: number) => void;
  size: "sm" | "lg";
  type: "readonly" | "editable";
};

const ProductCounter = ({
  itemCode,
  count = 0,
  onCountChange,
  size = "sm",
  type = "readonly",
}: ProductCounterProps) => {
  const t = useTranslate();
  const { cart, addToCart } = useCart();

  if (
    type === "editable" &&
    (count === undefined ||
      count === null ||
      onCountChange === undefined ||
      onCountChange === null)
  ) {
    throw new Error("count and onCountChange are required for editable type");
  }

  return (
    <div className="flex items-center justify-between lg:justify-start w-full">
      <h2 className="text-darkgray-400 lg:hidden text-sm">{t("Quantity")}</h2>
      <div className="flex items-center rounded-xl bg-darkgray-100 h-12.5 text-darkgray-200">
        <Button
          variant="ghost"
          size={size}
          onClick={() =>
            type === "editable"
              ? onCountChange &&
                onCountChange(Number(count) - 1 >= 0 ? Number(count) - 1 : 0)
              : addToCart(itemCode, -1)
          }
          className="px-4 !bg-darkgray-100"
        >
          <Minus className={size === "sm" ? "h-3 w-3" : "h-5 w-5"} />
        </Button>
        {type === "editable" ? (
          <input
            className="w-[22px] text-center !bg-darkgray-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            type="number"
            value={count ?? 0}
            onChange={(e) =>
              onCountChange && onCountChange(Number(e.target.value))
            }
          />
        ) : (
          <span className="px-2">{cart[itemCode] ?? 0}</span>
        )}
        <Button
          variant="ghost"
          size={size}
          onClick={() =>
            type === "editable"
              ? onCountChange && onCountChange(Number(count) + 1)
              : addToCart(itemCode)
          }
          className="px-4 !bg-darkgray-100"
        >
          <Plus className={size === "sm" ? "h-3 w-3" : "h-5 w-5"} />
        </Button>
      </div>
    </div>
  );
};

export default ProductCounter;
