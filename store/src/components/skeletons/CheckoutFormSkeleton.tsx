import { Skeleton } from "../ui/skeleton";

const CheckoutFormSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton className="rounded w-1/2">
        <h2 className="font-semibold text-darkgray-500 text-lg hidden lg:block opacity-0">
          .
        </h2>
      </Skeleton>
      <form className="lg:mt-6 flex flex-col gap-y-6">
        <div className="space-y-1">
          <Skeleton className="rounded w-1/4 mb-2">
            <h4 className="text-darkgray-200 font-semibold text-base opacity-0">
              Address
            </h4>
          </Skeleton>
          <Skeleton className="h-40 rounded-xl w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="rounded w-1/3 mb-2">
            <h4 className="text-darkgray-200 font-semibold text-base opacity-0">
              Shipping Rule
            </h4>
          </Skeleton>
          <Skeleton className="h-14 rounded-xl w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="rounded w-1/3 mb-2">
            <h4 className="text-darkgray-200 font-semibold text-base opacity-0">
              Payment Method
            </h4>
          </Skeleton>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-14 rounded-xl w-full" />
            <Skeleton className="h-14 rounded-xl w-full" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-14 rounded-xl w-full" />
        </div>
        <div className="-mt-4">
          <Skeleton className="rounded">
            <p className="text-sm text-darkgray-200 opacity-0">
              Terms of Service
            </p>
          </Skeleton>
          <Skeleton className="mt-1 rounded w-1/2">
            <p className="text-sm text-darkgray-200 opacity-0">
              Terms of Service
            </p>
          </Skeleton>
        </div>
      </form>
    </div>
  );
};

export default CheckoutFormSkeleton;
