import { useList } from "@refinedev/core";
import AddressCard from "../AddressCard"

const AddressCardList = () => {

  const { data, isLoading } = useList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2.5">
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
  )
}

export default AddressCardList