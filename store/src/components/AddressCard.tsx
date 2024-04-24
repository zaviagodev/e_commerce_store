import { Button } from "./ui/button";
import { MapPinned, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDelete, useTranslate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

type AddressCardActions = {
  edit?: boolean;
  delete?: boolean;
};

type AddressCardProps = {
  name: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  country?: string;
  state?: string;
  pincode?: string;
  display?: string;
  isActive?: boolean;
  actions?: AddressCardActions;
};

const AddressCard = ({
  name,
  phone,
  address_line1,
  address_line2,
  city,
  country,
  state,
  pincode,
  display,
  actions = {
    edit: false,
    delete: false,
  },
}: AddressCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full overflow-hidden bg-accent border border-darkgray-100 rounded-xl">
      <CardHeader className="flex flex-row justify-between items-center text-gray-500">
        <CardTitle className="text-base flex items-center">
          <MapPinned size={20} className="mr-2" /> {name}
        </CardTitle>
        {actions.edit && (
          <Button
            variant="ghost"
            size="icon"
            className="w-5 text-gray-500 hover:text-gray-900 hover:bg-transparent"
            onClick={() => navigate(`/account/addresses/${name}`)}
          >
            <Pencil size={18} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="text-gray-700 relative text-sm">
        {display ? (
          <p dangerouslySetInnerHTML={{ __html: display }} />
        ) : (
          <>
            {address_line1},
            {address_line2 && (
              <>
                <br />
                {address_line2},
              </>
            )}
            {(city || state || country) && <br />}
            {city}
            {state && `, ${state}`}
            {country && `, ${country}`}
            {pincode && `, ${pincode}`}
            {phone && (
              <>
                <br />
                Phone: {phone}
              </>
            )}
          </>
        )}
        {actions.delete && <DeletionConfirmation name={name} />}
      </CardContent>
      <img src="/border-line.png" className="w-full h-2.5" />
    </Card>
  );
};
export default AddressCard;

type DeletionConfirmationProps = {
  name: string;
};

export const DeletionConfirmation = ({ name }: DeletionConfirmationProps) => {
  const t = useTranslate();
  const { mutate } = useDelete();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-5 text-gray-500 hover:text-destructive hover:bg-transparent absolute right-6 bottom-4"
        >
          <Trash2 size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Are you absolutely sure?")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "This action cannot be undone. This will permanently delete your address."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutate({
                dataProviderName: "storeProvider",
                resource: "address",
                id: name,
              })
            }
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
