import { useList } from "@refinedev/core";
import AddressCard from "../AddressCard";
import { Skeleton } from "../ui/skeleton";

const AddressCardList = () => {
  const { data, isLoading } = useList();

  if (isLoading) {
    return (
      <div className="space-y-2.5 w-full">
        <Skeleton className="h-40 rounded-xl w-full" />
        <Skeleton className="h-40 rounded-xl w-full" />
        <Skeleton className="h-40 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2.5 w-full">
      {data?.data?.map((address: any) => (
        <AddressCard
          key={address.name}
          name={address.name}
          address_title={address.address_title}
          phone={address.phone}
          address_line1={address.address_line1}
          address_line2={address.address_line2}
          city={address.city}
          country={address.country}
          state={address.state}
          pincode={address.pincode}
          isActive={address.is_primary_address == 1}
          actions={{
            edit: true,
            delete: true,
          }}
        />
      ))}
    </div>
  );
};

export default AddressCardList;
