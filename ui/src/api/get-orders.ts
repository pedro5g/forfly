import { api } from "@/lib/axios";

export interface GetOrdersQuery {
  pageIndex?: number | null;
  orderId?: string | null;
  status?: string | null;
  customerName?: string | null;
}

export interface GetOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getOrders({
  pageIndex = 1,
  customerName,
  orderId,
  status,
}: GetOrdersQuery) {
  const res = await api.get<GetOrdersResponse>("/orders", {
    params: {
      pageIndex,
      orderId,
      customerName,
      status,
    },
  });

  return res.data;
}
