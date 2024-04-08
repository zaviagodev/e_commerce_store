import AddressCard from "@/components/AddressCard";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useCreate, useCustom, useOne, useTranslate } from "@refinedev/core";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CirclePlus,
  Landmark,
  Loader2,
  MessageCircleQuestion,
  QrCode,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import { useState } from "react";
import ShippingRuleSelect from "@/components/checkout/ShippingRuleSelect";
import CouponCodeInput from "@/components/checkout/CouponCodeInput";
import { createSearchParams, useNavigate } from "react-router-dom";
import useSummary from "@/hooks/useSummary";
import { useForm } from "@refinedev/react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema } from "./checkoutSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AddressSelect from "@/components/AddressSelect";

export const paymentMethodIconMap: { [key: string]: React.ReactNode } = {
  "2": <Landmark className="mr-2 h-4 w-4" />,
  "1": <QrCode className="mr-2 h-4 w-4" />,
};

const Checkout = () => {
  const [paymentMethod, setpaymentMethod] = useState<string | null>(null);
  const t = useTranslate();
  const navigate = useNavigate();
  const { cart, serverCart, cartTotal, cartCount, resetCart } = useCart();

  const { data: address, isLoading: addressLoading } = useOne({
    resource: "address",
    dataProviderName: "storeProvider",
    id: serverCart?.message.doc.shipping_address_name,
    queryOptions: {
      enabled: !!serverCart?.message.doc.shipping_address_name,
    },
  });

  const { data: paymentMethods } = useCustom({
    dataProviderName: "storeProvider",
    url: "payment_methods",
    method: "get",
  });

  const form = useForm({
    resolver: yupResolver(checkoutSchema),
    values: {
      paymentMethod: paymentMethod ?? "",
      shippingRule: serverCart?.message.doc.shipping_rule,
      address: serverCart?.message.doc.shipping_address_name,
    },
    mode: "onSubmit",
  });

  const { mutate, isLoading: placingOrder } = useCreate({
    mutationOptions: {
      onSettled: (data, err) => {
        if (err) {
          console.error(err);
          return;
        }
        resetCart();
        navigate({
          pathname: "/checkout/payment",
          search: createSearchParams({
            orderId: data?.message,
            paymentMethod: form.getValues("paymentMethod"),
          }).toString(),
        });
      },
    },
  });

  const checkoutSummary = useSummary(serverCart?.message.doc);

  const onSubmit = (data: any) => {
    mutate({
      dataProviderName: "storeProvider",
      resource: "orders",
      values: {},
    });
  };

  return (
    <div className="py-7 px-4 flex flex-col gap-x-0 gap-y-8 md:flex-row md:gap-x-8">
      <div className="w-full md:w-1/2">
        <div className="w-full lg:max-w-[450px] mx-auto">
          <div className="flex flex-col bg-secondary p-6 rounded-lg">
            <p className=" text-xs">{t("Grand total")}</p>
            <h2 className="text-2xl font-semibold text-primary">
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(serverCart?.message.doc.grand_total)}
            </h2>
          </div>
          <div className="mt-6">
            <h2 className="font-semibold text-darkgray">
              {t("Order summary")}
            </h2>
            <div className="mt-6 flex flex-col gap-y-4">
              <ul className="my-3 flex flex-col gap-y-3">
                {Object.entries(cart).map(([itemCode, quantity]) => {
                  if (!quantity) {
                    return null;
                  }
                  return (
                    <CheckoutItem
                      key={itemCode}
                      itemCode={itemCode}
                      qty={quantity}
                    />
                  );
                })}
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col">
              <div className="w-full flex justify-between">
                <p className="text-sm text-muted-foreground">{t("Subtotal")}</p>
                <strong className="text-darkgray">
                  {typeof cartTotal === "string"
                    ? t("Loading...")
                    : new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                      }).format(cartTotal)}
                </strong>
              </div>
              {checkoutSummary.totalShipping > 0 && (
                <div className="w-full flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("Shipping Cost")}
                  </p>
                  <strong className="text-muted-foreground">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(checkoutSummary.totalShipping)}
                  </strong>
                </div>
              )}
              <div className="w-full flex justify-between">
                <p className="text-sm text-muted-foreground">{t("Tax")}</p>
                <strong className="text-muted-foreground">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(checkoutSummary.totalTax)}
                </strong>
              </div>
              {checkoutSummary.totalDiscount > 0 && (
                <div className="w-full flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("Discount")}
                  </p>
                  <strong className="text-muted-foreground">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(checkoutSummary.totalDiscount?.toFixed(2) ?? 0)}
                  </strong>
                </div>
              )}
              {serverCart?.message.doc.coupon_code && (
                <div className="w-full flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("Coupon Code")}
                  </p>
                  <strong className="text-muted-foreground">
                    {serverCart?.message.doc.coupon_code}
                  </strong>
                </div>
              )}
              <CouponCodeInput />
            </div>
            <Separator className="my-4" />
            <div className="w-full flex justify-between">
              <p className="text-sm text-muted-foreground">
                {t("Grand total")}
              </p>
              <strong className="text-darkgray">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(serverCart?.message.doc.grand_total)}
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div className="w-full lg:max-w-[450px] mx-auto">
          <h2 className="font-semibold text-darkgray">
            {t("Shipping Information")}
          </h2>
          <Form {...form}>
            <form
              className="mt-6 flex flex-col gap-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("Address")}</FormLabel>
                        <FormControl>
                          <AddressSelect
                            {...field}
                            onSelect={(value) =>
                              form.setValue("address", value.name)
                            }
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {addressLoading &&
                !!serverCart?.message.doc.shipping_address_name && (
                  <div>Loading...</div>
                )}
              {address && <AddressCard {...address?.message} />}
              {!address && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-6 justify-start text-lg text-gray-500"
                  onClick={() => navigate("/account/addresses/new")}
                >
                  <CirclePlus className="mr-2" /> {t("Add Address")}
                </Button>
              )}
              <ShippingRuleSelect
                initialShippingRule={serverCart?.message.shipping_rules?.find(
                  ({ name }: { name: string }) =>
                    name === serverCart?.message.doc.shipping_rule
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("Payment Method")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          className="grid grid-cols-2 gap-4"
                          onValueChange={(value) =>
                            form.setValue("paymentMethod", value)
                          }
                        >
                          {(paymentMethods?.message ?? [])?.map(
                            (method: any) => (
                              <div>
                                <RadioGroupItem
                                  value={method.name}
                                  id={method.key}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={method.key}
                                  className="flex items-center justify-start rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  {paymentMethodIconMap[method.key ?? "2"]}
                                  {method.name}
                                </Label>
                              </div>
                            )
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={placingOrder || cartCount === 0}
                  type="submit"
                >
                  {placingOrder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("Continue to Payment")}
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("By continuing, you agree to our")}{" "}
                  <b>{t("Privacy Policy")}</b> {t("and")}{" "}
                  <b>{t("Terms of Service")}</b>.
                </p>
              </div>
              <div className="w-full flex justify-center h-10 items-center">
                <Button variant="link" className="font-bold">
                  <MessageCircleQuestion size={20} className="mr-1" />{" "}
                  {t("Ask for help")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
