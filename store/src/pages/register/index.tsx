import { yupResolver } from "@hookform/resolvers/yup";
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
import { useLogin, useRegister, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";
import { registerSchema } from "./registerSchema";
import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "@untitled-ui/icons-react";
import { useState } from "react";

export const Register = () => {
  const t = useTranslate();
  const { mutate: register, isLoading: signingUp } = useRegister();
  const { mutate: login, isLoading: loggingIn } = useLogin();

  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const form = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-y-12 max-w-[410px] mx-auto">
        <h1 className="text-4xl font-semibold text-center">{t("Sign up")}</h1>
        <div className="w-full gap-[72px]">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((userdata) =>
                register(userdata, {
                  onSuccess: () =>
                    login({
                      username: userdata.email,
                      password: userdata.password,
                    }),
                })
              )}
            >
              <div className="grid gap-3">
                <h2 className="font-semibold text-darkgray-500 text-lg">{t("Sign up")}</h2>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="full_name">
                          {t("Full name")}
                        </FormLabel> */}
                        <FormControl>
                          <Input placeholder={`${t("Full name")} *`} disabled={(signingUp || loggingIn)} className="form-input text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="email">
                          {t("Email/username")}
                        </FormLabel> */}
                        <FormControl>
                          <Input placeholder={`${t("Email")} *`} disabled={(signingUp || loggingIn)} className="form-input text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        {/* <FormLabel htmlFor="password">
                          {t("Password")}
                        </FormLabel> */}
                        <FormControl>
                          <Input type={showPassword ? "text" : "password"} disabled={(signingUp || loggingIn)} placeholder={`${t("Password")} *`} className="form-input text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" {...field} />
                        </FormControl>
                        <FormMessage />

                        <button onClick={handleShowPassword} className="absolute right-4 top-2">
                          {showPassword ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                        </button>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="paconfirm_passwordssword">
                          {t("Confirm password")}
                        </FormLabel> */}
                        <FormControl>
                          <Input type="password" disabled={(signingUp || loggingIn)} placeholder={`${t("Confirm password")} *`} className="form-input text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm text-darkgray-200">ฉันยอมรับ 
                  <span className="text-black">ข้อตกลงและเงื่อนไข</span> 
                  รวมถึงการประมวลผลข้อมูลของฉันตามจุดประสงค์ดังที่ระบุไว้ใน 
                  <span className="text-black">นโยบายความเป็นส่วนตัวและการใช้งานคุกกี้</span>
                </p>
                <Button
                  type="submit"
                  className="p-5 h-12.5 text-base font-semibold rounded-xl mt-7"
                  disabled={!form.formState.isValid || signingUp || loggingIn}
                >
                  {(signingUp || loggingIn) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("Accept and sign up")}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 flex flex-col gap-y-3">
            <p className="text-darkgray-200 text-sm">{t("Have an account?")}</p>
            <Link to="/login">
              <Button variant="outline" className="w-full h-12.5 text-base rounded-xl bg-accent border-darkgray-100 font-semibold">
                {t("Sign in")}
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
