import React from "react";
import { Link } from "react-router-dom";
import { FiEye } from "react-icons/fi";

function SesionRow({ sesion }) {
  // Agrupar eventos por tipo
  const eventosResumen = sesion.eventos?.reduce((acc, ev) => {
    acc[ev.tipo] = (acc[ev.tipo] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <tr>
      {/* Fecha de inicio */}
      <td className="border p-2">
        {new Date(sesion.fechaInicio).toLocaleString()}
      </td>

      {/* Duración en minutos */}
      <td className="border p-2 text-right">
        {typeof sesion.duracion === "number" && sesion.duracion > 0
          ? `${Math.round(sesion.duracion / 60)} min`
          : "—"}
      </td>

      {/* Nivel máximo de somnolencia */}
      <td className="border p-2 text-right">
        {typeof sesion.nivelMax === "number" && sesion.nivelMax > 0
          ? `${sesion.nivelMax}%`
          : "—"}
      </td>

      {/* Eventos agrupados por tipo */}
      <td className="border p-2 text-left">
        {Object.keys(eventosResumen).length > 0 ? (
          Object.entries(eventosResumen).map(([tipo, cantidad]) => (
            <div key={tipo}>
              {tipo}: {cantidad}
            </div>
          ))
        ) : (
          "—"
        )}
      </td>

      {/* Link a detalle */}
      <td className="border p-2 text-center">
        <Link
            to={`/registros/${sesion.id}`}
            className="inline-flex items-center gap-2 bg-white border border-blue-300 text-blue-800 px-4 py-1 rounded-md shadow-sm hover:bg-blue-100 transition-all duration-200"
            >
            <FiEye className="text-blue-600" />
            <span className="font-medium">Ver detalles</span>
        </Link>
        </td>
    </tr>
  );
}

export default SesionRow;
