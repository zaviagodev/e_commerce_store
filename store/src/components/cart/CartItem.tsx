import { Button } from "../ui/button";
import { useOne } from "@refinedev/core";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import CartItemSkeleton from "../skeletons/CartItemSkeleton";
import { getFileURL } from "@/lib/utils";
import { useConfig } from "@/hooks/useConfig";
import { Trash01, Minus, Plus } from "@untitled-ui/icons-react";

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
            <div className="ml-4 whitespace-pre text-sm font-semibold">
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
        </div>
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center rounded-lg bg-slate-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addToCart(itemCode, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <input
              className="w-10 text-center bg-slate-50"
              type="number"
              value={cart[itemCode] ?? 0}
              onChange={(e) => addToCart(itemCode, +e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addToCart(itemCode)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-5 text-gray-500 hover:text-gray-900 hover:bg-transparent"
            onClick={() => removeFromCart(itemCode)}
          >
            <Trash01 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
