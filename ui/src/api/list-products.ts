import { api } from "@/lib/axios";

export interface ListProductsResponse {
  id: string | null;
  name: string;
  description: string | null;
  priceInCents: number;
  available: boolean;
  createdAt: Date;
}

export async function listProducts() {
  const res = await api.get<ListProductsResponse[]>("/products/all");

  return res.data;
}
