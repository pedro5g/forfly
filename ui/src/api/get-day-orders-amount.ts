import { api } from "@/lib/axios";

export interface GetDayOrdersAmountResponse {
  amount: number;
  diffFromYesterday: number;
}

export async function getDayOrdersAmount() {
  const res = await api.get<GetDayOrdersAmountResponse>(
    `/metrics/day-orders-amount`,
  );

  return res.data;
}
