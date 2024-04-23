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
import { useState } from "react";

const CouponCodeInput = () => {

  const [addCoupon, setAddCoupon] = useState<boolean>(false)
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
    <>
      {addCoupon ? (
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
                        className="rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        placeholder={t("Add coupon")}
                        {...field}
                        onBlur={(e) => e.target.value === "" && setAddCoupon(false)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="rounded-xl" type="submit">
                {t("Apply")}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button className="!bg-transparent w-fit p-0 !text-[#4176FF] font-semibold" variant="ghost" onClick={() => setAddCoupon(true)}>
          {t("Add coupon")}
        </Button>
      )}
    </>
  );
};

export default CouponCodeInput;
