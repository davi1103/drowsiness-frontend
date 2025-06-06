import React, { useEffect, useState } from "react";
import { getSesiones } from "../shared/api";
import { Link } from "react-router-dom";
import SesionTable from "../components/SesionTable";
import SesionCard from "../components/SesionCard";
import FiltroRegistros from "../components/FiltroRegistros";

function Registros() {
  const [sesiones, setSesiones] = useState([]);
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    probMin: "",
  });

  useEffect(() => {
    getSesiones().then(setSesiones);
  }, []);

  const sesionesFiltradas = sesiones.filter((s) => {
    const fecha = new Date(s.fechaInicio);
    const desde = filtros.desde ? new Date(filtros.desde) : null;
    const hasta = filtros.hasta ? new Date(filtros.hasta) : null;
    const prob = filtros.probMin ? parseFloat(filtros.probMin) : 0;

    return (
      (!desde || fecha >= desde) &&
      (!hasta || fecha <= hasta) &&
      (!prob || s.nivelMax >= prob)
    );
  });

  return (
    <div className="min-h-screen flex bg-white">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#0a0f3c] text-white flex flex-col justify-between items-center p-6">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-wide transition-all duration-300 ease-in-out hover:scale-105">
            Historial<br />de sesiones
            </h1>

            <p className="text-sm text-blue-100 max-w-[14rem]">
            Revisa tus sesiones anteriores, analiza eventos y evalúa niveles de riesgo.
            </p>
        </div>

        <div className="mb-2">
            <Link to="/">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition">
                ← Volver al inicio
            </button>
            </Link>
        </div>
        </aside>


      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 bg-white">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 max-w-6xl mx-auto">

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h2 className="text-base font-semibold text-blue-900 mb-1">
        Filtrar sesiones
      </h2>
        <p className="text-sm text-gray-600">
            Puedes seleccionar un rango de fechas, establecer un nivel mínimo de riesgo o ver sesiones recientes.
        </p>
        </div>

        {/* BOTÓN DE RESETEO */}
        <button
        onClick={() => setFiltros({ desde: "", hasta: "", probMin: "" })}
        className="text-sm text-blue-700 hover:text-blue-900 border border-blue-200 px-3 py-1 rounded-md transition shadow-sm bg-white"
        >
        🔄 Restablecer filtros
        </button>
    </div>

    <FiltroRegistros filtros={filtros} setFiltros={setFiltros} />
    </div>




          {/* TABLA EN ESCRITORIO */}
          <div className="hidden md:block mt-6">
            <SesionTable sesiones={sesionesFiltradas} />
          </div>

          {/* CARDS EN MÓVIL */}
          <div className="block md:hidden mt-6 space-y-4">
            {sesionesFiltradas.map((sesion) => (
              <SesionCard key={sesion.id} sesion={sesion} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registros;
