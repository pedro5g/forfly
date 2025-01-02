import { getMonthRevenue } from "@/api/get-month-revenue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { MetricCardSkeleton } from "./metric-card-skeleton";
import { formatPrice } from "@/lib/utils";

export const MonthRevenueCard = () => {
  const { data } = useQuery({
    queryFn: getMonthRevenue,
    queryKey: ["metrics", "month-revenue"],
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Receita total (mês)
        </CardTitle>
        <DollarSign className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-2">
        {data ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {formatPrice(data.receipt / 100)}
            </span>
            <p className="text-xs text-muted-foreground">
              {data.diffFromLastMonth >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">
                    +{data.diffFromLastMonth}%
                  </span>{" "}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {data.diffFromLastMonth}%
                  </span>{" "}
                  em relação ao mês passado
                </>
              )}
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  );
};
