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
import { Skeleton } from "./ui/skeleton";
import AddressDialog from "./address/AddressDialog";
import { useCart } from "@/hooks/useCart";

type AddressSelectProps = {
  onSelect: (address: any) => void;
  triggerClassName?: string;
};

const AddressSelect = ({ onSelect, ...props }: AddressSelectProps) => {
  const t = useTranslate();
  const { updateCart } = useCart();
  const { data, isLoading, isFetching, isRefetching } = useList({
    dataProviderName: "storeProvider",
    resource: "address",
  });

  const invalidate = useInvalidate();
  const { mutate, mutateAsync } = useCustomMutation({
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
    return <Skeleton className="w-4 h-4" />;
  }

  return (
    <>
      {(data?.data ?? []).length > 0 && (
        <Sheet>
          <SheetTrigger className="-mb-24 mr-6 z-10">
            <ArrowRight className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll w-full">
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
                <SheetClose key={address.name} asChild>
                  <div
                    className={`cursor-pointer rounded-lg ${
                      props?.value === address.name ? "outline outline-1" : ""
                    }`}
                    onClick={() => {
                      updateCart(mutateAsync, {
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
                </SheetClose>
              ))}
            </RadioGroup>
            <AddressDialog
              onSettled={(data, err) => {
                if (data?.message.name) {
                  mutate({
                    dataProviderName: "storeProvider",
                    url: "update_cart_address",
                    method: "put",
                    values: {
                      address_name: data.message.name,
                      address_type: "shipping",
                    },
                  });
                }
              }}
            >
              <Button className="w-full px-4 text-base rounded-xl h-12.5 mt-9">
                {t("Add Address")}
              </Button>
            </AddressDialog>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default AddressSelect;
