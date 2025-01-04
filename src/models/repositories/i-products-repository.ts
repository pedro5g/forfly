import type { IBase } from "./i-base";

export type ProductType = {
  id: string;
  name: string;
  priceInCents: number;
  restaurantId: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
export type GetPopularProductsReturn = {
  product: string | null;
  amount: number;
};

export type CreateProductParams = {
  id?: string | undefined;
  description?: string | undefined;
  name: string;
  price: number;
};

export type UpdateMenuParams = {
  restaurantId: string;
  deletedProductIds: string[];
  newOrUpdatedProducts: CreateProductParams[];
};

export type ListProductsParams = {
  restaurantId: string;
  productName?: string;
  pageIndex: number;
};
export type ListProductsReturn = {
  products: ProductType[];
  totalCount: number;
};

export interface IProducts extends IBase {
  getPopularProducts(restaurantId: string): Promise<GetPopularProductsReturn[]>;
  createProduct(
    data: CreateProductParams & { restaurantId: string }
  ): Promise<{ id: string }>;
  updateMenu(data: UpdateMenuParams): Promise<{ id: string }[] | void>;
  listProducts(data: ListProductsParams): Promise<ListProductsReturn>;
}
