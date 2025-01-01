import { restaurants } from "../db/schemas";
import { Base } from "./base";
import type {
  IRestaurantsRepository,
  RegisterRestaurantParams,
  RestaurantType,
} from "./repositories/i-restaurants-repository";

export class Restaurant extends Base implements IRestaurantsRepository {
  async insert(data: RegisterRestaurantParams): Promise<{ id: string }> {
    const [restaurant] = await this.db
      .insert(restaurants)
      .values({
        name: data.restaurantName,
        managerId: data.managerId,
      })
      .returning({ id: restaurants.id });

    return restaurant;
  }

  async getRestaurantById(
    restaurantId: string
  ): Promise<RestaurantType | null> {
    const restaurant = await this.db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId);
      },
    });

    return restaurant ?? null;
  }

  async getRestaurantByManagerId(
    managerId: string
  ): Promise<RestaurantType | null> {
    const restaurant = await this.db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, managerId);
      },
    });

    return restaurant ?? null;
  }
}
