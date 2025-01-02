import { api } from "@/lib/axios";

export type GetPopularProductsResponse = {
  product: string;
  amount: number;
}[];

export async function getPopularProducts() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response = await api.get<GetPopularProductsResponse>(
    "/metrics/popular-products",
  );

  return response.data;
}
