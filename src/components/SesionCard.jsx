import React from "react";
import { Link } from "react-router-dom";

function SesionCard({ sesion }) {
  const fecha = new Date(sesion.fechaInicio).toLocaleString();
  const duracion = typeof sesion.duracion === "number"
    ? `${Math.round(sesion.duracion / 60)} min`
    : "—";

  const probMax = typeof sesion.nivelMax === "number"
    ? `${sesion.nivelMax}%`
    : "—";

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-lg font-semibold mb-1">🕒 {fecha}</h2>
      <p>⏱️ <strong>Duración:</strong> {duracion}</p>
      <p>📈 <strong>Prob. máxima:</strong> {probMax}</p>
      <p>📋 <strong>Eventos:</strong> {sesion.eventos?.length ?? 0}</p>
      <Link
        to={`/registros/${sesion.id}`}
        className="text-blue-600 underline inline-block mt-2"
      >
        Ver detalles
      </Link>
    </div>
  );
}

export default SesionCard;
