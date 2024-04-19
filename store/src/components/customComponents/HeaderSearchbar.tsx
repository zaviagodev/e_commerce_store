import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { ReactNode } from "react"
import { Button } from "../ui/button";

type SearchbarProps = {
  children: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const HeaderSearchbar = ({ 
  children,
  onOpenChange,
  open
} : SearchbarProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="rounded-full flex justify-center hover:bg-transparent">
          <Search className="h-5 w-5"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="lg:px-64 py-0">
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default HeaderSearchbar