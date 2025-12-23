import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts";

const multistackChart = () => {
  const barchartData = [
    // Low → rise
    { month: "Jan", a: 55, b: 40, c: 30, d: 22, e: 18, f: 14, g: 10 },

    // Peak
    { month: "Feb", a: 78, b: 58, c: 48, d: 38, e: 32, f: 22, g: 15 },

    // Dip
    { month: "Mar", a: 62, b: 46, c: 36, d: 28, e: 24, f: 18, g: 12 },

    // Higher peak
    { month: "Apr", a: 88, b: 66, c: 56, d: 46, e: 40, f: 30, g: 22 },

    // Dip again (W shape)
    { month: "May", a: 68, b: 52, c: 42, d: 34, e: 30, f: 22, g: 16 },

    // Final rise
    { month: "Jun", a: 82, b: 64, c: 54, d: 44, e: 38, f: 28, g: 20 },

    // Soft drop (natural ending)
    { month: "Jul", a: 72, b: 56, c: 46, d: 38, e: 32, f: 24, g: 18 },
  ];

  const GRADIENTS = [
    { key: "a", from: "#4FACFE", to: "#00F2FE" }, // Blue 200 → 300
    { key: "b", from: "#11998E", to: "#38EF7D" }, // Emerald 200 → 300
    { key: "c", from: "#FF8008", to: "#FFC837" }, // Amber 200 → 300
    { key: "d", from: "#8E2DE2", to: "#4A00E0" }, // Violet 200 → 300
    { key: "e", from: "#FF416C", to: "#FF4B2B" }, // Rose 200 → 300
    { key: "f", from: "#56AB2F", to: "#A8E063" }, // Teal 200 → 300
    { key: "g", from: "#36D1DC", to: "#5B86E5" }, // Orange 200 → 300
  ];

  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <BarChart
        data={barchartData}
        // margin={{ top: 30, right: 20, left: 0, bottom: 10 }}
        barGap={4}
      >
        <defs>
          {GRADIENTS.map((g) => (
            <linearGradient
              key={g.key}
              id={`grad-${g.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid
          strokeDasharray="4 6"
          stroke="rgba(0,0,0,0.8)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        {/* <YAxis
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          /> */}

        {/* <Tooltip
                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                            contentStyle={{
                              borderRadius: 12,
                              border: "none",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                              fontSize: 13,
                            }}
                          /> */}

        {/* <Legend iconType="circle" /> */}

        {/* {GRADIENTS.map((g, index) => (
                            <Bar
                              key={g.key}
                              dataKey={g.key}
                              stackId="total"
                              fill={`url(#grad-${g.key})`}
                              radius={
                                index === GRADIENTS.length - 1
                                  ? [10, 10, 0, 0]
                                  : [0, 0, 0, 0]
                              }
                            />
                          ))} */}

        {GRADIENTS.map((g, index) => (
          <Bar
            key={g.key}
            dataKey={g.key}
            stackId="total"
            fill={`url(#grad-${g.key})`}
            radius={
              index === GRADIENTS.length - 1 ? [10, 10, 0, 0] : [0, 0, 0, 0]
            }
          >
            <LabelList
              dataKey={g.key}
              position="center"
              fill="#ffffff"
              fontSize={11}
              fontWeight={600}
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default multistackChart;
