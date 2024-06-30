import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useTranslate } from "@refinedev/core";
import AddressCreate from "@/pages/account/AddressCreate";

type AddressDialogProps = {
  onOpenChange?: (state: boolean) => void;
  onSettled?: (data: any, error: any) => void;
  children?: React.ReactNode;
};

const AddressDialog = ({
  onOpenChange,
  onSettled,
  children,
}: AddressDialogProps) => {
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
      <DialogTrigger className="w-full">{children}</DialogTrigger>
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
