import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema } from "./addressSchema";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import CountrySelect from "../CountrySelect";
import CitySelect from "../CitySelect";
import StateSelect from "../StateSelect";
import { useTranslate } from "@refinedev/core";

type AddressFormProps = {
  initialValues?: {
    address_title: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    country: string;
    pincode?: string;
    phone: string;
    is_primary_address?: number;
    is_shipping_address?: number;
    address_type?: string;
  };
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
};

const AddressForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: AddressFormProps) => {
  const t = useTranslate();
  const form = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: initialValues,
    values: initialValues,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address_title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_line1"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_line2"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Address Line 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StateSelect
                  {...field}
                  country={form.watch("country")}
                  onChange={({ value }) =>
                    form.setValue("state", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CountrySelect
                  {...field}
                  onChange={({ value }) =>
                    form.setValue("country", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CitySelect
                    {...field}
                    country={form.watch("country")}
                    state={form.watch("state")}
                    onChange={({ value }) =>
                      form.setValue("city", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Pincode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="is_primary_address"
            render={({ field }) => (
              <FormItem className="flex items-end">
                <FormControl>
                  <Checkbox
                    {...field}
                    className="mr-2"
                    checked={form.watch("is_primary_address") === 1}
                    onCheckedChange={(checked) => {
                      form.setValue("is_primary_address", checked ? 1 : 0, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  />
                </FormControl>
                <FormLabel>{t("Primary Address")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_shipping_address"
            render={({ field }) => (
              <FormItem className="flex items-end">
                <FormControl>
                  <Checkbox
                    {...field}
                    className="mr-2"
                    checked={form.watch("is_shipping_address") === 1}
                    onCheckedChange={(checked) =>
                      form.setValue("is_shipping_address", checked ? 1 : 0, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                  />
                </FormControl>
                <FormLabel>{t("Default Shipping Address")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full"
          type="submit"
          disabled={
            isSubmitting || !form.formState.isValid || !form.formState.isDirty
          }
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? t("Update Address") : t("Add Address")}
        </Button>
      </form>
    </Form>
  );
};

export default AddressForm;
