import { Skeleton } from "../ui/skeleton";
import SvgSkeleton from "./SvgSkeleton";

const WishlistItemSkeleton = () => {
  return (
    <li className="flex">
      <div className="h-[90px] min-w-[90px] max-w-[90px]">
        <a>
          <SvgSkeleton className="object-cover object-center rounded-lg w-full h-full" />
        </a>
      </div>
      <div className="ml-[10px] flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <Skeleton className="w-[168px] max-w-full">
              <h3 className="leading-[17px]">
                <br />
              </h3>
            </Skeleton>
            <Skeleton className="w-[56px] max-w-full">
              <p className="ml-4">
                <br />
              </p>
            </Skeleton>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="inline-flex items-center justify-center transition-colors h-10 w-5">
            <SvgSkeleton className="w-[25px] h-[18px]" />
          </div>
        </div>
      </div>
    </li>
  );
};

export default WishlistItemSkeleton;
