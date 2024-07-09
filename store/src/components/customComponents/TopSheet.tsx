import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

type SearchbarProps = {
  trigger: string | ReactNode;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  contentProps?: any;
};

const TopSheet = ({
  trigger,
  children,
  onOpenChange,
  open,
  triggerClassName,
  contentClassName,
  contentProps,
}: SearchbarProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger className={triggerClassName}>{trigger}</SheetTrigger>
      <SheetContent side="top" className={contentClassName} {...contentProps}>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default TopSheet;
