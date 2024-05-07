import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

const CheckoutDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[120px]"/>
        <Skeleton className="h-4 w-12"/>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[100px]"/>
        <Skeleton className="h-4 w-12"/>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20"/>
        <Skeleton className="h-4 w-12"/>
      </div>

      <Skeleton className="my-4 h-4 w-[100px]"/>

      <Separator className="bg-[#E3E3E3]" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20"/>
        <Skeleton className="h-4 w-12"/>
      </div>
    </div>
  )
}

export default CheckoutDetailSkeleton