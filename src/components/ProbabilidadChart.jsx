import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProbabilidadChart({ data }) {
  const parsedData = data.map((item, idx) => ({
    tiempo: new Date(item.tiempo).toLocaleTimeString().slice(3, 8),
    probabilidad: item.valor,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={parsedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tiempo" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Line type="monotone" dataKey="probabilidad" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
