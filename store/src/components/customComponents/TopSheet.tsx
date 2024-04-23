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
  contentClassName?: string
}

const TopSheet = ({ 
  trigger,
  children,
  onOpenChange,
  open,
  contentClassName
} : SearchbarProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger>
        {trigger}
      </SheetTrigger>
      <SheetContent side="top" className={contentClassName}>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default TopSheet