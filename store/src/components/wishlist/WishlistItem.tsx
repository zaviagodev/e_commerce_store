import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useOne } from "@refinedev/core";
import { useWishlist } from "@/hooks/useWishlist";
import { Link } from "react-router-dom";
import WishlistItemSkeleton from "../skeletons/WishlistItemSkeleton";

type WishlistItemProps = {
  itemCode: string;
};

const WishlistItem = ({ itemCode }: WishlistItemProps) => {
  const { removeFromWishlist } = useWishlist();
  const { data, isLoading, isFetching, isRefetching } = useOne({
    resource: "products",
    id: itemCode,
  });

  if (isLoading || isFetching || isRefetching) {
    return <WishlistItemSkeleton />;
  }

  const item = data?.message.product_info;

  return (
    <li className="flex">
      <div className="h-[90px] min-w-[90px] max-w-[90px]">
        <Link to={`/product/${itemCode}`}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${item.thumbnail}`}
            alt="มินิบราวนี่ 18 ชิ้น | Mini-brownie 18 ps."
            className="h-full w-full object-cover object-center rounded-lg"
          />
        </Link>
      </div>
      <div className="ml-[10px] flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between text-gray-900">
            <h3 className="text-texttag hover:underline text-[13px] leading-[17px]">
              <Link to={`/product/${itemCode}`}>{item.web_item_name}</Link>
            </h3>
            <p className="ml-4 whitespace-pre text-sm font-semibold">
              {item.price?.formatted_price ?? "0"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end text-base">
          <Button
            variant="ghost"
            size="icon"
            className="w-5 text-gray-500 hover:text-gray-900 hover:bg-transparent"
            onClick={() => removeFromWishlist(itemCode)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WishlistItem;
