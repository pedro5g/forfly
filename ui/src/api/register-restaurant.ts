import { api } from "@/lib/axios";

export interface RegisterRestaurantBody {
  email: string;
  restaurantName: string;
  managerName: string;
  phone: string;
}

export async function registerRestaurant({
  email,
  restaurantName,
  managerName,
  phone,
}: RegisterRestaurantBody) {
  await api.post("/restaurants", { email, restaurantName, managerName, phone });
}
