import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustom, useOne, useTranslate } from "@refinedev/core";
import { MessageCircleQuestion, Undo2 } from "lucide-react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressCard from "@/components/AddressCard";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import { Separator } from "@/components/ui/separator";
import useSummary from "@/hooks/useSummary";
import { useState } from "react";

const OrderDetail = () => {
  const [paymentMethod, setPaymentMethod] = useState();
  const t = useTranslate();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading, isFetching, isRefetching } = useOne({
    id: params.id,
  });

  const order = data?.message;

  const {
    data: address,
    isLoading: addressLoading,
    isFetching: addressFetching,
    isRefetching: addressRefetching,
  } = useOne({
    resource: "address",
    dataProviderName: "storeProvider",
    id: order?.customer_address,
    queryOptions: {
      enabled: !!order?.customer_address,
    },
  });

  const { data: paymentMethods } = useCustom({
    dataProviderName: "storeProvider",
    url: "payment_methods",
    method: "get",
    queryOptions: {
      enabled:
        order?.status && !["Completed", "Shipped"].includes(order.status),
      onSuccess: (data: any) => setPaymentMethod(data.message[0].name),
    },
  });

  const checkoutSummary = useSummary(order);

  if (isLoading || isFetching || isRefetching) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/account/orders")}
        className="flex items-center justify-center gap-x-2 text-neutral-700"
      >
        <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75" />
        <p>{t("Order History")}</p>
      </Button>
      <ul className="grid gap-3 mt-6">
        <li className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("Order ID")}
          </span>
          <span className="text-sm font-bold">{order?.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("Order Date")}
          </span>
          <span className="text-sm font-bold">{order.transaction_date}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("Grand Total")}
          </span>
          <span className="text-sm font-bold">
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(order.grand_total)}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("Status")}
          </span>
          <span className="text-sm font-bold">{order.status}</span>
        </li>
      </ul>
      {order?.status && !["Completed", "Shipped"].includes(order.status) && (
        <div className="mt-6">
          <Label>{t("Payment Method")}</Label>
          <div className="flex justify-between items-center mt-2">
            <Select
              value={paymentMethod || paymentMethods.message[0].name}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Select Payment Method")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {paymentMethods.message.map(({ name }: { name: string }) => (
                    <SelectItem value={name} key={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                navigate({
                  pathname: "/checkout/payment",
                  search: createSearchParams({
                    orderId: params.id as string,
                    paymentMethod:
                      paymentMethod ?? paymentMethods!.message[0].name,
                  }).toString(),
                });
              }}
            >
              <p>{t("Pay")}</p>
            </Button>
          </div>
        </div>
      )}
      <div className="mt-6">
        <Label>{t("Shipping Address")}</Label>
        {addressLoading || addressFetching || addressRefetching ? (
          <div>Loading...</div>
        ) : (
          <AddressCard {...address?.message} />
        )}
      </div>
      <div className="mt-6">
        <Label>{t("Order summary")}</Label>
        <div className="mt-6 flex flex-col gap-y-4">
          <ul className="my-3 flex flex-col gap-y-3">
            {(order.items ?? []).map(
              ({ item_code, qty }: { item_code: string; qty: number }) => {
                if (!qty) {
                  return null;
                }
                return (
                  <CheckoutItem
                    key={item_code}
                    itemCode={item_code}
                    qty={qty}
                  />
                );
              }
            )}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col">
          <div className="w-full flex justify-between">
            <p className="text-sm text-muted-foreground">{t("Subtotal")}</p>
            <strong className="text-darkgray">
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(order.total)}
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
              <p className="text-sm text-muted-foreground">{t("Discount")}</p>
              <strong className="text-muted-foreground">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(checkoutSummary.totalDiscount?.toFixed(2) ?? 0)}
              </strong>
            </div>
          )}
          {order.coupon_code && (
            <div className="w-full flex justify-between">
              <p className="text-sm text-muted-foreground">
                {t("Coupon Code")}
              </p>
              <strong className="text-muted-foreground">
                {order.coupon_code}
              </strong>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <div className="w-full flex justify-between">
          <p className="text-sm text-muted-foreground">{t("Grand total")}</p>
          <strong className="text-darkgray">
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(order.grand_total)}
          </strong>
        </div>
      </div>
      <div className="w-full flex justify-center h-10 items-center mt-8">
        <Button variant="link" className="font-bold">
          <MessageCircleQuestion size={20} className="mr-1" />{" "}
          {t("Ask for help")}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
