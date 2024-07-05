import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react"

type SearchbarProps = {
  trigger: string | ReactNode
  children: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  triggerClassName?: string
  contentClassName?: string
}

const TopSheet = ({ 
  trigger,
  children,
  onOpenChange,
  open,
  triggerClassName,
  contentClassName
} : SearchbarProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger className={triggerClassName}>
        {trigger}
      </SheetTrigger>
      <SheetContent side="top" className={contentClassName}>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default TopSheet