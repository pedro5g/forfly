import { api } from "@/lib/axios";

export interface UpdateRestaurantProfileBody {
  name: string;
  description: string | null;
}

export async function updateRestaurantProfile({
  name,
  description,
}: UpdateRestaurantProfileBody) {
  await api.put("/profile", { name, description });
}
