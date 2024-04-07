import { Skeleton } from "../ui/skeleton";
import SvgSkeleton from "./SvgSkeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="space-y-3 rounded overflow-hidden">
      <div>
        <div className="aspect-square relative">
          <SvgSkeleton className="mx-auto object-cover transition-all hover:scale-105 aspect-square w-full h-full" />
          <div className=" inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-64 absolute bottom-2 left-1/2 -translate-x-1/2">
            <Skeleton className="w-[120px] max-w-full">
              <br />
            </Skeleton>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="leading-none">
          <Skeleton className="w-[168px] max-w-full">
            <br />
          </Skeleton>
        </h3>
        <p>
          <Skeleton className="w-[56px] max-w-full">
            <br />
          </Skeleton>
        </p>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
