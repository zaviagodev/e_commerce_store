import {
  IResourceComponentsProps,
  useCustom,
  useShow,
  useTranslate,
  useOne,
} from "@refinedev/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ProductCounter from "@/components/ProductCounter";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import ProductImages from "@/components/ProductImages";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import { useConfig } from "@/hooks/useConfig";
import RelatedProducts from "@/components/customComponents/RelatedProducts";
import { MessageQuestionCircle, ShoppingBag01 } from "@untitled-ui/icons-react";
import { Heart } from "lucide-react"
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export const ProductShow: React.FC<IResourceComponentsProps> = () => {
  const [selectedVariant, setSelectedVariant] = useState();
  const [variants, setVariants] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const t = useTranslate();
  const { config } = useConfig();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { queryResult, showId } = useShow({
    queryOptions: {
      onSuccess: (data) => {
        console.log("data", data);

        if (data?.message.product_info?.has_variants) {
          const attributes = {};
          data.message.product_info.variant_attributes.forEach(
            ({ attribute, values }) => {
              attributes[attribute] = values[0];
            }
          );
          console.log("attributes", attributes);

          setSelectedAttributes(attributes);
        }
      },
    },
  });
  const { data, isFetching, isLoading, isRefetching } = queryResult;

  useOne({
    resource: "products",
    id: selectedVariant,
    queryOptions: {
      enabled: !!selectedVariant,
      onSuccess: (data) =>
        setVariants((prev) => ({
          ...prev,
          [data?.message.product_info.item_code]: data,
        })),
    },
  });

  useCustom({
    dataProviderName: "storeProvider",
    url: "find_variant",
    method: "post",
    queryOptions: {
      enabled: Object.keys(selectedAttributes).length > 0,
      staleTime: 0,
      onSuccess: (data) => {
        if (data?.message.exact_match.length) {
          setSelectedVariant(data.message.exact_match[0]);
        }
      },
    },
    config: {
      payload: {
        item_code: showId,
        selected_attributes: selectedAttributes,
      },
    },
  });

  if (isFetching || isLoading || isRefetching) {
    return (
      <div className="max-w-[1200px] space-y-6 lg:space-y-[140px] mx-auto">
        <ProductSkeleton />
        <RelatedProducts />
      </div>
    );
  }

  const product = data?.message.product_info;
  const variant = variants[selectedVariant]?.message.product_info;
  const itemCode = selectedVariant ?? (showId as string);
  const inWishlist = wishlist.includes(itemCode);

  return (
   <section className="space-y-10 lg:space-y-[140px] pb-20 max-w-[1200px] mx-auto">
    <div className="flex flex-col lg:flex-row gap-[18px] lg:gap-[33px]">
      <ProductImages
        images={[
          {
            imageThumbSrc: `${import.meta.env.VITE_BACKEND_URL ?? ""}${
              variant?.thumbnail ?? product.thumbnail
            }`,
            imageSrc: `${import.meta.env.VITE_BACKEND_URL ?? ""}${
              variant?.thumbnail ?? product.thumbnail
            }`,
            alt: `${product.web_item_name} image`,
          },
        ]}
      />
      <section className="w-full lg:px-10 lg:py-[30px] lg:max-w-[536px] h-full sticky top-0 z-10">
        <div className="flex flex-col gap-y-3 lg:gap-y-[10px]">
          <h2 className="text-secgray text-sm">{product.item_group}</h2>
          <h1 className="font-semibold text-texttag text-[22px]">
            {product.web_item_name}
          </h1>
          <span className="flex flex-row items-center justify-start gap-2 mb-3">
            <span className={`block typography-headline-3 font-bold text-base ${product.price?.formatted_mrp ? "text-red-500" : ""}`}>
              {product.price?.formatted_price}
            </span>
            {product.price?.formatted_mrp && (
              <span className="block typography-headline-3 text-base text-darkgray-400 line-through">
                {product.price?.formatted_mrp}
              </span>
            )}
          </span>
          </div>
          {product.short_description && (
          <div className="text-sm leading-6 pb-12 lg:pb-[60px] font-normal">
            <p>{product.short_description}</p>
          </div>
          )}
          <div className="pb-6 border-b">
            {product.variant_attributes && (
              <div className="flex flex-col gap-y-6 mt-4 mb-16">
                {product.variant_attributes?.map((variant_attribute) => (
                  <div key={variant_attribute.attribute}>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        {variant_attribute.attribute}: <span className="font-normal">{selectedAttributes ? selectedAttributes[variant_attribute.attribute] : `Select ${variant_attribute.attribute}`}</span>
                      </span>
                      <div className="flex items-center gap-4">
                        {variant_attribute.values.map((value) => (
                          <Toggle
                            variant="outline"
                            aria-label="Toggle italic"
                            key={value}
                            pressed={
                              selectedAttributes[variant_attribute.attribute] ===
                              value
                            }
                            className={`${selectedAttributes[variant_attribute.attribute] === value ? "border-black !bg-transparent" : ""} rounded-lg`}
                            onClick={() =>
                              setSelectedAttributes({
                                ...selectedAttributes,
                                [variant_attribute.attribute]: value,
                              })
                            }
                          >
                            {value}
                          </Toggle>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="items-start flex flex-col gap-y-[14px]">
              <ProductCounter itemCode={showId! as string} size="sm" />
              <div className="fixed bottom-0 left-0 bg-white lg:bg-inherit p-4 lg:p-0 lg:static flex lg:flex-col w-full gap-y-[14px] flex-col-reverse z-10">
                <div className="flex items-center gap-x-[10px] w-full">
                  <Button className="w-full rounded-xl h-12.5 text-base font-semibold" onClick={() => addToCart(itemCode)}>
                    <ShoppingBag01 className="mr-2.5 h-5 w-5" />
                    {t("Add to Cart")}
                  </Button>
                  {config?.enable_wishlist == 1 && (
                    <Button
                      variant="outline"
                      className={`border-primary border-2 h-12.5 rounded-xl !bg-transparent`}
                      onClick={() =>
                        inWishlist
                          ? removeFromWishlist(itemCode)
                          : addToWishlist(itemCode)
                      }
                    >
                      <Heart className={inWishlist ? "fill-primary" : ""}/>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

        <div>
          {product.web_long_description && <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-semibold">{t("Details")}</AccordionTrigger>
              <AccordionContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.web_long_description,
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>}
          <div className="w-full flex justify-center h-10 items-center mt-6">
            <Button variant="link" className="font-bold">
              <MessageQuestionCircle className="mr-2" />{" "}
              {t("Ask for help")}
            </Button>
          </div>
        </div>
        </section>
      </div>

      <RelatedProducts />
    </section>
  );
};
