import AddressCard from "@/components/AddressCard";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useCreate, useCustom, useOne, useTranslate } from "@refinedev/core";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CirclePlus,
  Landmark,
  Loader2,
  QrCode,
  ArrowLeftRight,
  Undo2,
  ChevronDown,
  ArrowUp,
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
import { FlipBackward, MarkerPin04, MessageQuestionCircle } from "@untitled-ui/icons-react";
import { formatCurrency } from "@/lib/utils";
import CheckoutDetailSkeleton from "@/components/skeletons/CheckoutDetailSkeleton";
import ProductImage from "@/components/ProductImage";

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

  const isAddressLoaded = serverCart === undefined && (addressLoading)

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

  const OrderDetailSheet = ({ trigger } : { trigger: string | React.ReactNode } ) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <TopSheet trigger={trigger} contentClassName="p-0 rounded-b-2xl" onOpenChange={setIsOpen} open={isOpen}>
        <div className="p-4 border-b">
          <AddressHeader />
        </div>
        <div className="p-4">
          <CartList />
        </div>

        <div className="flex justify-center w-full">
          <button className="flex items-center p-4 gap-x-2 text-darkgray-200 text-sm" onClick={() => setIsOpen(false)}>
            {t("Hide cart details")}
            <ArrowUp className="h-4 w-4"/>
          </button>
        </div>
      </TopSheet>
    )
  }

  const TotalCart = () => {
    return (
      <div className="flex flex-col rounded-lg gap-y-4">
        {serverCart?.message.doc.grand_total ? (
          <>
            <div className="flex items-center justify-center gap-x-1 lg:justify-between text-sm text-darkgray-200">
              <p>{t("Grand total")}</p>
              <p>{cartCount} {t(cartCount === 1 ? "Item" : "Items")}</p>

              <div className="lg:hidden flex items-center">
                <OrderDetailSheet trigger={<ChevronDown className="h-4 w-4"/>}/>
              </div>
            </div>

            <h2 className="text-4xl font-semibold text-primary text-center lg:text-left">
              {formatCurrency(serverCart?.message.doc.grand_total)}
            </h2>
          </>
        ) : (
          <>
            {/* DESKTOP VERSION */}
            <div className="lg:flex flex-col gap-y-4 hidden">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]"/>
                <Skeleton className="h-4 w-20"/>
              </div>
              <Skeleton className="h-10 w-[160px] rounded-xl"/>
            </div>

            {/* MOBILE VERSION */}
            <div className="lg:hidden flex flex-col items-center gap-y-4">
              <Skeleton className="h-4 w-[140px]"/>
              <Skeleton className="h-10 w-[160px] rounded-xl"/>
            </div>
          </>
        )}
      </div>
    )
  }

  const CheckoutDetail = () => {
    return (
      <div className="lg:ml-[69px] lg:mr-5">
        <Separator className="my-4 bg-[#F4F4F4]" />
        {serverCart?.message.doc.grand_total ? (
          <>
            <div className="flex flex-col gap-y-4">
              <div className="w-full flex justify-between text-sm">
                <p>{t("Subtotal")}</p>
                <strong>
                  {typeof cartTotal === "string"
                    ? cartTotal // ? t("Loading...")
                    : formatCurrency(cartTotal)
                  }
                </strong>
              </div>
              {checkoutSummary.totalShipping > 0 && (
                <div className="w-full flex justify-between text-darkgray-200 text-sm">
                  <p>{t("Shipping Cost")}</p>
                  <span>
                    {formatCurrency(checkoutSummary.totalShipping)}
                  </span>
                </div>
              )}
              <div className="w-full flex justify-between text-darkgray-200 text-sm">
                <p>{t("Tax")}</p>
                <span>
                  {formatCurrency(checkoutSummary.totalTax)}
                </span>
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
            <Separator className="my-4 bg-[#F4F4F4]" />
            <div className="w-full flex justify-between font-semibold text-sm">
              <p>{t("Grand total")}</p>
              <strong>
                {formatCurrency(serverCart?.message.doc.grand_total)}
              </strong>
            </div>
          </>
        ) : (
          <CheckoutDetailSkeleton />
        )}
      </div>
    )
  }

  {/* Create the CartList component to use it on the sheet on the mobile version */}
  const CartList = () => {
    return (
      <section>
        <div className="flex flex-col gap-y-4 lg:mr-5">
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
        <CheckoutDetail />
      </section>
    )
  }

  const AddressHeader = () => {
    return (
      <div className="flex items-center gap-x-2.5">
        <FlipBackward className="h-5 w-5 cursor-pointer hover:opacity-75" onClick={() => navigate("/")}/>
        <h2 className="lg:hidden font-semibold">{t("Order details")}</h2>
        <div className="hidden lg:block">
          <Logo />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center lg:gap-y-8 lg:flex-row mx-auto">
      <div className="w-full lg:max-w-[494px] lg:pl-0 lg:p-20 lg:pt-5 box-content">
        <div className="flex items-center gap-x-4 border-b lg:border-0 p-4 lg:p-0 justify-between">
          <AddressHeader />

          {/* CartList MOBILE VERSION */}
          <OrderDetailSheet trigger={<h2 className="lg:hidden text-darkgray-200 text-sm">{t("Cart details")}</h2>} />
        </div>

        {/* CartList DESKTOP VERSION */}
        <div className="hidden lg:flex flex-col gap-y-12 w-full lg:mt-[60px] px-4 lg:p-0 lg:pl-5 ml-2">
          <TotalCart />
          <CartList />
        </div>
      </div>
      <div className="w-full lg:max-w-[536px] lg:shadow-checkout p-4 lg:px-[60px] lg:pt-[120px] lg:h-screen">

        {/* This is the total cart on the mobile version */}
        <div className="mb-10 lg:hidden">
          <ProductImage
            itemCode={Object.keys(cart)[0]}
            className="w-[120px] h-[120px] rounded-md bg-gray-100 mx-auto mb-4"
          />
          <TotalCart />
        </div>
        <div className="w-full">
          {isAddressLoaded ? (
            <Skeleton className="h-4 w-40 hidden lg:block"/>
          ) : (
            <h2 className="font-semibold text-darkgray-500 text-lg hidden lg:block">
              {t("Shipping Information")}
            </h2>
          )}
          <Form {...form}>
            <form
              className="lg:mt-6 flex flex-col gap-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* I have changed the condition due to the skeleton creation 
                  This is the original one : addressLoading && !!serverCart?.message.doc.shipping_address_name
              */}
              {isAddressLoaded ? (
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-[120px]"/>
                  <Skeleton className="h-40 w-full rounded-xl"/>
                </div>
              ) : (
                <section className="space-y-1">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-darkgray-200 font-semibold text-base">{t("Address")}</FormLabel>
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
                  {address ? <AddressCard {...address?.message} /> : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start text-gray-500 border-darkgray-100 bg-accent rounded-xl px-4 font-semibold h-12.5"
                      onClick={() => navigate("/account/addresses/new")}
                    >
                      <MarkerPin04 className="mr-2" /> {t("Add Address")}
                    </Button>
                  )}
                </section>
              )}
              
              {isAddressLoaded ? (
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-[120px]"/>
                  <Skeleton className="h-16 w-full rounded-xl"/>
                </div>
              ) : (
                <ShippingRuleSelect
                  initialShippingRule={serverCart?.message.shipping_rules?.find(
                    ({ name }: { name: string }) =>
                      name === serverCart?.message.doc.shipping_rule
                  )}
                />
              )}
              {isAddressLoaded ? (
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-[120px]"/>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12.5 w-full rounded-xl" />
                    <Skeleton className="h-12.5 w-full rounded-xl" />
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="text-darkgray-200 font-semibold text-base">{t("Payment Method")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            className="grid grid-cols-2 gap-4 !m-0"
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
                                    className="flex items-center justify-center border border-darkgray-100 bg-popover p-4 bg-accent text-darkgray-500 font-semibold peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary rounded-xl"
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
              )}

              <div className="lg:hidden">
                {isAddressLoaded ? <CheckoutDetailSkeleton /> : <CheckoutDetail />}
              </div>

              {isAddressLoaded ? (
                <div className="flex flex-col gap-y-16">
                  <div className="flex flex-col gap-y-4">
                    <Skeleton className="h-12.5 w-full rounded-xl"/>
                    <Skeleton className="h-3 w-3/4"/>
                    <Skeleton className="h-3 w-1/2"/>
                  </div>

                  <Skeleton className="mx-auto h-3 w-1/2"/>
                </div>
              ) : (
                <>
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
                      <b className="text-primary">{t("Privacy Policy")}</b> {t("and")}{" "}
                      <b className="text-primary">{t("Terms of Service")}</b>.
                    </p>
                  </div>
                  <div className="w-full flex justify-center h-10 items-center">
                    <Button variant="link" className="font-bold text-base flex items-center gap-x-2">
                      <MessageQuestionCircle className="h-5 w-5" />{" "}
                      {t("Ask for help")}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;