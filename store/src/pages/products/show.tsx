import {
  IResourceComponentsProps,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircleQuestion, ShoppingBag } from "lucide-react";
import ProductCounter from "@/components/ProductCounter";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import ProductImages from "@/components/ProductImages";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";

export const ProductShow: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { queryResult, showId } = useShow({});
  const { data, isFetching, isLoading, isRefetching } = queryResult;

  if (isFetching || isLoading || isRefetching) {
    return <ProductSkeleton />;
  }

  const product = data?.message.product_info;
  const itemCode = showId as string;
  const inWishlist = wishlist.includes(itemCode);

  return (
    <div className="flex flex-col lg:flex-row gap-[18px] lg:gap-[33px]">
      <ProductImages
        images={[
          {
            imageThumbSrc: `${import.meta.env.VITE_BACKEND_URL}${
              product.thumbnail
            }`,
            imageSrc: `${import.meta.env.VITE_BACKEND_URL}${product.thumbnail}`,
            alt: `${product.web_item_name} image`,
          },
        ]}
      />
      <section className="w-full px-4 lg:px-10 lg:py-[30px] lg:max-w-[536px] h-full sticky top-0 z-10">
        <div className="flex flex-col gap-y-3 lg:gap-y-[10px]">
          <h2 className="text-secgray text-sm">{product.item_group}</h2>
          <h1 className="font-semibold text-texttag text-[22px]">
            {product.web_item_name}
          </h1>
          <span className="flex flex-row items-center justify-start gap-2 mb-3">
            <span className="block typography-headline-3 font-bold text-base text-red-500">
              {product.price?.formatted_price}
            </span>
            <span className="block text-maingray typography-headline-3 line-through font-normal text-sm">
              ฿ 15,000.00
            </span>
          </span>
        </div>
        <div className="text-sm leading-6 pb-[60px] font-normal">
          <p>{product.short_description}</p>
        </div>
        <div className="pb-6 border-gray-200 border-b">
          <div className="items-start flex flex-col gap-y-[14px]">
            <ProductCounter itemCode={showId! as string} size="lg" />
            <div className="fixed bottom-0 left-0 bg-white lg:bg-inherit p-4 lg:p-0 lg:static flex lg:flex-col w-full gap-y-[14px] flex-col-reverse z-10">
              <div className="flex items-center gap-x-[10px] w-full">
                <Button className="w-full" onClick={() => addToCart(itemCode)}>
                  <ShoppingBag size={18} className="mr-1" />
                  {t("Add to Cart")}
                </Button>
                <Button
                  variant="outline"
                  className={`${inWishlist ? "text-red-500" : "text-black"}`}
                  onClick={() =>
                    inWishlist
                      ? removeFromWishlist(itemCode)
                      : addToWishlist(itemCode)
                  }
                >
                  <Heart />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("Details")}</AccordionTrigger>
              <AccordionContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.web_long_description,
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="w-full flex justify-center h-10 items-center mt-6">
            <Button variant="link" className="font-bold">
              <MessageCircleQuestion size={20} className="mr-1" />{" "}
              {t("Ask for help")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
