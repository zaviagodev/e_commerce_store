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
import { FlipBackward } from "@untitled-ui/icons-react"
import { formatCurrency } from "@/lib/utils";
import { MessageQuestionCircle, Download01 } from "@untitled-ui/icons-react"
import OrderDetailSkeleton from "@/components/skeletons/OrderDetailSkeleton";

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
      onSuccess: (data: any) => setPaymentMethod(data?.message[0].name),
    },
  });

  const checkoutSummary = useSummary(order);

  if (isLoading || isFetching || isRefetching) {
    return <OrderDetailSkeleton />;
  }

  const orderStatus = 
    order.status === "Draft" && t("Draft") ||
    order.status === "Cancelled" && t("Cancelled")

  return (
    <div>
      <div className="flex items-center gap-x-2.5">
        <FlipBackward className="h-5 w-5 cursor-pointer hover:opacity-75" onClick={() => navigate("/account/orders")}/>
        <h2 className="font-semibold text-darkgray-500 text-lg">{t("Order History")}</h2>
      </div>
      <ul className="grid gap-3 mt-10">
        <li className="flex items-center justify-between">
          <span className="text-sm text-darkgray-200">
            {t("Order ID")}
          </span>
          <span className="text-sm font-bold">{order?.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm text-darkgray-200">
            {t("Order Date")}
          </span>
          <span className="text-sm font-bold">{order.transaction_date}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm text-darkgray-200">
            {t("Grand total")}
          </span>
          <span className="text-sm font-bold">
            {formatCurrency(order.grand_total)}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm text-darkgray-200">
            {t("Status")}
          </span>
          <span className="text-sm font-bold">{orderStatus}</span>
        </li>
      </ul>
      {/* {order?.status && !["Completed", "Shipped"].includes(order.status) && (
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
      )} */}
      <div className="mt-10">
        <Label className="text-darkgray-500 font-semibold text-base inline-block mb-2">{t("Shipping Address")}</Label>
        {addressLoading || addressFetching || addressRefetching ? (
          <div>Loading...</div>
        ) : (
          <AddressCard {...address?.message} />
        )}
      </div>
      <div className="mt-10">
        <Label className="text-darkgray-500 font-semibold text-base inline-block mb-2">{t("Order summary")}</Label>
        <div className="flex flex-col gap-y-4">
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
        <div className="lg:ml-[69px]">
          <Separator className="my-4" />
          <div className="flex flex-col gap-4">
            <div className="w-full flex justify-between text-sm">
              <p>{t("Subtotal")}</p>
              <strong>
                {formatCurrency(order.total)}
              </strong>
            </div>
            {checkoutSummary.totalShipping > 0 && (
              <div className="w-full flex justify-between text-sm text-darkgray-200">
                <p>{t("Shipping Cost")}</p>
                <span>
                  {formatCurrency(checkoutSummary.totalShipping)}
                </span>
              </div>
            )}
            <div className="w-full flex justify-between text-sm text-darkgray-200">
              <p>{t("Tax")}</p>
              <span>
                {formatCurrency(checkoutSummary.totalTax)}
              </span>
            </div>
            {checkoutSummary.totalDiscount > 0 && (
              <div className="w-full flex justify-between text-sm text-darkgray-200">
                <p>{t("Discount")}</p>
                <span>
                  {formatCurrency(checkoutSummary.totalDiscount?.toFixed(2) ?? 0)}
                </span>
              </div>
            )}
            {order.coupon_code && (
              <div className="w-full flex justify-between text-sm">
                <p>{t("Coupon Code")}</p>
                <span>
                  {order.coupon_code}
                </span>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="w-full flex justify-between text-sm">
            <p>{t("Grand total")}</p>
            <strong>
              {formatCurrency(order.grand_total)}
            </strong>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center h-10 items-center mt-8">
        <Button variant="link" className="font-bold">
          <MessageQuestionCircle className="mr-2 h-5 w-5" />{" "}
          {t("Ask for help")}
        </Button>
        <Button variant="link" className="font-bold">
          <Download01 className="mr-2 h-5 w-5" />{" "}
          {t("Download receipt")}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
