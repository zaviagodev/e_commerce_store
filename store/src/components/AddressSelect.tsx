import {
  useCustomMutation,
  useInvalidate,
  useList,
  useTranslate,
} from "@refinedev/core";
import { ArrowLeftRight, Undo2 } from "lucide-react";
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

type AddressSelectProps = {
  onSelect: (address: any) => void;
};

const AddressSelect = ({ onSelect, ...props }: AddressSelectProps) => {
  const t = useTranslate();
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
        <SheetHeader className="bg-white -mt-4 flex flex-row items-center z-10 -mr-2 -ml-2">
          <SheetClose asChild>
            <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75" />
          </SheetClose>

          <SheetTitle className="!mx-auto !my-0">
            {t("Address List")}
          </SheetTitle>
        </SheetHeader>
        <RadioGroup
          {...props}
          className="my-3 flex flex-col gap-y-3"
          value={props?.value}
        >
          {data?.data.map((address: any) => (
            <div
              className={`cursor-pointer rounded-lg ${
                props?.value === address.name ? "outline" : ""
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
      </SheetContent>
    </Sheet>
  );
};

export default AddressSelect;
