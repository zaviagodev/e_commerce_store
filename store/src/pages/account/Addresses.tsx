import AddressCard from "@/components/AddressCard";
import { Button } from "@/components/ui/button";
import { useList, useTranslate } from "@refinedev/core";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Addresses = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { data, isLoading } = useList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:w-[450px] mx-auto">
      <h1 className="font-semibold text-darkgray">{t("Addresses")}</h1>
      <div className="flex flex-col items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full px-6 justify-start text-lg text-gray-500"
          onClick={() => navigate("/account/addresses/new")}
        >
          <CirclePlus className="mr-2" /> {t("Add New Address")}
        </Button>
        {data?.data?.map((address: any) => (
          <AddressCard
            key={address.name}
            name={address.name}
            phone={address.phone}
            address_line1={address.address_line1}
            address_line2={address.address_line2}
            city={address.city}
            country={address.country}
            state={address.state}
            pincode={address.pincode}
            actions={{
              edit: true,
              delete: true,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Addresses;
