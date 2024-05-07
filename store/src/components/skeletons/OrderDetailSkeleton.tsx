import { Skeleton } from "@/components/ui/skeleton"
import { OrderListSkeleton } from "./OrderTableSkeleton"
import { Separator } from "../ui/separator"
import CheckoutDetailSkeleton from "./CheckoutDetailSkeleton"
import ItemSkeleton from "./ItemSkeleton"

const OrderDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-10">
      <OrderListSkeleton />

      <Separator className="bg-[#F4F4F4]"/>

      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-3 w-[100px]"/>
        <div className="flex items-center justify-between w-full">
          <Skeleton className="w-1/2 h-12.5"/>
          <Skeleton className="w-[100px] h-12.5"/>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-3 w-[100px]"/>
        <Skeleton className="h-[200px] w-full"/>
      </div>

      <div className="flex flex-col gap-y-8">
        <Skeleton className="h-3 w-[120px]"/>
        <div className="flex flex-col gap-y-5">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </div>
      </div>

      <div className="md:ml-[69px]">
        <Separator className="bg-[#F4F4F4] mb-4"/>
        <CheckoutDetailSkeleton />
      </div>

      <div className="flex items-center justify-center gap-10">
        <Skeleton className="h-3 w-[120px]"/>
        <Skeleton className="h-3 w-[120px]"/>
      </div>
    </div>
  )
}

export default OrderDetailSkeleton