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
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdatePassword, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { resetPasswordSchema } from "./resetPasswordSchema";

export const ResetPassword = () => {
  const t = useTranslate();
  const params = useParams<{ key: string }>();
  const { mutate: updatePassword, isLoading } = useUpdatePassword();

  const form = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      key: params.key,
      password: "",
    },
  });

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-y-12 max-w-[890px] mx-auto">
        <h1 className="text-4xl font-semibold text-center">{t("Reset Password")}</h1>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[72px]">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((creds) => updatePassword(creds))}
            >
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="password">
                          {t("New Password")}
                        </FormLabel> */}
                        <FormControl>
                          <Input type="password" className="form-input text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" placeholder={t("New Password")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="p-5 h-12.5 text-base font-semibold rounded-xl" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("Reset Password")}
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex flex-col gap-y-3">
            <h2 className="font-semibold text-darkgray-500 text-lg">{t("New customer")}</h2>
            <p className="text-darkgray-200">{t("Register privilege")}</p>
            <Link to="/register" className="mt-7">
              <Button className="text-base h-12.5 rounded-xl font-semibold">
                {t("Sign up")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="hidden bg-muted lg:block">
        <img
          src="https://source.unsplash.com/1600x900/?shop,onlineshop,ecommerce"
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div> */}
    </section>
  );
};
