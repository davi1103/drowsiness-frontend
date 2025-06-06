import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function ProbabilidadChartDetalle({ eventos }) {
  const data = eventos
    .filter((e) => typeof e.probabilidad === "number")
    .map((e) => ({
      tiempo: new Date(e.timestamp).toLocaleTimeString([], {
        minute: "2-digit",
        second: "2-digit",
      }),
      probabilidad: e.probabilidad,
    }));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">
        Evolución de la probabilidad durante la sesión
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tiempo" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Line
            type="monotone"
            dataKey="probabilidad"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
