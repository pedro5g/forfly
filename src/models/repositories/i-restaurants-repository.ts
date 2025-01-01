import type { IBase } from "./i-base";

export type RestaurantType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  managerId: string | null;
};

export type RegisterRestaurantParams = {
  restaurantName: string;
  managerId: string;
};

export interface IRestaurantsRepository extends IBase {
  insert(data: RegisterRestaurantParams): Promise<{ id: string }>;
  getRestaurantById(restaurantId: string): Promise<RestaurantType | null>;
  getRestaurantByManagerId(managerId: string): Promise<RestaurantType | null>;
}
