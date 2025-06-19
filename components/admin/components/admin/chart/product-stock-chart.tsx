"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductStockChartProps } from "@/types/admin/admin-dashboard";

const chartConfig = {
  value: {
    label: "Count",
  },
  "in-stock": {
    label: "In Stock",
    color: "hsl(var(--chart-1))",
  },
  "out-of-stock": {
    label: "Out of Stock",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ProductStockChart = ({ data }: ProductStockChartProps) => {
  const totalStock = data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Product Stock Overview</CardTitle>
        <CardDescription>Total products: {totalStock}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="name" />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              className="[--color-in-stock:hsl(var(--chart-1))] [--color-out-of-stock:hsl(var(--chart-2))]"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductStockChart;
