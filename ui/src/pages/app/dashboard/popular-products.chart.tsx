import { getPopularProducts } from "@/api/get-popular-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import colors from "tailwindcss/colors";
import { PopularProductsChartSkeleton } from "./popular-products-chart-skeleton";
import { TooltipProps } from "recharts";

const COLORS = [
  colors.sky["500"],
  colors.amber["500"],
  colors.violet["500"],
  colors.emerald["500"],
  colors.rose["500"],
];

export const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, number>) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <span className="text-base font-semibold">{payload[0].name}</span>
        <div className="flex flex-col gap-1">
          <span className="">
            <span className="font-semibold">Vendas:</span> {payload[0].value}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export const PopularProductsChart = () => {
  const { data } = useQuery({
    queryFn: getPopularProducts,
    queryKey: ["metrics", "popular-products"],
  });

  return (
    <Card className="col-span-3">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-base font-medium">
            Produtos populares
          </CardTitle>
          <BarChart className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {data ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart style={{ fontSize: 12 }}>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="product"
                cx="50%"
                cy="50%"
                outerRadius={86}
                innerRadius={64}
                strokeWidth={8}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 12 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {data.length > 12
                        ? data[index].product.substring(0, 12).concat("...")
                        : data[index].product}{" "}
                      ({value})
                    </text>
                  );
                }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-key-${index}`}
                    fill={COLORS[index]}
                    className="stroke-background hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip cursor={false} content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <PopularProductsChartSkeleton />
        )}
      </CardContent>
    </Card>
  );
};
