import AddressCardList from "@/components/customComponents/AddressCardList";
import AddressForm from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/button";
import {
  IResourceComponentsProps,
  useBack,
  useInvalidate,
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
  const back = useBack();

  const invalidate = useInvalidate();
  const { mutate, isLoading } = useUpdate({
    mutationOptions: {
      onSettled: (data: any, err: any) => {
        if (!err) {
          back();
          invalidate({
            dataProviderName: "storeProvider",
            resource: "address",
            invalidates: ["list", "detail"],
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
    <div className="lg:w-[410px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">
        {t("Address")}
      </h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mt-10">
          <h1 className="font-semibold text-gray-500 mb-2">
            {t("Update Addresses")}
          </h1>
          <Link to="/account/addresses">
            <Button variant="link" className="text-sm p-0">
              {t("Cancel")}
            </Button>
          </Link>
        </div>
        {/* <h1 className="font-semibold text-gray-500 mb-2">{address.name}</h1> */}
        <div className="space-y-10">
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

          {/* This section is the address list that users may not want to go back to the address page
              Also, this component was created on the customComponents folder because I also want to use it
              on AddressCreate.tsx file
          */}
          <AddressCardList />
        </div>
      </div>
    </div>
  );
};
