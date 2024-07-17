import { Button } from "../ui/button";
import { useOne } from "@refinedev/core";
import { useWishlist } from "@/hooks/useWishlist";
import { Link } from "react-router-dom";
import WishlistItemSkeleton from "../skeletons/WishlistItemSkeleton";
import { getFileURL } from "@/lib/utils";
import { useConfig } from "@/hooks/useConfig";
import { Trash01 } from "@untitled-ui/icons-react";
import ProgressiveImage from "../ProgressiveImage";

type WishlistItemProps = {
  itemCode: string;
};

const WishlistItem = ({ itemCode }: WishlistItemProps) => {
  const { removeFromWishlist } = useWishlist();
  const { config } = useConfig();
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
          <ProgressiveImage
            src={getFileURL(item.thumbnail) ?? "/product_placeholder.png"}
            alt={item.web_item_name}
            className="h-full w-full object-cover object-center rounded-lg"
            skeletonClassName="object-cover object-center rounded-lg w-full h-full"
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
            <Trash01 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WishlistItem;
