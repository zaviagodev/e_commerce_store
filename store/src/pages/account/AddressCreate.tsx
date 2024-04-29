import AddressCardList from "@/components/customComponents/AddressCardList";
import AddressForm from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/button";
import { useBack, useCreate, useTranslate } from "@refinedev/core";
import { Link } from "react-router-dom";

const AddressCreate = () => {
  const t = useTranslate();
  const back = useBack();
  const { mutate, isLoading } = useCreate({
    mutationOptions: {
      onSettled: (data, err) => {
        if (!err) {
          back();
        }
      },
    },
  });

  return (
    <>
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Address")}</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-500">
            {t("Add New Address")}
          </h1>
          <Link to="/account/addresses">
            <Button variant="link" className="text-sm p-0">{t("Cancel")}</Button>
          </Link>
        </div>
        <div className="space-y-10">
          <AddressForm
            isSubmitting={isLoading}
            onSubmit={(values) =>
              mutate({
                resource: "address",
                dataProviderName: "storeProvider",
                values,
              })
            }
          />

          {/* This section is the address list that users may not want to go back to the address page
              Also, this component was created on the customComponents folder because I also want to use it
              on AddressEdit.tsx file
          */}
          <AddressCardList />
        </div>
      </div>
    </>
  );
};

export default AddressCreate;
