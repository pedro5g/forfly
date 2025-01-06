import { api } from "@/lib/axios";

export interface GetProductQuery {
  pageIndex?: number | null;
  productName?: string | null;
}

export interface GetProductsResponse {
  products: {
    id: string;
    name: string;
    description: string | null;
    priceInCents: number;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getProducts({
  pageIndex = 1,
  productName,
}: GetProductQuery) {
  const res = await api.get<GetProductsResponse>("/products", {
    params: {
      pageIndex,
      productName,
    },
  });

  return res.data;
}
