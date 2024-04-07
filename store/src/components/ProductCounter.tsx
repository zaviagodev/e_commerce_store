import { useCart } from "@/hooks/useCart";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

type ProductCounterProps = {
  itemCode: string;
  size: "sm" | "lg";
};

const ProductCounter = ({ itemCode, size = "sm" }: ProductCounterProps) => {
  const { cart, addToCart } = useCart();
  return (
    <div className="flex items-center rounded-lg bg-slate-50">
      <Button
        variant="ghost"
        size={size}
        onClick={() => addToCart(itemCode, -1)}
      >
        <Minus size={size === "sm" ? 12 : 18} />
      </Button>
      <span className="px-2">{cart[itemCode] ?? 0}</span>
      <Button variant="ghost" size={size} onClick={() => addToCart(itemCode)}>
        <Plus size={size === "sm" ? 12 : 18} />
      </Button>
    </div>
  );
};

export default ProductCounter;
