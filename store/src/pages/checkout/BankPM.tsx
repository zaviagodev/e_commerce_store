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
import { Input } from "@/components/ui/input";

export const BankPMDetail = () => {
  const t = useTranslate();
  const { selectedPaymentMethod, orderId, order, next } = useCheckout();

  return (
    <>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t("Bank Transfer")}
        </h1>
        <p>
          {t(
            "Select one of the bank account below and continue your payment with bank number,"
          )}
          {t(
            "Note that the store admin may takes sometime to review the bank slip"
          )}
        </p>
      </div>
      <div className="mt-6 w-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <Label>{t("Order ID")}</Label>
          <strong>{orderId}</strong>
        </div>
        {selectedPaymentMethod.banks_list.map((bank: any) => (
          <div
            key={bank.bank}
            className="flex items-center p-2 bg-secondary rounded-lg"
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
              className="text-accent"
              onClick={() =>
                navigator.clipboard.writeText(bank.bank_account_number)
              }
            >
              <Copy className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        ))}
        <div className="flex flex-col bg-secondary p-6 rounded-lg">
          <p className=" text-xs">{t("Grand total")}</p>
          <h2 className="text-2xl font-semibold text-primary">
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(order.grand_total)}
          </h2>
        </div>
        <Button size="lg" className="w-full" onClick={next}>
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
      order_name: orderId,
      payment_info: {
        payment_method_key: selectedPaymentMethod.key,
        bank: "",
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
          {t("Confirm your payment")}
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
            }).format(order?.grand_total)}
          </strong>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="payment_info.bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Select the Bank Account you transfered to")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col gap-y-2 mt-2"
                      {...field}
                    >
                      {selectedPaymentMethod.banks_list.map((bank: any) => (
                        <div
                          key={bank.bank}
                          className="flex items-center p-2 bg-secondary rounded-lg cursor-pointer"
                          onClick={() =>
                            form.setValue("payment_info.bank", bank.bank)
                          }
                        >
                          <RadioGroupItem value={bank.bank} className="mx-2" />
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
                            <p className="text-sm text-muted-foreground">
                              {t("Account Name")}: {bank.bank_account_name}
                            </p>
                          </div>
                        </div>
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
