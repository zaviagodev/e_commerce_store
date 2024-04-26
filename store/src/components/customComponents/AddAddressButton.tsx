import { PlusCircle } from "@untitled-ui/icons-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslate } from "@refinedev/core";

const AddAddressButton = () => {
  const t = useTranslate();
  const navigate = useNavigate()

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full px-4 border border-darkgray-100 bg-accent justify-start rounded-xl text-darkgray-500 flex items-center gap-x-2 h-[60px] font-semibold text-base"
      onClick={() => navigate("/account/addresses/new")}
    >
      <PlusCircle /> {t("Add New Address")}
    </Button>
  )
}

export default AddAddressButton