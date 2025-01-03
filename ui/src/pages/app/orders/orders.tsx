import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Helmet } from "react-helmet-async";
import { OrderTableRow } from "./order-table-row";
import { OrderTableFilters } from "./order-table-filters";
import { Pagination } from "./pagination";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/api/get-orders";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { OrderTableSkeleton } from "./order-table-skeleton";

export function Orders() {
  const [searchParmas, setSearchParams] = useSearchParams();

  const orderId = searchParmas.get("orderId");
  const customerName = searchParmas.get("customerName");
  const status = searchParmas.get("status");

  const pageIndex = z.coerce.number().parse(searchParmas.get("page") ?? "1");

  const { data: result, isLoading } = useQuery({
    queryFn: () =>
      getOrders({
        pageIndex,
        customerName,
        orderId,
        status: status === "all" ? null : status,
      }),
    queryKey: ["orders", pageIndex, orderId, customerName, status],
  });

  const handlePagination = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set("page", pageIndex.toString());
      return prev;
    });
  };

  return (
    <>
      <Helmet title="pedidos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <div className="space-y-2.5">
          <OrderTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <OrderTableSkeleton />}
                {result &&
                  result.orders.map((order) => (
                    <OrderTableRow key={order.orderId} {...order} />
                  ))}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              onPageChange={handlePagination}
              pageIndex={result.meta.pageIndex}
              perPage={result.meta.perPage}
              totalCount={result.meta.totalCount}
            />
          )}
        </div>
      </div>
    </>
  );
}
