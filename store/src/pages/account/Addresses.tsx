import AddressCardList from "@/components/customComponents/AddressCardList";
import { useTranslate } from "@refinedev/core";
import AddressDialog from "@/components/address/AddressDialog";

const Addresses = () => {
  const t = useTranslate();

  return (
    <div className="lg:w-[410px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">
        {t("Addresses")}
      </h1>
      <div className="flex flex-col items-center gap-10 mt-10">
        <AddressDialog />
        <AddressCardList />
      </div>
    </div>
  );
};

export default Addresses;
