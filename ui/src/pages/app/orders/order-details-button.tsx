import { getOrderDetails } from "@/api/get-order-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { OrderStatus } from "./order-status";

import { formatDateToNow, formatPrice } from "@/lib/utils";
import { useState } from "react";
import { OrderDetailsSkeleton } from "./order-details-skeleton";

interface OrderDetailsButtonProps {
  orderId: string;
}

export const OrderDetailsButton = ({ orderId }: OrderDetailsButtonProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: order } = useQuery({
    queryFn: () => getOrderDetails({ orderId }),
    queryKey: ["order", orderId],
    enabled: isDetailsOpen,
  });

  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <Search className="size-3" />
          <span className="sr-only">Detalhes do pedido</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {order ? (
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Pedido: {order.id}</DialogTitle>
              <DialogDescription>Detalhes do pedido</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Status
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <OrderStatus status={order.status} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Cliente
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Telefone
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.phone ?? "Não informado"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Email
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.email}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Realizado há
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {formatDateToNow(order.createdAt)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order &&
                    order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {formatPrice(item.priceInCents / 100)}
                        </TableCell>
                        <TableCell>
                          {formatPrice(
                            (item.priceInCents / 100) * item.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total do pedido</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(order.totalInCents / 100)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </DialogHeader>
        ) : (
          <OrderDetailsSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
};
