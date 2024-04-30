import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BaseRecord, useTable, useTranslate } from "@refinedev/core";
import usePagenation from "@/hooks/usePagenation";
import { Link } from "react-router-dom";
import { File06 } from "@untitled-ui/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Order = {
  status: "To Deliver and Bill" | "processing" | "completed" | "failed";
};

export function OrderHistoryTable({
  status,
}: {
  status?: Order["status"] | undefined;
}) {
  const t = useTranslate();

  const columns: ColumnDef<BaseRecord>[] = [
    {
      accessorKey: "name",
      header: t("Order Number"),
      align: "left",
      cell: ({ row }: any) => <div className="capitalize">{row["name"]}</div>,
    },
    {
      accessorKey: "creation",
      header: t("Date"),
      align: "center",
      cell: ({ row }: any) => <div className="capitalize">{row["creation"]}</div>,
    },
    {
      accessorKey: "total_qty",
      header: t("Number of Items"),
      align: "center",
      cell: ({ row }: any) => (
        <div className="capitalize">{row["total_qty"]}</div>
      ),
    },
    {
      accessorKey: "grand_total",
      header: t("Grand Total"),
      align: "right",
      cell: ({ row }: any) => (
        <div className="capitalize">฿ {row["grand_total"].toFixed(2)}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      align: "right",
      cell: ({ row }: any) => {
        return (
          <Link to={`/account/orders/${row.name}`} className="text-base lg:text-sm flex items-center gap-x-0.5 text-black w-full h-12.5 lg:h-fit lg:w-fit justify-center lg:justify-end">
            <File06 className="h-4 w-4" />
            {t("Details")}
          </Link>
        );
      },
    },
  ];

  const {
    tableQueryResult: { data: tableData, isFetching, isLoading, isRefetching },
    current,
    setCurrent,
    pageCount,
  } = useTable({
    pagination: {
      pageSize: 10,
    },
    filters: {
      permanent: [
        {
          field: "filters.status",
          operator: "eq",
          value: status,
        },
      ],
    },
  });

  const { nextPage, getCanNextPage, getCanPreviousPage, previousPage } =
    usePagenation({ current, setCurrent, pageCount });

  if (isFetching || isLoading || isRefetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {(tableData?.data?.length as number) > 0 ? (
        <div className="w-full">

          {/* DESKTOP VERSION: orders table */}
          <div className="rounded-md hidden lg:block">
            <Table className="border-none">
              <TableHeader>
                {
                  <TableRow className="hover:bg-transparent">
                    {columns.map((column) => (
                      <TableCell key={column.id} className="border-none py-6 font-semibold pl-0" style={{textAlign: column.align}}>
                        <span>{column?.header ?? ("" as any)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                }
              </TableHeader>
              <TableBody>
                {tableData?.data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-transparent">
                    {columns.map((column) => (
                      <TableCell key={column.id} className="border-none py-6 text-darkgray-500 pl-0" style={{textAlign: column.align}}>{column?.cell({ row })}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
    
          {/* MOBILE VERSION: orders list */}
          <div className="lg:hidden mt-12">
            {tableData?.data.map((row) => (
              <ul className="flex flex-col gap-3 mt-8 border-b pb-8" key={row.id}>
                {columns.map((column) => (
                  <li className={`flex items-center ${column.id !== "actions" ? "justify-between" : ""}`} key={column.id}>
                    <span className="text-sm text-darkgray-200">
                      {column.header}
                    </span>
                    <span className={`text-sm font-semibold ${column.id !== "actions" ? "" : "w-full bg-accent justify-center items-center p-0 rounded-xl border border-darkgray-100 lg:border-none"}`}>{column?.cell({ row })}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
    
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {t("Showing")} {current} {t("of")} {pageCount} {t("pages")}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={!getCanPreviousPage()}
              >
                {t("Previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!getCanNextPage()}
              >
                {t("Next")}
              </Button>
            </div>
          </div>
        </div>
      ) : (<p className="mt-12 lg:m-0 text-darkgray-500 text-sm">คุณยังไม่มีคำสั่งซื้อ</p>)}
    </>
  );
}

const OrderList = () => {
  const t = useTranslate();
  const labelStatusMap = {
    [t("All orders")]: undefined,
    [t("Payment Pending")]: "To Deliver and Bill",
    [t("Delivery Pending")]: "To Deliver",
    [t("Payment Pending")]: "To Bill",
    [t("Delivered")]: "Completed",
    [t("Cancelled")]: "Cancelled",
  };

  const [mobileStatus, setMobileStatus] = useState(labelStatusMap[t("All orders")])

  return (
    <div>
      <div className="grid grid-cols-2 items-center">
        <h1 className="font-semibold text-darkgray-500 text-lg">{t("Orders")}</h1>

        {/* The dropdown select will be shown on the mobile version */}
        <div className="lg:hidden">
          <Select onValueChange={setMobileStatus}>
            <SelectTrigger className="bg-accent border-none rounded-xl focus:outline-none focus:ring-offset-0 focus:ring-0">
              <SelectValue placeholder={t("All orders")} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(labelStatusMap).map((label) => (
                <SelectItem value={label}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DESKTOP VERSION */}
      <Tabs defaultValue={t("All orders")} className="mt-6 hidden lg:block">
        <TabsList className="flex justify-between bg-transparent">
          {Object.keys(labelStatusMap).map((label) => (
            <TabsTrigger key={label} value={label} className="w-full p-3 !shadow-none text-darkgray-500 rounded-none transition-none border-b data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-semibold">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(labelStatusMap).map((label) => (
          <TabsContent key={label} value={label} className="mt-10">
            <OrderHistoryTable
              status={labelStatusMap[label] as Order["status"] | undefined}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* MOBILE VERSION */}
      <div className="lg:hidden">
        <OrderHistoryTable status={labelStatusMap[mobileStatus as string] as Order["status"] | undefined}/>
      </div>
    </div>
  );
};

export default OrderList;
