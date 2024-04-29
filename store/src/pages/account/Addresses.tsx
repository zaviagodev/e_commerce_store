import AddressCard from "@/components/AddressCard";
import AddAddressButton from "@/components/customComponents/AddAddressButton";
import AddressCardList from "@/components/customComponents/AddressCardList";
import { Button } from "@/components/ui/button";
import { useList, useTranslate } from "@refinedev/core";

const Addresses = () => {
  const t = useTranslate();

  return (
    <>
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Addresses")}</h1>
      <div className="flex flex-col items-center gap-10 mt-10">

        {/* This 'add address' button component was created on the customComponents folder. */}
        <AddAddressButton />

        {/* This 'address card list' button component was created on the customComponents folder. 
            Because I want to use it on AddressEdit and AddressCreate file.
        */}
        <AddressCardList />
      </div>
    </>
  );
};

export default Addresses;
