import React from "react";
import { Area, AreaChart } from "recharts";
import { formatAccountingNumber } from "@/lib/helpers";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent } from "../ui/card";

type Props = {
  title: string;
  value: string;
  comparison?: {
    value: string;
    isUp: boolean;
    label: string;
  };
  icon?: React.ReactNode;
  bottomChartData?: { label: string; value: number }[];
  className?: string;
};

export function DatumCard({ title, value, comparison, icon, bottomChartData, className }: Props) {
  return (
    <Card className={className}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold mb-4">{title}</h2>
            <p className="text-2xl leading-none tracking-tight font-semibold mb-2">{value}</p>
          </div>
          {icon && <div>{icon}</div>}
        </div>
        {bottomChartData && bottomChartData.length > 0 && (
          <div className="h-12 w-full mt-4">
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: comparison?.isUp ? "var(--color-success)" : "var(--color-primary)",
                },
              }}
              className="h-full w-full"
            >
              <AreaChart data={bottomChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={comparison?.isUp ? "var(--color-success)" : "var(--color-primary)"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={comparison?.isUp ? "var(--color-success)" : "var(--color-primary)"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={comparison?.isUp ? "var(--color-success)" : "var(--color-primary)"}
                  fillOpacity={1}
                  fill="url(#fillValue)"
                  strokeWidth={2}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      hideIndicator
                      className="min-w-0"
                      formatter={(value, name, item, index, payload) => (
                        <div className="flex flex-1 justify-between leading-none items-center gap-2">
                          <span className="text-foreground font-bold">{item.payload.label}:</span>
                          <span className="text-foreground font-mono font-medium tracking-tight">
                            {formatAccountingNumber(value as number)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
