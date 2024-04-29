import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

export type Order = {
  status: "To Deliver and Bill" | "processing" | "completed" | "failed";
};

export const columns: ColumnDef<BaseRecord>[] = [
  {
    accessorKey: "name",
    header: "Order Number",
    cell: ({ row }: any) => <div className="capitalize">{row["name"]}</div>,
  },
  {
    accessorKey: "creation",
    header: "Date",
    cell: ({ row }: any) => <div className="capitalize">{row["creation"]}</div>,
  },
  {
    accessorKey: "total_qty",
    header: "Number of Items",
    cell: ({ row }: any) => (
      <div className="capitalize">{row["total_qty"]}</div>
    ),
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }: any) => (
      <div className="capitalize">{row["grand_total"]}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      return (
        <Link to={`/account/orders/${row.name}`} className="text-primary">
          Details
        </Link>
      );
    },
  },
];

export function OrderHistoryTable({
  status,
}: {
  status?: Order["status"] | undefined;
}) {
  const t = useTranslate();
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
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <div className="flex items-center justify-between">
                      <span>{column?.header ?? ("" as any)}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            }
          </TableHeader>
          <TableBody>
            {tableData?.data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column?.cell({ row })}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
  );
}

const OrderList = () => {
  const t = useTranslate();
  const labelStatusMap = {
    [t("All")]: undefined,
    [t("Payment Pending")]: "To Deliver and Bill",
    [t("Delivery Pending")]: "To Deliver",
    [t("Payment Pending")]: "To Bill",
    [t("Delivered")]: "Completed",
    [t("Cancelled")]: "Cancelled",
  };
  return (
    <div>
      <h1 className="font-semibold text-darkgray-500 text-lg">{t("Order History")}</h1>
      <Tabs defaultValue={t("All")} className="mt-6">
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
    </div>
  );
};

export default OrderList;
