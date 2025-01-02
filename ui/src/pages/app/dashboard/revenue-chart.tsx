import { getDailyRevenueInPeriod } from "@/api/get-revenue-metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
} from "recharts";
import colors from "tailwindcss/colors";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProps } from "recharts";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, number>) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex gap-1 rounded-l border bg-card p-2 text-sm text-card-foreground shadow-sm">
        <span className="font-semibold">{label}</span>
        <span>-</span>
        <span>
          {payload[0].value?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
    );
  }

  return null;
};

export const RevenueChart = () => {
  const [dataRange, setDataRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { data } = useQuery({
    queryFn: () =>
      getDailyRevenueInPeriod({ from: dataRange?.from, to: dataRange?.to }),
    queryKey: ["metrics", "daily-revenue-in-period", dataRange],
  });

  const chartData = useMemo(() => {
    return data?.map((chartItem) => {
      return {
        date: chartItem.date,
        receipt: chartItem.receipt / 100,
      };
    });
  }, [data]);

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
        <DateRangePicker date={dataRange} onDateChange={setDataRange} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          {data ? (
            <LineChart data={chartData} style={{ fontSize: 12 }}>
              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value: number) => formatPrice(value)}
              />
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
              <CartesianGrid vertical={false} className="!stroke-muted" />
              <Line
                type="linear"
                strokeWidth={2}
                dataKey="receipt"
                stroke={colors.violet[500]}
              />
              <Tooltip cursor={false} content={<CustomTooltip />} />
            </LineChart>
          ) : (
            <Skeleton className="h-[240px] w-full" />
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
