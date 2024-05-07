import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import CheckoutDetailSkeleton from "./CheckoutDetailSkeleton"

const PaymentSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-9">
      <div className="flex flex-col gap-y-6 items-center">
        <Skeleton className="h-4 w-40"/>
        <div className="flex flex-col gap-y-2 items-center">
          <Skeleton className="h-3 w-[120px]"/>
          <Skeleton className="h-3 w-[200px]"/>
        </div>
      </div>

      <Skeleton className="h-12.5 w-full rounded-xl mt-3"/>

      <div className="flex flex-col items-center gap-y-6 w-full">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-3 w-[120px]"/>
          <Skeleton className="h-3 w-20"/>
        </div>
        <Skeleton className="h-6 w-[240px]"/>
      </div>

      <div className="flex flex-col items-center gap-y-3 w-full">
        <Skeleton className="h-12.5 w-full rounded-xl"/>
        <Skeleton className="h-3 w-[100px]"/>
      </div>

      <Skeleton className="h-[200px] w-full rounded-xl"/>

      <div className="flex flex-col gap-y-9 w-full">
        <div className="flex justify-between">
          <div className="flex gap-x-4">
            <Skeleton className="h-[53px] w-[53px]"/>
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-3 w-[160px]"/>
              <Skeleton className="h-3 w-9" />
            </div>
          </div>

          <Skeleton className="h-3 w-10"/>
        </div>

        <div className="flex justify-between w-full">
          <div className="flex gap-x-4">
            <Skeleton className="h-[53px] w-[53px]"/>
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-3 w-[160px]"/>
              <Skeleton className="h-3 w-9" />
            </div>
          </div>

          <Skeleton className="h-3 w-10"/>
        </div>
      </div>

      <Separator className="bg-[#E3E3E3]"/>

      <div className="w-full">
        <CheckoutDetailSkeleton />
      </div>
    </div>
  )
}

export default PaymentSkeleton