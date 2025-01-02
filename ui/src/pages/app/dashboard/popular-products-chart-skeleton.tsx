import { Skeleton } from "@/components/ui/skeleton";

export const PopularProductsChartSkeleton = () => {
  return (
    <div className="flex h-[240px] w-full items-center justify-center">
      <Skeleton className="size-[200px] rounded-full" />
    </div>
  );
};
