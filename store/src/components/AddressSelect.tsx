import {
  useCustomMutation,
  useInvalidate,
  useList,
  useTranslate,
} from "@refinedev/core";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddressCard from "./AddressCard";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { FlipBackward, ArrowRight } from "@untitled-ui/icons-react";

type AddressSelectProps = {
  onSelect: (address: any) => void;
  triggerClassName?: string;
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
      <SheetTrigger className="-mb-24 mr-6">
        <ArrowRight className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader className="bg-white -m-5 flex flex-row items-center justify-between z-10 px-4 py-3 border-b">
          <SheetClose asChild>
            <FlipBackward className="h-5 w-5 cursor-pointer hover:opacity-75 absolute" />
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

              <AddressCard
                {...address}
                isActive={props?.value === address.name}
              />
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
