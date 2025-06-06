import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSesionPorId } from "../shared/api";
import { FaEye, FaMeh, FaBed } from "react-icons/fa";
import ProbabilidadChartDetalle from "../components/ProbabilidadChartDetalle";

function SesionDetalle() {
  const { id } = useParams();
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    getSesionPorId(id).then(setSesion);
  }, [id]);

  if (!sesion) return <div className="p-6">Cargando sesión...</div>;

  const resumenEventos = sesion.eventos?.reduce((acc, ev) => {
    acc[ev.tipo] = (acc[ev.tipo] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen flex bg-white">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#0a0f3c] text-white flex flex-col justify-between items-center p-6 sticky top-0 h-screen">

        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h1 className="text-2xl font-extrabold mb-3">Detalle de sesión</h1>
          <p className="text-sm text-blue-100 max-w-[14rem]">
            Aquí puedes revisar todos los eventos detectados durante una sesión específica.
          </p>
        </div>
        <div className="mb-2">
          <Link to="/registros">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition">
              ← Volver a registros
            </button>
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Sesión del {new Date(sesion.fechaInicio).toLocaleString()}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800 mb-6">
            <p><strong>Duración:</strong> {Math.round(sesion.duracion / 60)} minutos</p>
            <p><strong>Probabilidad máxima:</strong> {sesion.nivelMax ?? "—"}%</p>
            <p><strong>Total de eventos:</strong> {sesion.eventos?.length ?? 0}</p>
          </div>

          {/* RESUMEN DE EVENTOS */}
          <div className="mb-4 bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-800">
            <p className="font-semibold text-blue-900 mb-2">Resumen de eventos:</p>
            {Object.entries(resumenEventos).map(([tipo, cantidad]) => (
              <div key={tipo}>• {tipo}: <strong>{cantidad}</strong></div>
            ))}
          </div>

          {/* TABLA CON SCROLL + PROBABILIDAD */}
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Eventos registrados</h3>
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 shadow-inner">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-blue-900 font-bold">
                <tr>
                  <th className="text-left px-4 py-2">Tipo</th>
                  <th className="text-left px-4 py-2">Hora</th>
                  <th className="text-left px-4 py-2">Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                {sesion.eventos.map((e, i) => {
                  const hora = new Date(e.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  let icon;
                  switch (e.tipo.toLowerCase()) {
                    case "parpadeo":
                      icon = <FaEye className="text-blue-600" />;
                      break;
                    case "bostezo":
                      icon = <FaMeh className="text-yellow-600" />;
                      break;
                    case "microsueño crítico":
                    case "microsueño moderado":
                      icon = <FaBed className="text-red-600" />;
                      break;
                    default:
                      icon = "❓";
                  }

                  const probColor =
                    e.probabilidad >= 70
                      ? "text-red-600"
                      : e.probabilidad >= 40
                      ? "text-yellow-600"
                      : "text-blue-700";

                  return (
                    <tr key={i} className="even:bg-gray-50 border-b">
                      <td className="px-4 py-2 flex items-center gap-2 font-medium">
                        {icon}
                        {e.tipo}
                      </td>
                      <td className="px-4 py-2">{hora}</td>
                      <td className={`px-4 py-2 font-semibold ${probColor}`}>
                        {e.probabilidad ?? "—"}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GRÁFICA DE PROBABILIDAD */}
          {sesion.eventos?.length > 0 && (
            <ProbabilidadChartDetalle eventos={sesion.eventos} />
          )}
        </div>
      </main>
    </div>
  );
}

export default SesionDetalle;
