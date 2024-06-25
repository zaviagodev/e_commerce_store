import { useList, useTranslate } from "@refinedev/core";
import AddressCard from "../AddressCard"

const AddressCardList = () => {

  const { data, isLoading } = useList();
  const t = useTranslate()

  if (isLoading) {
    return <div>{t("Loading")}...</div>;
  }

  return (
    <div className="space-y-2.5 w-full">
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