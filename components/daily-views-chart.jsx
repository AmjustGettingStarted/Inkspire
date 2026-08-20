"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  views: {
    label: "Views",
    color: "#c084fc",
  },
};

const DailyViewsChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No view data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity={0.25} />
                <stop offset="50%" stopColor="#c084fc" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#c084fc" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#26242c"
              strokeOpacity={0.4}
            />

            {/* Use full date or index for exact tooltip mapping */}
            <XAxis
              dataKey="date" // Use unique string (e.g. "May 14" or "2024-05-14")
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#52525b", fontSize: 10 }}
              tickFormatter={(value) => {
                // Formats "2024-05-16" -> "Thu" or "16th" so X-axis looks clean
                if (!value) return "";
                const d = new Date(value);
                return isNaN(d.getTime())
                  ? value
                  : d.toLocaleDateString("en-US", { weekday: "short" });
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#52525b", fontSize: 10 }}
              allowDecimals={false}
            />

            <ChartTooltip
              cursor={{
                stroke: "#c084fc",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="bg-[#18171d] border-[#26242c] text-white rounded-xl shadow-xl px-3 py-2"
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-zinc-400">
                        {item.payload.date || item.payload.day}
                      </span>
                      <span className="font-bold text-[#a855f7]">
                        Views: {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />

            <Area
              dataKey="views"
              type="monotone"
              fill="url(#viewsGradient)"
              stroke="#c084fc"
              strokeWidth={2}
              isAnimationActive={true}
              activeDot={{
                r: 6,
                fill: "#c084fc",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DailyViewsChart;
