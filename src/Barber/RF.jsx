// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { name: "Jan", uv: 400 },
//   { name: "Feb", uv: 300 },
//   { name: "Mar", uv: 100 },
//   { name: "Apr", uv: 800 },
//   { name: "May", uv: 500 },
//   { name: "Jun", uv: 900 },
//   { name: "Jul", uv: 400 },
//   { name: "Aug", uv: 700 },
// ];

// const RF = () => {
//   return (
//     <div style={{ width: "100%", maxWidth: "600px", border: "1px solid #ccc" }}>
//       {/* Scrollable Wrapper */}
//       <div style={{ overflowX: "auto", display: "flex" }}>
//         {/* Fixed Y-Axis "Fake" Chart */}
//         <div
//           style={{
//             position: "sticky",
//             left: 0,
//             backgroundColor: "white",
//             zIndex: 1,
//           }}
//         >
//           <LineChart
//             width={50}
//             height={300}
//             data={data}
//             margin={{ right: 0, left: 0 }}
//           >
//             <YAxis dataKey="uv" axisLine={false} tickLine={false} />
//             {/* We hide everything but the YAxis here */}
//             <defs>
//               <linearGradient id="hide">
//                 <stop stopColor="transparent" />
//               </linearGradient>
//             </defs>
//           </LineChart>
//         </div>

//         {/* Main Scrollable Chart Area */}
//         <div style={{ minWidth: "800px" }}>
//           <LineChart
//             width={800}
//             height={300}
//             data={data}
//             margin={{ left: -30 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             {/* Hide the actual YAxis ticks but keep the space if needed,
//                 or just remove YAxis here since we have the sticky one */}
//             <YAxis hide />
//             <Tooltip />
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//           </LineChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RF;

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

// const data = [
//   { 1: 0, xaxis: "28 Jan (Wed)" },
//   { 1: 0, xaxis: "29 Jan (Thu)" },
//   { 1: 365, xaxis: "30 Jan (Fri)" },
//   { 1: 1095, xaxis: "31 Jan (Sat)" },
//   { 1: 0, xaxis: "01 Feb (Sun)" },
//   { 1: 0, xaxis: "02 Feb (Mon)" },
//   { 1: 0, xaxis: "03 Feb (Tue)" },
// ];

// const RF = () => {
//   return (
//     <div
//       style={{
//         width: "100%",
//         border: "1px solid #e0e0e0",
//         borderRadius: "8px",
//       }}
//     >
//       <div style={{ display: "flex", overflowX: "auto", position: "relative" }}>
//         {/* STICKY Y-AXIS CONTAINER */}
//         <div
//           style={{
//             position: "sticky",
//             left: 0,
//             zIndex: 10,
//             backgroundColor: "#fff",
//             paddingRight: "5px",
//             borderRight: "1px solid #f0f0f0",
//           }}
//         >
//           <LineChart
//             width={60}
//             height={300}
//             data={data}
//             margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
//           >
//             {/* The YAxis must have the same domain as the main chart */}
//             <YAxis dataKey="1" tick={{ fontSize: 12 }} />
//             {/* Hidden elements to ensure scaling matches perfectly */}
//             <XAxis dataKey="xaxis" hide />
//           </LineChart>
//         </div>

//         {/* SCROLLABLE CONTENT */}
//         <div style={{ minWidth: "1200px" }}>
//           {" "}
//           {/* Adjust minWidth to control scroll speed */}
//           <LineChart
//             width={1200}
//             height={300}
//             data={data}
//             margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis
//               dataKey="xaxis"
//               tick={{ fontSize: 12 }}
//               interval={0} // Ensures all dates show up
//             />
//             {/* Hide the YAxis here because the sticky one covers it */}
//             <YAxis hide dataKey="1" />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="1"
//               stroke="#8884d8"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//             />
//           </LineChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RF;

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const apiResponse = {
  success: true,
  message: "Line graph reports success",
  response: {
    data: [
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Mar 2025",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Apr 2025",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "May 2025",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Jun 2025",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Jul 2025",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Aug 2025",
      },
      {
        1: 120,
        2: 238,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Sep 2025",
      },
      {
        1: 1374,
        2: 38,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Oct 2025",
      },
      {
        1: 7960,
        2: 655,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Nov 2025",
      },
      {
        1: 16350,
        2: 1825,
        3: 2150,
        87: 690,
        142: 1055,
        159: 1400,
        166: 1055,
        177: 365,
        xaxis: "Dec 2025",
      },
      {
        1: 6450,
        2: 1400,
        3: 690,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Jan 2026",
      },
      {
        1: 0,
        2: 0,
        3: 0,
        87: 0,
        142: 0,
        159: 0,
        166: 0,
        177: 0,
        xaxis: "Feb 2026",
      },
    ],
    barbers: [
      {
        key: "1",
        name: "John Doe ",
        color: "#DF2020",
      },
      {
        key: "2",
        name: "Bob",
        color: "#20DF58",
      },
      {
        key: "87",
        name: "vivob",
        color: "#8F20DF",
      },
      {
        key: "142",
        name: "watson",
        color: "#DFC720",
      },
      {
        key: "159",
        name: "ertyuiolkjhgfds",
        color: "#20BFDF",
      },
      {
        key: "3",
        name: "Jazz",
        color: "#DF2087",
      },
      {
        key: "166",
        name: "sun",
        color: "#50DF20",
      },
      {
        key: "177",
        name: "Rupesh",
        color: "#2820DF",
      },
    ],
  },
};

const RF = () => {
  const chartData = apiResponse.response.data;
  const barbers = apiResponse.response.barbers;

  const barberKeys = barbers.map((b) => b.key);

  // 2. Find the absolute maximum value in the entire dataset to scale the Y-Axis
  const maxValue = Math.max(
    ...chartData.flatMap((entry) =>
      barberKeys.map((key) => Number(entry[key]) || 0),
    ),
    10, // Default minimum height of 10
  );

  // Buffer the max value by 10% so the lines don't touch the very top
  const yDomain = [0, Math.ceil(maxValue * 1.1)];

  console.log(yDomain);

  return (
    <div style={{ width: "100%", border: "1px solid #ddd", marginTop: "20px" }}>
      <div style={{ display: "flex", overflowX: "auto", position: "relative" }}>
        {/* 1. STICKY Y-AXIS (This stays fixed on the left) */}
        <div
          style={{
            position: "sticky",
            left: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          }}
        >
          <LineChart
            width={60}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
          >
            {/* Explicitly using a dataKey here is vital for the axis to show up */}
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <XAxis dataKey="xaxis" hide />
          </LineChart>
        </div>

        {/* 2. SCROLLABLE CHART (The actual graph) */}
        <div style={{ minWidth: "1200px" }}>
          <LineChart
            width={1200}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="xaxis" tick={{ fontSize: 12 }} interval={0} />
            {/* We hide the YAxis here, but it must be present for scaling consistency */}
            <YAxis hide domain={["auto", "auto"]} />

            <Tooltip />
            {/* <Legend verticalAlign="top" height={40} /> */}

            {/* Dynamic Lines based on your barbers array */}
            {barbers.map((barber) => (
              <Line
                key={barber.key}
                name={barber.name}
                dataKey={barber.key} // Matches "1", "2", "87", etc.
                stroke={barber.color}
                type="monotone"
                dot={{ r: 4 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default RF;
