import AddressForm from "@/components/forms/AddressForm";
import { useBack, useCreate, useTranslate } from "@refinedev/core";

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
    <div className="w-full lg:w-[450px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("New Address")}</h1>
      <div className="mt-6">
        <h1 className="font-semibold text-gray-500 mb-2">
          {t("Address Details")}
        </h1>
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
      </div>
    </div>
  );
};

export default AddressCreate;
