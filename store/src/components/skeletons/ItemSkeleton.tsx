import { Skeleton } from "../ui/skeleton"

const ItemSkeleton = () => {
  return (
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
  )
}

export default ItemSkeleton