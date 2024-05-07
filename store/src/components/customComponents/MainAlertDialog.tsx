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
} from "@/components/ui/alert-dialog"
import { ReactNode } from "react"

type MainAlertDialogProps = {
  trigger: string | ReactNode
  title: string | ReactNode
  description: string | ReactNode
  cancel: string | ReactNode
  action: string | ReactNode
  onClickAction: () => void
  asChild?: boolean
  triggerClassName?: string
}

const MainAlertDialog = ({ trigger, title, description, cancel, action, onClickAction, asChild, triggerClassName } : MainAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild} className={triggerClassName}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[456px] p-8 !rounded-2xl">
        <AlertDialogHeader className="flex flex-col gap-y-2 items-center">
          <AlertDialogTitle className="text-2xl font-semibold text-center">{title}?</AlertDialogTitle>
          <AlertDialogDescription className="text-darkgray-500 text-base text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="main-btn bg-accent border-darkgray-100">{cancel}</AlertDialogCancel>
          <AlertDialogAction className="main-btn" onClick={onClickAction}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MainAlertDialog