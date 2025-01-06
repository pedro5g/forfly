import { api } from "@/lib/axios";

export interface CreateNewProductBody {
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

export async function createNewProduct({
  name,
  description,
  price,
  isAvailable,
}: CreateNewProductBody) {
  await api.post("/products", { name, description, price, isAvailable });
}
