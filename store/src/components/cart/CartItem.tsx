import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useOne } from "@refinedev/core";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import CartItemSkeleton from "../skeletons/CartItemSkeleton";
import { getFileURL } from "@/lib/utils";
import { useConfig } from "@/hooks/useConfig";

type CartItemProps = {
  itemCode: string;
};

const CartItem = ({ itemCode }: CartItemProps) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { config } = useConfig();
  const { data, isLoading, isFetching, isRefetching } = useOne({
    resource: "products",
    id: itemCode,
  });

  if (isLoading || isFetching || isRefetching) {
    return <CartItemSkeleton />;
  }

  const item = data?.message.product_info;

  return (
    <li className="flex">
      <div className="h-[90px] min-w-[90px] max-w-[90px]">
        <Link to={`/product/${itemCode}`}>
          <img
            src={
              getFileURL(item.thumbnail) ??
              getFileURL(config?.default_product_image) ??
              ""
            }
            alt={item.web_item_name}
            className="h-full w-full object-cover object-center rounded-lg"
          />
        </Link>
      </div>
      <div className="ml-[10px] flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h3 className="text-sm">
              <Link to={`/product/${itemCode}`}>{item.web_item_name}</Link>
            </h3>
            <p className="ml-4 whitespace-pre text-sm font-semibold">
              {item.price?.formatted_price}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center rounded-lg bg-slate-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addToCart(itemCode, -1)}
            >
              <Minus size={12} />
            </Button>
            <span className="px-2">{cart[itemCode]}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addToCart(itemCode)}
            >
              <Plus size={12} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-5 text-gray-500 hover:text-gray-900 hover:bg-transparent"
            onClick={() => removeFromCart(itemCode)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
