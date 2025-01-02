import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, X } from "lucide-react";
import { OrderDetailsButton } from "./order-details-button";
import { OrderStatus } from "./order-status";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/cancel-order";
import { GetOrdersResponse } from "@/api/get-orders";
import { approveOrder } from "@/api/approve-order";
import { dispatchOrder } from "@/api/dispatch-order";
import { deliverOrder } from "@/api/deliver-order";
import { formatDateToNow, formatPrice } from "@/lib/utils";

export type StatusType =
  | "pending"
  | "canceled"
  | "processing"
  | "delivering"
  | "delivered";

export interface OrderTableRowProps {
  orderId: string;
  createdAt: string;
  status: StatusType;
  customerName: string;
  total: number;
}

export const OrderTableRow = ({
  orderId,
  createdAt,
  status,
  customerName,
  total,
}: OrderTableRowProps) => {
  const queryClient = useQueryClient();

  function updateOrderStatusCache(orderId: string, status: StatusType) {
    const cached = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ["orders"],
    });

    cached.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return;

      queryClient.setQueryData(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return { ...order, status };
          }

          return order;
        }),
      });
    });
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      onSuccess(_, { orderId }) {
        updateOrderStatusCache(orderId, "canceled");
      },
    });

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      onSuccess: (_, { orderId }) => {
        updateOrderStatusCache(orderId, "processing");
      },
    });

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess(_, { orderId }) {
        updateOrderStatusCache(orderId, "delivering");
      },
    });

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      onSuccess(_, { orderId }) {
        updateOrderStatusCache(orderId, "delivered");
      },
    });

  return (
    <TableRow>
      <TableCell>
        <OrderDetailsButton orderId={orderId} />
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">{orderId}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDateToNow(createdAt)}
      </TableCell>
      <TableCell>
        <OrderStatus status={status} />
      </TableCell>
      <TableCell className="font-medium">{customerName}</TableCell>
      <TableCell className="font-medium">{formatPrice(total)}</TableCell>
      <TableCell>
        {status === "pending" && (
          <Button
            onClick={() => approveOrderFn({ orderId })}
            disabled={isApprovingOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 size-3" />
            Aceitar
          </Button>
        )}
        {status === "processing" && (
          <Button
            variant="outline"
            disabled={isDispatchingOrder}
            size="xs"
            onClick={() => dispatchOrderFn({ orderId })}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Entregar
          </Button>
        )}

        {status === "delivering" && (
          <Button
            variant="outline"
            disabled={isDeliveringOrder}
            size="xs"
            onClick={() => deliverOrderFn({ orderId })}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Entregue
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          onClick={() => cancelOrderFn({ orderId })}
          disabled={
            !["pending", "processing"].includes(status) || isCancelingOrder
          }
          variant="ghost"
          size="xs"
        >
          <X className="mr-2 size-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  );
};
