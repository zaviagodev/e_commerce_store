import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCheckout } from "@/hooks/useCheckout";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCustomMutation,
  useInvalidate,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Copy, Loader2 } from "lucide-react";
import { confirmPaymentSchema } from "./confirmPaymentSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import ImageInput from "@/components/forms/controls/ImageInput";
import { ChangeEvent, useState, MouseEvent } from "react";

export const BankPMDetail = () => {
  const t = useTranslate();
  const { selectedPaymentMethod, orderId, order, next } = useCheckout();

  const [isTextCopied, setIsTextCopied] = useState<number | null>()

  const copyAccountNumber = (acc: any, index: number) => {
    navigator.clipboard.writeText(acc)
    setIsTextCopied(index)
    setTimeout(() => {
      setIsTextCopied(null)
    }, 1000)
  }

  return (
    <>
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t("Bank Transfer")}
        </h1>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-base text-darkgray-200">{t("Order ID")}</Label>
          <strong>{orderId}</strong>
        </div>
        {selectedPaymentMethod.banks_list.map((bank: any, index: number) => (
          <div
            key={bank.bank}
            className="flex items-center p-4 bg-accent border border-darkgray-100 rounded-xl"
          >
            <img
              src="https://source.unsplash.com/1600x900/?bank"
              alt={bank.bank}
              className="h-16 w-16 rounded"
            />
            <div className="w-full flex flex-col ml-4">
              <p className="text-sm text-muted-foreground">{bank.bank}</p>
              <strong>{bank.bank_account_number}</strong>
              <p className="text-sm text-muted-foreground">
                {t("Account Name")}: {bank.bank_account_name}
              </p>
            </div>
            <Button
              size="icon"
              variant="link"
              className="text-accent relative group focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => copyAccountNumber(bank.bank_account_number, index)}
            >
              <p className={`absolute bg-[#111111] px-2 py-1.5 text-xs rounded-full group-hover:opacity-100 group-hover:visible group-hover:-top-6 -top-5 transition-all ${isTextCopied === index ? 'opacity-100 visible -top-6' : 'opacity-0 invisible'}`}>
                {t(isTextCopied == index ? "Copied" : "Copy")}
              </p>
              <Copy className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        ))}
        <div className="flex flex-col items-center rounded-lg space-y-6">
          <p className="text-darkgray-200 text-sm">{t("Grand total")}</p>
          <h2 className="text-4xl font-semibold text-primary text-center">
            {formatCurrency(order.grand_total)}
          </h2>
        </div>
        <Button
          size="lg"
          className="w-full h-12.5 text-base font-semibold rounded-xl"
          onClick={next}
        >
          {t("Upload Payment Slip")}
        </Button>
      </div>
    </>
  );
};

export const BankUploadSlip = () => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const { selectedPaymentMethod, orderId, order, next } = useCheckout();

  const form = useForm({
    resolver: yupResolver(confirmPaymentSchema),
    defaultValues: {
      invoice_name: orderId,
      payment_info: {
        payment_method_key: selectedPaymentMethod.key,
        bank: "",
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
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-base text-darkgray-200">
              {t("Order ID")}
            </Label>
            <strong>{orderId}</strong>
          </div>
          <div className="flex justify-between items-center">
            <Label className="text-base text-darkgray-200">
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
            <FormField
              control={form.control}
              name="payment_info.bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-primary font-semibold">
                    {t("Bank Account")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      {...field}
                      className="flex flex-col gap-y-2 mt-2"
                      value={form.getValues("payment_info.bank")}
                      onValueChange={(value) =>
                        form.setValue("payment_info.bank", value)
                      }
                    >
                      {selectedPaymentMethod.banks_list.map((bank: any) => (
                        <label
                          htmlFor={bank.bank}
                          key={bank.bank}
                          className={`flex items-center p-4 bg-accent border ${
                            form.getValues("payment_info.bank") === bank.bank
                              ? "border-primary"
                              : "border-darkgray-100"
                          } rounded-xl cursor-pointer`}
                        >
                          <RadioGroupItem
                            className="mx-2 w-auto"
                            id={bank.bank}
                            value={bank.bank}
                          />
                          <img
                            src="https://source.unsplash.com/1600x900/?bank"
                            alt={bank.bank}
                            className="h-16 w-16 rounded"
                          />
                          <div className="w-full flex flex-col ml-4">
                            <p className="text-sm text-muted-foreground">
                              {bank.bank}
                            </p>
                            <strong>{bank.bank_account_number}</strong>
                            <p className="text-sm text-darkgray-500 font-semibold">
                              {t("Account Name")}: {bank.bank_account_name}
                            </p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      value={field.value as any}
                      name="file"
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
