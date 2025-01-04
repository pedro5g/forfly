import { api } from "@/lib/axios";

export interface CreateNewProductBody {
  name: string;
  description?: string;
  price: number;
}

export async function createNewProduct({
  name,
  description,
  price,
}: CreateNewProductBody) {
  await api.post("/products", { name, description, price });
}
