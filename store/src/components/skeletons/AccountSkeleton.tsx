import { Skeleton } from "../ui/skeleton"

const AccountSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-10">
      <Skeleton className="h-3 w-16"/>
      <Skeleton className="h-[60px] w-full rounded-xl"/>
      <div className="flex flex-col gap-y-3">
        <Skeleton className="h-3 w-[120px]"/>
        <Skeleton className="h-12.5 w-full rounded-xl"/>
        <Skeleton className="h-12.5 w-full rounded-xl"/>
        <Skeleton className="h-12.5 w-full rounded-xl"/>
      </div>
    </div>
  )
}

export default AccountSkeleton