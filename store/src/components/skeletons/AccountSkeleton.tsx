import { Skeleton } from "../ui/skeleton"

const AccountSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-10">
        <Skeleton className="h-3 w-16"/>
        <Skeleton className="h-[60px] w-full"/>
        <Skeleton className="h-[200px] w-full"/>
      </div>
  )
}

export default AccountSkeleton