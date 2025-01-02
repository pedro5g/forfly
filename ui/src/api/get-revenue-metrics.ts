import { api } from "@/lib/axios";
import { wait } from "@/lib/utils";

export interface GetDailyRevenueInPeriodQuery {
  from?: Date;
  to?: Date;
}

export type GetDailyRevenueInPeriodResponse = {
  date: string;
  receipt: number;
}[];

export async function getDailyRevenueInPeriod({
  from,
  to,
}: GetDailyRevenueInPeriodQuery) {
  await wait();
  const response = await api.get<GetDailyRevenueInPeriodResponse>(
    "/metrics/daily-receipt-in-period",
    {
      params: {
        from,
        to,
      },
    },
  );

  return response.data;
}
