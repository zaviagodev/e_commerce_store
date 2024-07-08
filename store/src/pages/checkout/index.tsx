import AddressCard from "@/components/AddressCard";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import {
  useCreate,
  useCustom,
  useCustomMutation,
  useInvalidate,
  useOne,
  useTranslate,
} from "@refinedev/core";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Landmark,
  Loader2,
  QrCode,
  ChevronDown,
  ArrowUp,
  PlusCircle,
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
import TopSheet from "@/components/customComponents/TopSheet";
import Logo from "@/components/customComponents/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FlipBackward,
  MarkerPin04,
  MessageQuestionCircle,
} from "@untitled-ui/icons-react";
import { formatCurrency } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import CartListSkeleton from "@/components/skeletons/CartListSkeleton";
import AddressDialog from "@/components/address/AddressDialog";
import useConfig from "@/hooks/useConfig";
import CheckoutFormSkeleton from "@/components/skeletons/CheckoutFormSkeleton";

export const paymentMethodIconMap: { [key: string]: React.ReactNode } = {
  "2": <Landmark className="mr-2 h-4 w-4" />,
  "1": <QrCode className="mr-2 h-4 w-4" />,
};

const Checkout = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { config } = useConfig();
  const { cartCount, cart, serverCart, resetCart, isServerCartLoading } =
    useCart();

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

  const invalidate = useInvalidate();

  const { mutate: mutateCartAddress } = useCustomMutation({
    mutationOptions: {
      onSettled(data, error) {
        if (!error) {
          invalidate({
            dataProviderName: "storeProvider",
            resource: "cart",
            invalidates: ["list"],
          });
        }
      },
    },
  });

  const form = useForm({
    resolver: yupResolver(checkoutSchema),
    values: {
      paymentMethod: "",
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

  const onSubmit = (data: any) => {
    mutate({
      dataProviderName: "storeProvider",
      resource: "orders",
      values: {},
    });
  };

  return (
    <div className="flex flex-col justify-center lg:gap-y-8 lg:flex-row mx-auto">
      <div className="w-full lg:max-w-[494px] lg:pl-0 lg:p-20 lg:pt-5 box-content">
        <div className="flex items-center gap-x-4 border-b lg:border-0 p-4 lg:p-0 justify-between fixed lg:static w-full lg:w-fit bg-white lg:bg-transparent">
          <Header />

          {/* CartList MOBILE VERSION */}
          <OrderDetailSheet
            trigger={
              <h2 className="lg:hidden text-darkgray-200 text-sm">
                {t("Cart details")}
              </h2>
            }
          />
        </div>

        {/* CartList DESKTOP VERSION */}
        <div className="hidden lg:flex flex-col gap-y-12 w-full lg:mt-[60px] px-4 lg:p-0 lg:pl-5 ml-2">
          <TotalCart />
          <CartList />
        </div>
      </div>
      <div className="w-full lg:max-w-[536px] lg:shadow-checkout p-4 lg:px-[60px] lg:pt-[120px] lg:h-screen mt-[57px] lg:mt-0">
        {/* This is the total cart on the mobile version */}
        <div className="mb-10 flex flex-col lg:hidden">
          <OrderDetailSheet
            trigger={
              <>
                <ProductImage
                  itemCode={
                    Object.keys(cart).find(
                      (itemCode) => Number(cart[itemCode]) > 0
                    ) ?? ""
                  }
                  className="w-[120px] h-[120px] rounded-md bg-gray-100 mx-auto mb-4"
                />
                <TotalCart />
              </>
            }
            triggerClassName="w-fit mx-auto"
          />
        </div>

        {isServerCartLoading && <CheckoutFormSkeleton />}
        <div className={`w-full ${isServerCartLoading ? "hidden" : ""}`}>
          <h2 className="font-semibold text-darkgray-500 text-lg hidden lg:block">
            {t("Shipping Information")}
          </h2>
          <Form {...form}>
            <form
              className="lg:mt-6 flex flex-col gap-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <section className="space-y-1">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-darkgray-200 font-semibold text-base">
                            {t("Address")}
                          </FormLabel>
                          <FormControl>
                            <AddressSelect
                              {...field}
                              onSelect={(value) =>
                                form.setValue("address", value.name)
                              }
                            />
                          </FormControl>
                        </div>
                        {!address && (
                          <AddressDialog
                            onSettled={(data, err) => {
                              if (data?.message.name) {
                                mutateCartAddress({
                                  dataProviderName: "storeProvider",
                                  url: "update_cart_address",
                                  method: "put",
                                  values: {
                                    address_name: data.message.name,
                                    address_type: "shipping",
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full px-4 border border-darkgray-100 bg-accent justify-start rounded-xl text-darkgray-500 flex items-center gap-x-2 h-[60px] font-semibold text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                              <PlusCircle /> {t("Add New Address")}
                            </Button>
                          </AddressDialog>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {addressLoading &&
                  !!serverCart?.message.doc.shipping_address_name && (
                    <Skeleton className="h-40 rounded-xl w-full" />
                  )}
                {address && <AddressCard {...address?.message} />}
              </section>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-darkgray-200 font-semibold text-base">
                        {t("Shipping Rule")}
                      </FormLabel>
                      <FormControl>
                        <ShippingRuleSelect
                          {...field}
                          onSelect={(shippingRule) =>
                            form.setValue("shippingRule", shippingRule.name)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-darkgray-200 font-semibold text-base">
                        {t("Payment Method")}
                      </FormLabel>
                      {paymentMethods?.message?.length > 0 ? (
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
                                <div key={method.key}>
                                  <RadioGroupItem
                                    value={method.name}
                                    id={method.key}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={method.key}
                                    className="flex items-center justify-center border border-darkgray-100 p-4 bg-accent text-darkgray-500 font-semibold peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary rounded-xl"
                                  >
                                    {paymentMethodIconMap[method.key ?? "2"]}
                                    {method.name}
                                  </Label>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                      ) : (
                        <div className="w-full overflow-hidden bg-accent border border-darkgray-100 rounded-xl shadow-none px-6 py-4 text-darkgray-200 text-sm font-semibold">
                          {t("No payment methods. Please contact the store.")}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="mt-4">
                <Button
                  size="lg"
                  className="w-full rounded-xl text-base font-semibold h-12.5"
                  disabled={placingOrder || cartCount === 0}
                  type="submit"
                >
                  {placingOrder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("Continue to Payment")}
                </Button>
                <p className="mt-2 text-sm text-darkgray-200">
                  {t("By continuing, you agree to our")}{" "}
                  <b className="text-primary">{t("Privacy Policy")}</b>{" "}
                  {t("and")}{" "}
                  <b className="text-primary">{t("Terms of Service")}</b>.
                </p>
              </div>
              {config?.help_url && (
                <div className="w-full flex justify-center h-10 items-center">
                  <Button
                    type="button"
                    variant="link"
                    className="font-bold text-base flex items-center gap-x-2"
                    onClick={() => window.open(config?.help_url, "_blank")}
                  >
                    <MessageQuestionCircle className="h-5 w-5" />{" "}
                    {t("Ask for help")}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

const Header = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-x-2.5">
      <FlipBackward
        className="h-5 w-5 cursor-pointer hover:opacity-75"
        onClick={() => navigate("/")}
      />
      <h2 className="lg:hidden font-semibold">{t("Order details")}</h2>
      <div className="hidden lg:block">
        <Logo />
      </div>
    </div>
  );
};

const CartList = () => {
  const t = useTranslate();
  const { cart, serverCart, cartTotal, isServerCartLoading } = useCart();
  const checkoutSummary = useSummary(serverCart?.message.doc);

  if (isServerCartLoading) {
    return <CartListSkeleton />;
  }

  return (
    <section>
      <div className="flex flex-col gap-y-4 lg:mr-5">
        <ul className="my-3 flex flex-col gap-y-8">
          {Object.entries(cart).map(([itemCode, quantity]) => {
            if (!quantity) {
              return null;
            }
            return (
              <CheckoutItem key={itemCode} itemCode={itemCode} qty={quantity} />
            );
          })}
        </ul>
      </div>

      <div className="lg:ml-[69px] lg:mr-5">
        <Separator className="my-4 bg-[#E3E3E3]" />
        <div className="flex flex-col gap-y-4">
          <div className="w-full flex justify-between text-sm">
            <p>{t("Subtotal")}</p>
            <strong>
              {typeof cartTotal === "string"
                ? t("Loading...")
                : formatCurrency(cartTotal)}
            </strong>
          </div>
          {checkoutSummary.totalShipping > 0 && (
            <div className="w-full flex justify-between text-darkgray-200 text-sm">
              <p>{t("Shipping Cost")}</p>
              <span>{formatCurrency(checkoutSummary.totalShipping)}</span>
            </div>
          )}
          <div className="w-full flex justify-between text-darkgray-200 text-sm">
            <p>{t("Tax")}</p>
            <span>{formatCurrency(checkoutSummary.totalTax)}</span>
          </div>
          {checkoutSummary.totalDiscount > 0 && (
            <div className="w-full flex justify-between text-darkgray-200 text-sm">
              <p>{t("Discount")}</p>
              <strong>
                {formatCurrency(checkoutSummary.totalDiscount?.toFixed(2) ?? 0)}
              </strong>
            </div>
          )}
          {serverCart?.message.doc.coupon_code && (
            <div className="w-full flex justify-between text-darkgray-200 text-sm">
              <p className="text-muted-foreground">{t("Coupon Code")}</p>
              <strong className="text-muted-foreground">
                {serverCart?.message.doc.coupon_code}
              </strong>
            </div>
          )}
          {/* TODO: enable later <CouponCodeInput /> */}
        </div>
        <Separator className="my-4 bg-[#E3E3E3]" />
        <div className="w-full flex justify-between font-semibold text-sm">
          <p>{t("Grand total")}</p>
          <strong>{formatCurrency(serverCart?.message.doc.grand_total)}</strong>
        </div>
      </div>
    </section>
  );
};

const OrderDetailSheet = ({
  trigger,
  triggerClassName,
}: {
  trigger: string | React.ReactNode;
  triggerClassName?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslate();
  return (
    <TopSheet
      trigger={trigger}
      contentClassName="p-0 rounded-b-2xl"
      onOpenChange={setIsOpen}
      open={isOpen}
      triggerClassName={triggerClassName}
    >
      <div className="p-4 border-b">
        <Header />
      </div>
      <div className="p-4">
        <CartList />
      </div>

      <div className="flex justify-center w-full">
        <button
          className="flex items-center p-4 gap-x-2 text-darkgray-200 text-sm"
          onClick={() => setIsOpen(false)}
        >
          {t("Hide cart details")}
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </TopSheet>
  );
};

const TotalCart = () => {
  const t = useTranslate();
  const { cartCount, serverCart, isServerCartLoading } = useCart();

  if (isServerCartLoading) {
    return (
      <div className="flex flex-col items-center lg:items-start rounded-lg gap-y-4">
        <div className="flex items-center justify-center gap-x-1 lg:justify-between text-sm text-darkgray-200">
          <Skeleton className="w-12 h-5" />
          <Skeleton className="w-10 h-5" />

          <div className="lg:hidden flex items-center">
            <OrderDetailSheet trigger={<ChevronDown className="h-4 w-4" />} />
          </div>
        </div>
        <Skeleton className="w-28 h-12 " />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg gap-y-4">
      <div className="flex items-center justify-center gap-x-1 text-sm text-darkgray-200 w-fit mx-auto lg:hidden">
        <p>{t("Grand total")}</p>
        <p>
          {cartCount} {cartCount === 1 ? t("Item2") : t("Items2")}
        </p>

        <div className="lg:hidden flex items-center">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Desktop order detail */}
      <div className="hidden lg:flex items-center justify-between text-sm text-darkgray-200">
        <p>{t("Grand total")}</p>
        <p>
          {cartCount} {cartCount === 1 ? t("Item2") : t("Items2")}
        </p>
      </div>

      {!isServerCartLoading ? (
        <h2 className="text-4xl font-semibold text-primary text-center lg:text-left">
          {formatCurrency(serverCart?.message.doc.grand_total)}
        </h2>
      ) : (
        <Skeleton className="h-10" />
      )}
    </div>
  );
};
