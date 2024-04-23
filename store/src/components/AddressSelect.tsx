import {
  useCustomMutation,
  useInvalidate,
  useList,
  useTranslate,
} from "@refinedev/core";
import { ArrowLeftRight, CirclePlus, Undo2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddressCard from "./AddressCard";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type AddressSelectProps = {
  onSelect: (address: any) => void;
};

const AddressSelect = ({ onSelect, ...props }: AddressSelectProps) => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isRefetching } = useList({
    dataProviderName: "storeProvider",
    resource: "address",
  });

  const invalidate = useInvalidate();
  const { mutate } = useCustomMutation({
    mutationOptions: {
      onSettled: () => {
        invalidate({
          dataProviderName: "storeProvider",
          resource: "cart",
          invalidates: ["list"],
        });
      },
    },
  });

  if (isLoading || isFetching || isRefetching) {
    return <div>Liading...</div>;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <ArrowLeftRight className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="bg-white -m-5 flex flex-row items-center justify-between z-10 px-4 py-3 border-b">
          <SheetClose asChild>
            <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75 absolute" />
          </SheetClose>

          <SheetTitle className="!mx-auto !my-0 text-base">
            {t("Address List")}
          </SheetTitle>
        </SheetHeader>
        <RadioGroup
          {...props}
          className="flex flex-col gap-y-3 pt-10"
          value={props?.value}
        >
          {data?.data.map((address: any) => (
            <div
              className={`cursor-pointer rounded-lg ${
                props?.value === address.name ? "outline outline-1" : ""
              }`}
              onClick={() => {
                mutate({
                  dataProviderName: "storeProvider",
                  url: "update_cart_address",
                  method: "post",
                  values: {
                    address_name: address.name,
                    address_type: "shipping",
                  },
                });
                onSelect(address);
              }}
              key={address.name}
            >
              <RadioGroupItem
                value={address.name}
                id={address.name}
                className="peer sr-only"
              />

              <AddressCard {...address} />
            </div>
          ))}
        </RadioGroup>
        <Button
          className="w-full px-4 text-base rounded-xl h-12.5 mt-9"
          onClick={() => navigate("/account/addresses/new")}
        >
          {t("Add Address")}
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default AddressSelect;
