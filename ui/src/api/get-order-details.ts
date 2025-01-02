import { api } from "@/lib/axios";

export interface GetOrderQuery {
  orderId: string;
}

export interface GetOrderDetailsResponse {
  status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
  id: string;
  createdAt: string;
  totalInCents: number;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  orderItems: {
    id: string;
    priceInCents: number;
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export async function getOrderDetails({ orderId }: GetOrderQuery) {
  const res = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`);

  return res.data;
}
