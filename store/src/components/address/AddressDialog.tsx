import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslate } from "@refinedev/core";
import AddressCreate from "@/pages/account/AddressCreate";

type AddressDialogProps = {
  onOpenChange?: (state: boolean) => void;
  onSettled?: (data: any, error: any) => void;
};

const AddressDialog = ({ onOpenChange, onSettled }: AddressDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslate();
  return (
    <Dialog
      onOpenChange={(state) => {
        setIsOpen(state);
        if (onOpenChange) {
          onOpenChange(state);
        }
      }}
      open={isOpen}
    >
      <DialogTrigger className="w-full">
        <Button
          variant="outline"
          size="lg"
          className="w-full px-4 border border-darkgray-100 bg-accent justify-start rounded-xl text-darkgray-500 flex items-center gap-x-2 h-[60px] font-semibold text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <PlusCircle /> {t("Add New Address")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full max-w-none lg:h-fit lg:w-[680px]">
        <AddressCreate
          onCancel={() => setIsOpen(false)}
          onSettled={(data, err) => {
            if (onSettled) {
              onSettled(data, err);
            }
            if (err) return;
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
