import { api } from "@/lib/axios";

export interface CancelOrderMutation {
  orderId: string;
}

export async function cancelOrder({ orderId }: CancelOrderMutation) {
  await api.patch(`/orders/${orderId}/cancel`);
}
