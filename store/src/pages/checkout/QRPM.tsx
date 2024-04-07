import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckout } from "@/hooks/useCheckout";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCustomMutation,
  useInvalidate,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowDownCircle, Copy, Loader2 } from "lucide-react";
import { confirmPaymentSchema } from "./confirmPaymentSchema";

export const QRPMDetail = () => {
  const t = useTranslate();
  const { orderId, order, selectedPaymentMethod, next } = useCheckout();
  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-primary">{t("Pay with QR")}</h1>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <Label>{t("Order ID")}</Label>
          <strong>{orderId}</strong>
        </div>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${
            selectedPaymentMethod.promptpay_qr_image
          }`}
          alt="QR Code"
          className="w-full"
        />
        <div className="flex justify-between items-center">
          <Label>{t("Account Name")}</Label>
          <strong>{selectedPaymentMethod.account_name}</strong>
        </div>
        <div className="flex justify-between items-center">
          <Label>{t("Account Number")}</Label>
          <strong className="flex items-center -mr-2">
            {selectedPaymentMethod.promptpay_number}
            <Button size="icon" variant="link" className="text-accent">
              <Copy className="h-4 w-4 text-gray-700" />
            </Button>
          </strong>
        </div>
        <div className="flex flex-col bg-secondary p-6 rounded-lg">
          <p className=" text-xs">{t("Grand total")}</p>
          <h2 className="text-2xl font-semibold text-primary">
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(order.grand_total)}
          </h2>
        </div>
        <div>
          <Button
            size="lg"
            className="w-full"
            variant="secondary"
            onClick={() => {
              const link = document.createElement("a");
              link.target = "_blank";
              link.href = `${import.meta.env.VITE_BACKEND_URL}${
                selectedPaymentMethod.promptpay_qr_image
              }`;
              link.download = "QR Code";
              link.click();
            }}
          >
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            {t("Save QR Code")}
          </Button>
          <Button size="lg" className="w-full mt-4" onClick={next}>
            {t("Upload Payment Slip")}
          </Button>
        </div>
      </div>
    </>
  );
};

export const QRUploadSlip = () => {
  const t = useTranslate();
  const { selectedPaymentMethod, orderId, order, next } = useCheckout();

  const invalidate = useInvalidate();

  const form = useForm({
    resolver: yupResolver(confirmPaymentSchema),
    defaultValues: {
      order_name: orderId,
      payment_info: {
        payment_method_key: selectedPaymentMethod.key,
        bank: selectedPaymentMethod.account_name,
      },
      file: {} as any,
    },
    mode: "onChange",
  });

  const { mutate, isLoading: isConfirmingPayment } = useCustomMutation();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("order_name", data.order_name);
    formData.append("payment_info", JSON.stringify(data.payment_info));
    formData.append("file", data.file);

    return mutate({
      dataProviderName: "storeProvider",
      url: "confirm_payment",
      method: "post",
      values: formData,
      successNotification: () => {
        next();
        invalidate({
          dataProviderName: "storeProvider",
          resource: "orders",
          invalidates: ["detail"],
          id: orderId,
        });
        return false;
      },
    });
  };

  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t("Payment Slip Confirm")}
        </h1>
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
            }).format(order.grand_total)}
          </strong>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center p-2 bg-secondary rounded-lg">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${
                  selectedPaymentMethod.promptpay_qr_image
                }`}
                alt={selectedPaymentMethod.name}
                className="h-16 w-16 rounded"
              />
              <div className="w-full flex flex-col ml-4">
                <p className="text-sm text-muted-foreground">
                  {selectedPaymentMethod.name}
                </p>
                <strong>{selectedPaymentMethod.promptpay_number}</strong>
                <p className="text-sm text-muted-foreground">
                  {t("Account Name")}: {selectedPaymentMethod.account_name}
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="slip">{t("Payment Slip *")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) =>
                        form.setValue(
                          "file",
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="lg"
              className="w-full"
              type="submit"
              disabled={!form.formState.isValid || isConfirmingPayment}
            >
              {isConfirmingPayment && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Upload Payment Slip")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
