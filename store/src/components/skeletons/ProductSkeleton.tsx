import SvgSkeleton from "./SvgSkeleton";
import { Skeleton } from "../ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-[18px] lg:gap-[33px] max-w-[1200px] mx-auto">
      <div className="relative flex w-full max-h-[600px] aspect-[4/3] pr-4 lg:pr-0">
        <div className="items-center relative flex-col h-full hidden lg:inline-flex">
          <div className="inline-flex items-center justify-center disabled:shadow-none p-1.5 gap-1.5 hover:shadow-md absolute z-10 top-4">
            <SvgSkeleton className="inline-block w-5 h-5" />
          </div>
          <div className="items-center w-full [&amp;::-webkit-scrollbar]:hidden [-ms-overflow-style:none] overflow-y-auto flex flex-col gap-4">
            <div className="md:w-[78px] md:h-auto relative shrink-0 pb-1 mx-4 -mb-2 border-b-4 snap-center transition-colors flex-grow md:flex-grow-0 border-primary-700">
              <SvgSkeleton className="border border-neutral-200 w-[78px] h-[78px]" />
            </div>
          </div>
          <div className="inline-flex items-center justify-center disabled:shadow-none p-1.5 gap-1.5 hover:shadow-md absolute z-10 bottom-4">
            <SvgSkeleton className="inline-block w-5 h-5" />
          </div>
        </div>
        <div className="items-center relative flex-col inline-flex h-full w-full m-auto">
          <div className="w-full h-full snap-x snap-mandatory [&amp;::-webkit-scrollbar]:hidden [-ms-overflow-style:none] overflow-y-auto flex flex-col gap-4">
            <div className="flex justify-center h-full basis-full shrink-0 grow snap-center w-full">
              <SvgSkeleton className="object-contain w-full min-w-[300px] h-full" />
            </div>
          </div>
        </div>
      </div>
      <section className="w-full lg:px-10 lg:py-[30px] lg:max-w-[536px] h-full top-0 z-10">
        <div className="flex flex-col gap-y-3 lg:gap-y-[10px]">
          <Skeleton className="w-[100px] max-w-full h-3">
            <br />
          </Skeleton>

          <Skeleton className="w-[350px] max-w-full h-7">
            <h1>
              <br />
            </h1>
          </Skeleton>

          <Skeleton className="w-[100px] max-w-full h-4">
            <p>
              <br />
            </p>
          </Skeleton>
          <span className="flex flex-col justify-start gap-2 my-3">
            <Skeleton className="w-[360px] max-w-full h-4">
              <span className="block">
                <br />
              </span>
            </Skeleton>
            <Skeleton className="w-[400px] max-w-full h-4">
              <span className="block">
                <br />
              </span>
            </Skeleton>
            <Skeleton className="w-[300px] max-w-full h-4">
              <span className="block">
                <br />
              </span>
            </Skeleton>
          </span>
        </div>
        <div className="leading-6 pb-[60px]">
          <p></p>
        </div>
        <div className="pb-6 border-gray-100 border-b">
          <div className="items-start flex flex-col gap-y-[14px]">
            <div className="flex items-center w-full justify-between lg:hidden">
              <Skeleton className="w-16 max-w-full h-3">
                <br />
              </Skeleton>
              <Skeleton className="w-[120px] max-w-full h-12.5 rounded-xl">
                <br />
              </Skeleton>
            </div>
            <div className="hidden lg:flex flex-col gap-y-3">
              <Skeleton className="w-[120px] max-w-full h-12.5 rounded-xl">
                <br />
              </Skeleton>
              <Skeleton className="w-[250px] max-w-full h-3">
                <br />
              </Skeleton>
            </div>
            <div className="lg:flex flex-col w-full gap-y-[14px] flex-col-reverse z-10 hidden">
              <div className="flex items-center gap-x-[10px] w-full">
                <div className="inline-flex items-center justify-center transition-colors gap-4 w-full">
                  <Skeleton className="w-full h-12.5 rounded-xl">
                    <br />
                  </Skeleton>
                  <Skeleton className="w-16 h-12.5 rounded-xl">
                    <br />
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full">
            <div className="border-b border-darkgray-100">
              <h3 className="flex">
                <div className="flex flex-1 items-center justify-between p-4">
                  <Skeleton className="w-[200px] max-w-full h-4">
                    <br />
                  </Skeleton>
                  <SvgSkeleton className="shrink-0 w-4 h-4" />
                </div>
              </h3>
            </div>
            <div className="border-b border-darkgray-100">
              <h3 className="flex">
                <div className="flex flex-1 items-center justify-between p-4">
                  <Skeleton className="w-[200px] max-w-full h-4">
                    <br />
                  </Skeleton>
                  <SvgSkeleton className="shrink-0 w-4 h-4" />
                </div>
              </h3>
            </div>
          </div>
          <div className="w-full flex justify-center h-10 items-center mt-6">
            <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2">
              <Skeleton className="w-[150px] max-w-full">
                <br />
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-y-[14px] flex-col-reverse z-10 lg:hidden mt-8">
          <div className="flex items-center gap-x-[10px] w-full">
            <div className="flex flex-col items-center justify-center transition-colors gap-4 w-full">
              <Skeleton className="w-full h-12.5 rounded-xl">
                <br />
              </Skeleton>
              <Skeleton className="w-[200px] h-3">
                <br />
              </Skeleton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductSkeleton;
