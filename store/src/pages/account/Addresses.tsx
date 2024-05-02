import AddressCardList from "@/components/customComponents/AddressCardList";
import { Button } from "@/components/ui/button";
import { useList, useTranslate } from "@refinedev/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddressCreate from "./AddressCreate";
import { PlusCircle } from "@untitled-ui/icons-react";
import { useState } from "react";

const Addresses = () => {
  const t = useTranslate();
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  return (
    <div>
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Addresses")}</h1>
      <div className="flex flex-col items-center gap-10 mt-10">

        <Dialog onOpenChange={setIsAddingAddress} open={isAddingAddress}>
          <DialogTrigger className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full px-4 border border-darkgray-100 bg-accent justify-start rounded-xl text-darkgray-500 flex items-center gap-x-2 h-[60px] font-semibold text-base"
            >
              <PlusCircle /> {t("Add New Address")}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full h-full max-w-none lg:h-fit lg:w-fit">
            <AddressCreate setIsOpen={setIsAddingAddress}/>
          </DialogContent>
        </Dialog>

        {/* This 'address card list' button component was created on the customComponents folder. 
            Because I want to use it on AddressEdit and AddressCreate file.
        */}
        <AddressCardList />
      </div>
    </div>
  );
};

export default Addresses;
