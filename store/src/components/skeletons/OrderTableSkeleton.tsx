import { Skeleton } from "../ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrderListSkeleton = () => {
  return (
    <ul className="flex flex-col gap-5">
      <li className="flex items-center justify-between">
        <Skeleton className="h-3 w-16"/>
        <Skeleton className="h-3 w-[120px]"/>
      </li>
      <li className="flex items-center justify-between">
        <Skeleton className="h-3 w-20"/>
        <Skeleton className="h-3 w-20"/>
      </li>
      <li className="flex items-center justify-between">
        <Skeleton className="h-3 w-16"/>
        <Skeleton className="h-3 w-10"/>
      </li>
      <li className="flex items-center justify-between">
        <Skeleton className="h-3 w-[72px]"/>
        <Skeleton className="h-3 w-[100px]"/>
      </li>
    </ul>
  )
}

const OrderTableSkeleton = () => {
  return (
    <>
      {/* DESKTOP VERSION */}
      <div className="rounded-md hidden lg:block">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-full"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-[160px]"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-center">
                <Skeleton className="h-3 w-8"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-end">
                <Skeleton className="h-4 w-20"/>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-[140px]"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-center">
                <Skeleton className="h-3 w-8"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-end">
                <Skeleton className="h-4 w-20"/>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-[140px]"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-center">
                <Skeleton className="h-3 w-8"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-end">
                <Skeleton className="h-4 w-20"/>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-[150px]"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-center">
                <Skeleton className="h-3 w-8"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0">
                <Skeleton className="h-3 w-20"/>
              </TableCell>
              <TableCell className="border-none py-6 pl-0 flex justify-end">
                <Skeleton className="h-4 w-20"/>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* MOBILE VERSION */}
      <div className="lg:hidden mt-12">
        <div className="border-b pb-8 flex flex-col gap-y-5">
          <OrderListSkeleton />
          <Skeleton className="h-12.5 w-full"/>
        </div>
        <div className="border-b pb-8 flex flex-col gap-y-5 mt-8">
          <OrderListSkeleton />
          <Skeleton className="h-12.5 w-full"/>
        </div>
      </div>
    </>
  )
}

export default OrderTableSkeleton