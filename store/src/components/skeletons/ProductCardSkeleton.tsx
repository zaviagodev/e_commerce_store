import { Skeleton } from "../ui/skeleton";
import SvgSkeleton from "./SvgSkeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="space-y-6 rounded overflow-hidden">
      <div>
        <div className="aspect-square relative">
          <SvgSkeleton className="mx-auto object-cover transition-all aspect-square w-full h-full" />
        </div>
      </div>
      <div className="space-y-6">
        <h3>
          <Skeleton className="w-[168px] max-w-full">
            <br />
          </Skeleton>
        </h3>
        <p>
          <Skeleton className="w-20 max-w-full">
            <br />
          </Skeleton>
        </p>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
