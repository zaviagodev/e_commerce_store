import AddressForm from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/button";
import { useCreate, useTranslate } from "@refinedev/core";

// Used for opening the modal, which was created on 'Addresses.tsx', and when users click on the 'cancel' button
type AddressCreateProps = {
  onCancel: () => void;
  onSettled?: (data: any, error: any) => void;
};

const AddressCreate = ({ onCancel, onSettled }: AddressCreateProps) => {
  const t = useTranslate();
  const { mutate, isLoading } = useCreate({
    mutationOptions: {
      onSettled: onSettled,
    },
  });

  return (
    <div className="w-full mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">
        {t("Address")}
      </h1>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-500">
            {t("Add New Address")}
          </h1>
          <Button variant="link" className="text-sm p-0" onClick={onCancel}>
            {t("Cancel")}
          </Button>
        </div>
        <div className="space-y-10">
          <AddressForm
            isSubmitting={isLoading}
            onSubmit={(values) => {
              mutate({
                resource: "address",
                dataProviderName: "storeProvider",
                values,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressCreate;
