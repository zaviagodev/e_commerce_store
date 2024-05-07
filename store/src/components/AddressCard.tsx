import { Button } from "./ui/button";
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
import { Edit03, MarkerPin04, Trash01 } from "@untitled-ui/icons-react";
import MainAlertDialog from "./customComponents/MainAlertDialog";

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
    <Card className="w-full overflow-hidden bg-accent border border-darkgray-100 rounded-xl shadow-none">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base flex items-center gap-x-2 text-darkgray-500">
          <MarkerPin04 /> {name}
        </CardTitle>
        {actions && (
          <div className="flex items-center gap-x-4 !m-0">
            {actions.edit && (
              <Edit03 className="!m-0 h-5 w-5 cursor-pointer text-gray-500" onClick={() => navigate(`/account/addresses/${name}`)}/>
            )}
            {actions.delete && <DeletionConfirmation name={name} />}
          </div>
        )}
      </CardHeader>
      <CardContent className="text-[#2F2F2F] relative text-sm">
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
    <MainAlertDialog 
      trigger={<Trash01 className="!m-0 h-5 w-5 hover:text-destructive cursor-pointer text-gray-500" />}
      title={t("Delete address.title")}
      description={<span className="inline-block px-[60px]">{t("Delete address.desc")}</span>}
      cancel={t("Cancel")}
      action={t("Delete address.confirm")}
      onClickAction={() =>
        mutate({
          dataProviderName: "storeProvider",
          resource: "address",
          id: name,
        })}
      asChild={true}
    />
  );
};
