import React from "react";
import SesionRow from "./SesionRow";

function SesionTable({ sesiones }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full table-auto border border-blue-200 text-sm text-slate-800">
        <thead className="bg-blue-200 text-blue-900 uppercase text-xs font-bold tracking-wider">
          <tr>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-right">Duración</th>
            <th className="border px-4 py-2 text-right">Prob. Máxima</th>
            <th className="border px-4 py-2 text-left">Eventos</th>
            <th className="border px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100 bg-white">
          {sesiones.map((s) => (
            <SesionRow key={s.id} sesion={s} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SesionTable;
