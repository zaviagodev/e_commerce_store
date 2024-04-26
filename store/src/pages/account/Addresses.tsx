import AddressCard from "@/components/AddressCard";
import AddAddressButton from "@/components/customComponents/AddAddressButton";
import { Button } from "@/components/ui/button";
import { useList, useTranslate } from "@refinedev/core";

const Addresses = () => {
  const t = useTranslate();
  const { data, isLoading } = useList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:w-[410px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Addresses")}</h1>
      <div className="flex flex-col items-center gap-10 mt-10">

        {/* This 'add address' button component was created on the customComponents folder. */}
        <AddAddressButton />
        <div className="space-y-2.5">
          {data?.data?.map((address: any) => (
            <AddressCard
              key={address.name}
              name={address.name}
              phone={address.phone}
              address_line1={address.address_line1}
              address_line2={address.address_line2}
              city={address.city}
              country={address.country}
              state={address.state}
              pincode={address.pincode}
              actions={{
                edit: true,
                delete: true,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Addresses;
