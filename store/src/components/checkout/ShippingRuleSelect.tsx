import { useCart } from "@/hooks/useCart";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  useCustomMutation,
  useInvalidate,
  useTranslate,
} from "@refinedev/core";
import { useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FlipBackward } from "@untitled-ui/icons-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ShippingRuleSelectProps = {
  onSelect: (shippingRule: any) => void;
  triggerClassName?: string;
};

const ShippingRuleSelect = ({
  onSelect,
  triggerClassName,
  ...props
}: ShippingRuleSelectProps) => {
  const t = useTranslate();
  const { serverCart, updateCart } = useCart();

  const selectedShippingRule = useMemo(
    () =>
      serverCart?.message.shipping_rules?.find(
        ({ name }: { name: string }) =>
          name === serverCart?.message.doc.shipping_rule
      ),
    [serverCart, props?.value]
  );

  const invalidate = useInvalidate();
  const { mutateAsync } = useCustomMutation({
    mutationOptions: {
      onSettled: () => {
        invalidate({
          dataProviderName: "storeProvider",
          resource: "cart",
          invalidates: ["list"],
        });
      },
    },
  });

  if (!serverCart) {
    return null;
  }

  return (
    <>
      {serverCart?.message.shipping_rules?.length > 0 ? (
        <Sheet>
          <SheetTrigger className="w-full bg-accent border border-darkgray-100 rounded-xl h-16 px-3">
            <div className="flex flex-col justify-center w-full cursor-default select-none items-start rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <h2 className="font-semibold">
                {selectedShippingRule?.name || t("Select Shipping Rule")}
              </h2>

              <p className="text-xs text-muted-foreground">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(selectedShippingRule?.shipping_amount || 0.0)}
              </p>
            </div>
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll">
            <SheetHeader className="bg-white -m-5 flex flex-row items-center justify-between z-10 px-4 py-3 border-b">
              <SheetClose asChild>
                <FlipBackward className="h-5 w-5 cursor-pointer hover:opacity-75 absolute" />
              </SheetClose>

              <SheetTitle className="!mx-auto !my-0 text-base">
                {t("Shipping Rule List")}
              </SheetTitle>
            </SheetHeader>
            <RadioGroup
              {...props}
              className="flex flex-col gap-y-3 pt-10"
              value={selectedShippingRule?.name}
            >
              {serverCart?.message.shipping_rules?.map((shippingRule: any) => (
                <SheetClose asChild key={shippingRule.name}>
                  <div
                    className={`cursor-pointer rounded-lg ${
                      selectedShippingRule?.name === shippingRule.name
                        ? "outline outline-1"
                        : ""
                    }`}
                    onClick={() => {
                      updateCart(mutateAsync, {
                        dataProviderName: "storeProvider",
                        url: "apply_shipping_rule",
                        method: "post",
                        values: {
                          shipping_rule: shippingRule.name,
                        },
                      });
                      onSelect(shippingRule);
                    }}
                  >
                    <RadioGroupItem
                      value={shippingRule.name}
                      id={shippingRule.name}
                      className="peer sr-only"
                    />
                    <Card className="w-full overflow-hidden bg-accent border border-darkgray-100 rounded-xl shadow-none px-3 py-2">
                      <div className="flex flex-col justify-center w-full select-none items-start rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <h2 className="font-semibold">{shippingRule.name}</h2>

                        <p className="text-xs text-muted-foreground">
                          {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                          }).format(shippingRule.shipping_amount)}
                        </p>
                      </div>
                    </Card>
                  </div>
                </SheetClose>
              ))}
            </RadioGroup>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-full overflow-hidden bg-accent border border-darkgray-100 rounded-xl shadow-none px-6 py-4 text-darkgray-200 text-sm font-semibold">
          {t("No shipping rules. Please contact the store.")}
        </div>
      )}
    </>
  );
};

export default ShippingRuleSelect;
