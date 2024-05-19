import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { profileSchema } from "./profileSchema";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@refinedev/core";

type ProfileFormProps = {
  initialValues: {
    first_name: string;
    last_name: string;
    email: string;
  };
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
};

const ProfileForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) => {
  const t = useTranslate();
  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="placeholder:text-darkgray-300 form-input focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={t("Name")}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="placeholder:text-darkgray-300 form-input focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={t("Surname")}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled
                  placeholder={t("Email")}
                  className="form-input focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="main-btn !mt-6"
          type="submit"
          disabled={
            isSubmitting || !form.formState.isValid || !form.formState.isDirty
          }
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("Update profile")}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
