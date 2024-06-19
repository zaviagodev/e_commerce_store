import AddressCardList from "@/components/customComponents/AddressCardList";
import { useTranslate } from "@refinedev/core";
import AddressDialog from "@/components/address/AddressDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Addresses = () => {
  const t = useTranslate();

  return (
    <div className="lg:w-[410px] mx-auto">
      <h1 className="font-semibold text-darkgray-500 text-lg">
        {t("Addresses")}
      </h1>
      <div className="flex flex-col items-center gap-10 mt-10">
        <AddressDialog>
          <Button
            variant="outline"
            size="lg"
            className="w-full px-4 border border-darkgray-100 bg-accent justify-start rounded-xl text-darkgray-500 flex items-center gap-x-2 h-[60px] font-semibold text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <PlusCircle /> {t("Add New Address")}
          </Button>
        </AddressDialog>
        <AddressCardList />
      </div>
    </div>
  );
};

export default Addresses;
