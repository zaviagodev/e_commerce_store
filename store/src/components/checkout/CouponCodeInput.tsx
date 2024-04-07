import {
  useCustomMutation,
  useInvalidate,
  useTranslate,
} from "@refinedev/core";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "@refinedev/react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { couponCodeSchema } from "./couponCodeSchema";

const CouponCodeInput = () => {
  const t = useTranslate();
  const invalidate = useInvalidate();

  const form = useForm({
    resolver: yupResolver(couponCodeSchema),
    defaultValues: {
      applied_code: "",
      applied_referral_sales_partner: undefined,
    },
    mode: "onChange",
  });

  const { mutate } = useCustomMutation({
    mutationOptions: {
      onSettled: () => {
        invalidate({
          dataProviderName: "storeProvider",
          resource: "cart",
          invalidates: ["list"],
        });
        form.reset();
      },
    },
  });

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit((values) =>
          mutate({
            dataProviderName: "storeProvider",
            url: "apply_coupon_code",
            method: "post",
            values,
          })
        )}
      >
        <div className="flex items-start space-x-2 mt-4">
          <FormField
            control={form.control}
            name="applied_code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="border-none bg-secondary"
                    placeholder={t("Coupon code")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit">
            {t("Apply")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponCodeInput;
