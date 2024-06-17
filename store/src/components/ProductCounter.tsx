import { useCart } from "@/hooks/useCart";
import { Button } from "./ui/button";
import { Minus, Plus } from "@untitled-ui/icons-react";
import { useTranslate } from "@refinedev/core";

type ProductCounterProps = {
  itemCode: string;
  size: "sm" | "lg";
  type: "readonly" | "editable";
};

const ProductCounter = ({
  itemCode,
  size = "sm",
  type = "editable",
}: ProductCounterProps) => {
  const t = useTranslate();
  const { cart, addToCart } = useCart();
  return (
    <div className="flex items-center justify-between lg:justify-start w-full">
      <h2 className="text-darkgray-400 lg:hidden text-sm">{t("Quantity")}</h2>
      <div className="flex items-center rounded-xl bg-darkgray-100 h-12.5 text-darkgray-200">
        <Button
          variant="ghost"
          size={size}
          onClick={() => addToCart(itemCode, -1)}
          className="px-4 !bg-darkgray-100"
        >
          <Minus className={size === "sm" ? "h-3 w-3" : "h-5 w-5"} />
        </Button>
        {type === "editable" ? (
          <input
            className="w-[22px] text-center !bg-darkgray-100"
            type="number"
            value={cart[itemCode] ?? 0}
            onChange={(e) => addToCart(itemCode, +e.target.value)}
          />
        ) : (
          <span className="px-2">{cart[itemCode] ?? 0}</span>
        )}
        <Button
          variant="ghost"
          size={size}
          onClick={() => addToCart(itemCode)}
          className="px-4 !bg-darkgray-100"
        >
          <Plus className={size === "sm" ? "h-3 w-3" : "h-5 w-5"} />
        </Button>
      </div>
    </div>
  );
};

export default ProductCounter;
