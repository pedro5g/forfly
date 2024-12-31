import type { IBase } from "./i-base";

export type GetPopularProductsReturn = {
  product: string | null;
  amount: number;
};

export interface IProducts extends IBase {
  getPopularProducts(restaurantId: string): Promise<GetPopularProductsReturn[]>;
}
