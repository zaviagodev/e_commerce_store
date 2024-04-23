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
  Undo2,
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
import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import TopSheet from "@/components/customComponents/TopSheet";
import Logo from "@/components/customComponents/Logo";

export const paymentMethodIconMap: { [key: string]: React.ReactNode } = {
  "2": <Landmark className="mr-2 h-4 w-4" />,
  "1": <QrCode className="mr-2 h-4 w-4" />,
};

const Checkout = () => {
  const [paymentMethod, setpaymentMethod] = useState<string | null>(null);
  const { config } = useConfig()
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

  {/* Create the CartList component to use it on the sheet on the mobile version */}
  const CartList = () => {
    return (
      <>
        <div className="flex flex-col rounded-lg gap-y-6">
          <div className="flex items-center justify-between text-sm text-darkgray-200">
            <p>{t("Grand total")}</p>
            <p>{cartCount} {t(cartCount === 1 ? "Item" : "Items")}</p>
          </div>

          <h2 className="text-4xl font-semibold text-primary">
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(serverCart?.message.doc.grand_total)}
          </h2>
        </div>
        {/* <h2 className="font-semibold text-darkgray">
          {t("Order summary")}
        </h2> */}
        <div className="mt-12 flex flex-col gap-y-4">
          <ul className="my-3 flex flex-col gap-y-8">
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

        <section className="md:ml-16">
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-4">
            <div className="w-full flex justify-between">
              <p>{t("Subtotal")}</p>
              <strong>
                {typeof cartTotal === "string"
                  ? t("Loading...")
                  : new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(cartTotal)}
              </strong>
            </div>
            {checkoutSummary.totalShipping > 0 && (
              <div className="w-full flex justify-between text-darkgray-200">
                <p>{t("Shipping Cost")}</p>
                <strong>
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(checkoutSummary.totalShipping)}
                </strong>
              </div>
            )}
            <div className="w-full flex justify-between text-darkgray-200">
              <p>{t("Tax")}</p>
              <strong>
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(checkoutSummary.totalTax)}
              </strong>
            </div>
            {checkoutSummary.totalDiscount > 0 && (
              <div className="w-full flex justify-between text-darkgray-200">
                <p>{t("Discount")}</p>
                <strong>
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(checkoutSummary.totalDiscount?.toFixed(2) ?? 0)}
                </strong>
              </div>
            )}
            {serverCart?.message.doc.coupon_code && (
              <div className="w-full flex justify-between text-darkgray-200">
                <p className="text-muted-foreground">
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
          <div className="w-full flex justify-between font-semibold">
            <p>{t("Grand total")}</p>
            <strong>
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(serverCart?.message.doc.grand_total)}
            </strong>
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="flex flex-col md:gap-y-8 md:flex-row">
      <div className="w-full md:w-1/2 md:p-20 md:pt-5 md:h-screen">
        <div className="flex items-center gap-x-4 border-b md:border-0 p-4 md:p-0 justify-between">
          <div className="flex items-center gap-x-2.5">
            <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75" onClick={() => navigate("/")}/>
            <h2 className="md:hidden font-semibold">{t("Order details")}</h2>

            <div className="hidden md:block">
              <Logo />
            </div>
          </div>

          {/* MOBILE VERSION */}
          <TopSheet trigger={
            <h2 className="md:hidden text-darkgray-200">ข้อมูลตะกร้า</h2>
          }>
            <CartList />
          </TopSheet>
        </div>

        {/* DESKTOP VERSION */}
        <div className="hidden md:block w-full md:mt-[60px] px-4 md:p-0">
          <CartList />
        </div>
      </div>
      <div className="w-full md:w-1/2 md:shadow-checkout p-4 md:px-[60px] md:pt-[120px]">
        <div className="w-full">
          <h2 className="font-semibold text-darkgray-500">
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
