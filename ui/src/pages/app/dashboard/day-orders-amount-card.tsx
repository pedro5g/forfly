import { getDayOrdersAmount } from "@/api/get-day-orders-amount";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";
import { MetricCardSkeleton } from "./metric-card-skeleton";

export const DayOrdersAmountCard = () => {
  const { data } = useQuery({
    queryFn: getDayOrdersAmount,
    queryKey: ["metrics", "day-orders-amount"],
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (dia)</CardTitle>
        <Utensils className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-2">
        {data ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {data.amount.toLocaleString("pt-BR")}
            </span>
            <p className="text-xs text-muted-foreground">
              {data.diffFromYesterday >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">
                    +{data.diffFromYesterday}%
                  </span>{" "}
                  em relação a ontem
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {data.diffFromYesterday}%
                  </span>{" "}
                  em relação a ontem
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <MetricCardSkeleton />
          </>
        )}
      </CardContent>
    </Card>
  );
};
