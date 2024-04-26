import AddAddressButton from "@/components/customComponents/AddAddressButton";
import AddressForm from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/button";
import {
  IResourceComponentsProps,
  useBack,
  useCustomMutation,
  useInvalidate,
  useNavigation,
  useNotification,
  useSelect,
  useTranslate,
  useUpdate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Link } from "react-router-dom";

export const AddressEdit: React.FC<IResourceComponentsProps> = () => {
  const {
    refineCore: { queryResult, id },
  } = useForm({});
  const t = useTranslate();
  const invalidate = useInvalidate();
  const back = useBack();

  const { mutate, isLoading } = useUpdate({
    mutationOptions: {
      onSettled: (data: any, err: any) => {
        if (!err) {
          back();
          invalidate({
            dataProviderName: "storeProvider",
            resource: "address",
            invalidates: ["detail"],
            id: id as string,
          });
        }
      },
    },
  });

  if (queryResult?.isLoading) {
    return <div>Loading...</div>;
  }

  const address = queryResult.data.message;

  return (
    <div className="w-full lg:w-[410px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Address")}</h1>
      <div className="mt-10">
        <AddAddressButton />
        <div className="flex items-center justify-between mt-10">
          <h1 className="font-semibold text-gray-500 mb-2">
            {t("Update Addresses")}
          </h1>
          <Link to="/account/addresses">
            <Button variant="link" className="text-sm p-0">{t("Cancel")}</Button>
          </Link>
        </div>
        {/* <h1 className="font-semibold text-gray-500 mb-2">{address.name}</h1> */}
        <AddressForm
          initialValues={address}
          isSubmitting={isLoading}
          onSubmit={(values) =>
            mutate({
              id: id as string,
              resource: "address",
              dataProviderName: "storeProvider",
              values,
            })
          }
        />
      </div>
    </div>
  );
};
