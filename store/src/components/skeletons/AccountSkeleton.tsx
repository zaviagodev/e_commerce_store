import { Skeleton } from "../ui/skeleton";

const AccountSkeleton = () => {
  return (
    <div className="lg:w-[410px] mx-auto">
      <h1>
        <Skeleton className="w-[120px] max-w-full" />
      </h1>
      <div className="mt-6">
        <h1 className="mb-2">
          <Skeleton className="w-[152px] max-w-full" />
        </h1>
        <form className="space-y-3">
          <div className="space-y-2">
            <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 form-input">
              <Skeleton className="w-[80px] max-w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 form-input">
              <Skeleton className="w-[72px] max-w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 form-input">
              <Skeleton className="w-[40px] max-w-full" />
            </div>
          </div>
          <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 !mt-6">
            <Skeleton className="w-[350px] max-w-full" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSkeleton;
