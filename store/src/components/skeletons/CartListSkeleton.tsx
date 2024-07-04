import { Skeleton } from "../ui/skeleton";
import ItemSkeleton from "./ItemSkeleton";
import { Separator } from "@/components/ui/separator";

const CartListSkeleton = () => {
  return (
    <section>
      <div className="flex flex-col gap-y-4 lg:mr-5">
        <ul className="my-3 flex flex-col ">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </ul>
      </div>

      <div className="lg:ml-[69px] lg:mr-5">
        <Separator className="my-4 bg-[#E3E3E3]" />
        <div className="flex flex-col gap-y-4">
          <div className="w-full flex justify-between text-sm">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="w-full flex justify-between text-sm">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="w-full flex justify-between text-sm">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <Separator className="my-4 bg-[#E3E3E3]" />
      </div>
    </section>
  );
};

export default CartListSkeleton;
