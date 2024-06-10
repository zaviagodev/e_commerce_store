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
import { ImagePlus, X } from "@untitled-ui/icons-react";
import { ChangeEvent, useState, MouseEvent } from "react";
import { formatCurrency } from "@/lib/utils";
import ImageInput from "@/components/forms/controls/ImageInput";

export const QRPMDetail = () => {
  const t = useTranslate();
  const { orderId, order, selectedPaymentMethod, next } = useCheckout();
  return (
    <>
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-primary">{t("Pay with QR")}</h1>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-darkgray-200 text-base">{t("Order ID")}</Label>
          <strong>{orderId}</strong>
        </div>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL ?? ""}${
            selectedPaymentMethod.promptpay_qr_image
          }`}
          alt="QR Code"
          className="w-full"
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-darkgray-200 text-base">
              {t("Account Name")}
            </Label>
            <strong>{selectedPaymentMethod.account_name}</strong>
          </div>
          <div className="flex justify-between items-center">
            <Label className="text-darkgray-200 text-base">
              {t("Account Number")}
            </Label>
            <strong className="flex items-center -mr-2">
              {selectedPaymentMethod.promptpay_number}
              <Button
                size="icon"
                variant="link"
                className="text-accent"
                onClick={() =>
                  navigator.clipboard.writeText(
                    selectedPaymentMethod.promptpay_number
                  )
                }
              >
                <Copy className="h-4 w-4 text-gray-700" />
              </Button>
            </strong>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-lg space-y-6 mb-4">
          <p className="text-darkgray-200 text-sm">{t("Grand total")}</p>
          <h2 className="text-4xl font-semibold text-primary text-center">
            {formatCurrency(order.grand_total)}
          </h2>
        </div>
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-12.5 font-semibold text-base bg-accent border-darkgray-100 flex items-center gap-x-2 rounded-xl"
            variant="outline"
            onClick={() => {
              const link = document.createElement("a");
              link.target = "_blank";
              link.href = `${import.meta.env.VITE_BACKEND_URL ?? ""}${
                selectedPaymentMethod.promptpay_qr_image
              }`;
              link.download = "QR Code";
              link.click();
            }}
          >
            <ArrowDownCircle className="h-4 w-4" />
            {t("Save QR Code")}
          </Button>
          <Button
            size="lg"
            className="w-full h-12.5 text-base font-semibold rounded-xl"
            onClick={next}
          >
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
      invoice_name: orderId,
      payment_info: {
        payment_method_key: selectedPaymentMethod.key,
        bank: selectedPaymentMethod.account_name,
      },
      file: "",
    },
    mode: "onChange",
  });

  const { mutate, isLoading: isConfirmingPayment } = useCustomMutation();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("invoice_name", data.invoice_name);
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
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t("Payment Slip Confirm")}
        </h1>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-darkgray-200 text-base">
              {t("Order ID")}
            </Label>
            <strong>{orderId}</strong>
          </div>
          <div className="flex justify-between items-center">
            <Label className="text-darkgray-200 text-base">
              {t("Grand total")}
            </Label>
            <strong>{formatCurrency(order?.grand_total)}</strong>
          </div>
        </div>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <p className="text-primary font-semibold">{t("Bank Account")}</p>
              <div className="flex items-center p-4 bg-accent border border-darkgray-100 rounded-xl">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL ?? ""}${
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
                  <p className="text-sm font-semibold text-darkgray-500">
                    {t("Account Name")}: {selectedPaymentMethod.account_name}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-primary font-semibold">
                    {t("Payment Slip *")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ImageInput
                      {...field}
                      name="file"
                      value={field.value as any}
                      onChange={(files) =>
                        form.setValue("file", files ? files[0] : "", {
                          shouldValidate: true,
                        })
                      }
                      onRemove={() => form.setValue("file", "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="lg"
              className="w-full h-12.5 text-base font-semibold rounded-xl"
              type="submit"
              disabled={!form.formState.isValid || isConfirmingPayment}
            >
              {isConfirmingPayment && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Confirm your payment")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
