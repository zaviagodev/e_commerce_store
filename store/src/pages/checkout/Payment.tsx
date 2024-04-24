import AddressCard from "@/components/AddressCard";
import StepMaintainer from "@/components/StepMaintainer";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckoutProvider, useCheckout } from "@/hooks/useCheckout";
import useSummary from "@/hooks/useSummary";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paymentMethodIconMap } from ".";
import { QRPMDetail, QRUploadSlip } from "./QRPM";
import { BankPMDetail, BankUploadSlip } from "./BankPM";
import { Wallet04 } from "@untitled-ui/icons-react";

export const PaymentProvider: React.FC = () => {
  return (
    <CheckoutProvider>
      <Payment />
    </CheckoutProvider>
  );
};
export default PaymentProvider;

const Payment = () => {
  return (
    <div className="w-full min-h-screen mx-auto flex py-10 px-4 lg:w-[450px] lg:px-0">
      <div className="w-full">
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-2 text-lg font-semibold md:text-base mx-auto"
        >
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold text-primary">ABC Company</h2>
        </Link>

        <StepMaintainer useStateHook={useCheckout}>
          <Summary />
          <PMDetail />
          <UploadSlip />
          <Thankyou />
        </StepMaintainer>
      </div>
    </div>
  );
};

const Summary = () => {
  const t = useTranslate();
  const [showDetails, setshowDetails] = useState(true);
  const { orderId, order, selectedPaymentMethod, next } = useCheckout();
  const checkoutSummary = useSummary(order);
  const { data: profile } = useGetIdentity();

  if (!order) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div className="mt-4 text-center">
        <p>
          {t("Email")}: <strong>{profile?.user.email}</strong>
          {profile?.mobile_no && (
            <>
              <br />
              {t("Phone")}: <strong>{profile?.mobile_no}</strong>
            </>
          )}
        </p>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <Label>{t("Order ID")}</Label>
        <strong>{orderId}</strong>
      </div>
      {selectedPaymentMethod?.key && (
        <div className="mt-6">
          <Label className="flex items-center justify-between font-semibold text-base rounded-xl border border-darkgray-100 bg-accent px-6 py-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
            <span className="flex items-center text-darkgray-500 gap-x-2">
              <Wallet04 />
              วิธีการชำระเงิน
            </span>
            <span className="flex items-center">
              {paymentMethodIconMap[selectedPaymentMethod?.key as string]}
              {selectedPaymentMethod?.name}
            </span>
          </Label>
        </div>
      )}
      <div className="mt-9 flex flex-col rounded-lg space-y-6">
        <div className="flex items-center justify-between text-darkgray-200 text-sm">
          <p>{t("Grand total")}</p>
          <p>{order?.items?.length} {t(order?.items?.length === 1 ? "Item" : "Items")}</p>
        </div>
        <h2 className="text-4xl font-semibold text-primary text-center">
          {new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
          }).format(order.grand_total)}
        </h2>
      </div>
      <div className="mt-9 mb-1 text-center">
        <Button size="lg" className="w-full h-12.5 text-base font-semibold" onClick={next}>
          {t("Pay Now")}
        </Button>
        <Button
          className="text-muted-foreground mt-2"
          variant="link"
          onClick={() => setshowDetails((prevState) => !prevState)}
        >
          {showDetails ? t("Hide Details") : t("Show Details")}
        </Button>
      </div>
      {showDetails && (
        <div className="flex flex-col gap-y-4">
          <AddressCard
            name={order.shipping_address_name}
            display={order.address_display}
          />
          <div className="flex flex-col mt-10">
            <ul className="flex flex-col gap-y-8">
              {order.items.map(
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
          <Separator />
          <div className="flex flex-col gap-y-4">
            <div className="w-full flex justify-between text-sm">
              <p>{t("Subtotal")}</p>
              <strong>
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(order.total)}
              </strong>
            </div>
            {checkoutSummary.totalShipping > 0 && (
              <div className="w-full flex justify-between text-sm text-darkgray-200">
                <p>{t("Shipping Cost")}</p>
                <span>
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(checkoutSummary.totalShipping)}
                </span>
              </div>
            )}
            <div className="w-full flex justify-between text-sm text-darkgray-200">
              <p>{t("Tax")}</p>
              <span>
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(checkoutSummary.totalTax)}
              </span>
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
          <Separator />
          <div className="w-full flex justify-between text-sm">
            <p>{t("Grand total")}</p>
            <strong>
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(order.grand_total)}
            </strong>
          </div>
        </div>
      )}
    </>
  );
};

export const PMDetail = () => {
  const { selectedPaymentMethod } = useCheckout();

  const PMDetailKeyMap: { [key: string]: React.FC<{}> } = {
    1: QRPMDetail,
    2: BankPMDetail,
  };

  const PMDetailComponent = PMDetailKeyMap[selectedPaymentMethod.key as string];

  return <PMDetailComponent />;
};

export const UploadSlip = () => {
  const { selectedPaymentMethod } = useCheckout();

  const UploadSlipKeyMap: { [key: string]: React.FC<{}> } = {
    1: QRUploadSlip,
    2: BankUploadSlip,
  };

  const UploadSlipComponent =
    UploadSlipKeyMap[selectedPaymentMethod.key as string];

  return <UploadSlipComponent />;
};

const Thankyou = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { orderId, order } = useCheckout();
  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t("Payment Confirm sent")}
        </h1>
        <p>
          {t("Thank you for your oder !")}
          <br />
          {t("You can go to your order history page to track order status.")}
        </p>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <Label>{t("Order ID")}</Label>
          <strong>{orderId}</strong>
        </div>
        <div className="flex justify-between items-center">
          <Label>{t("Total")}</Label>
          <strong>
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(order?.grand_total)}
          </strong>
        </div>
        <div className="mt-6 mb-1 text-center">
          <Button size="lg" className="w-full" onClick={() => navigate("/")}>
            {t("Back to Store")}
          </Button>
          <Button
            className="text-muted-foreground mt-2"
            variant="link"
            onClick={() => navigate(`/account/orders/${orderId}`)}
          >
            {t("Check order details")}
          </Button>
        </div>
      </div>
    </>
  );
};
