import React, { useState, useEffect } from "react";
import CameraFeed from "../components/CameraFeed";
import { useSomnolencia } from "../hooks/useSomnolencia";
import { useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import ProbabilidadChart from "../components/ProbabilidadChart";

export default function Detection() {
  const {
    probabilidad,
    analizarLandmarks,
    parpadeos,
    microsuenos,
    bostezos,
    eventos,
    tiempoInicio,
    reiniciarSesion,
    historial,
    resetHistorial,
    iniciarSesion,
    finalizarSesionBackend,
    sesionId, // ✅ accedemos aquí
  } = useSomnolencia();

  const [tiempo, setTiempo] = useState("00:00");
  const [alerta, setAlerta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    iniciarSesion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const ahora = Date.now();
      const delta = Math.floor((ahora - tiempoInicio) / 1000);
      const minutos = String(Math.floor(delta / 60)).padStart(2, "0");
      const segundos = String(delta % 60).padStart(2, "0");
      setTiempo(`${minutos}:${segundos}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoInicio]);

  useEffect(() => {
    return () => {
      finalizarSesionBackend();
    };
  }, []);

  useEffect(() => {
    const ultimo = eventos[eventos.length - 1];
    if (!ultimo) return;

    if (ultimo.tipo === "microsueño crítico") {
      setAlerta({ tipo: "critico", mensaje: "⚠️ ¡Microsueño crítico detectado!" });
    } else if (ultimo.tipo === "microsueño moderado") {
      setAlerta({ tipo: "alto", mensaje: "⚠️ Microsueño moderado" });
    } else if (ultimo.tipo === "parpadeos elevados") {
      setAlerta({ tipo: "moderado", mensaje: "⚠️ Parpadeos frecuentes" });
    } else if (probabilidad >= 80) {
      setAlerta({ tipo: "critico", mensaje: "🔴 Somnolencia crítica" });
    } else if (probabilidad >= 60) {
      setAlerta({ tipo: "alto", mensaje: "🟠 Somnolencia elevada" });
    } else if (probabilidad >= 40) {
      setAlerta({ tipo: "moderado", mensaje: "🟡 Somnolencia moderada" });
    } else {
      setAlerta(null);
    }
  }, [eventos, probabilidad]);

  const detenerSesion = async () => {
    setCargando(true);
    await finalizarSesionBackend();
    reiniciarSesion();
    resetHistorial();
    navigate("/");
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-sky-700">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-semibold">Cerrando sesión y limpiando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md py-4 px-6">
        <h1 className="text-2xl font-bold text-center">
          Sistema de Monitoreo de Somnolencia
        </h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
        {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} />}

        {/* ✅ Solo renderizamos CameraFeed si la sesión está creada */}
        {sesionId ? (
          <CameraFeed onResults={analizarLandmarks} />
        ) : (
          <p className="text-gray-500 text-sm mt-4">Inicializando cámara...</p>
        )}

        <div className="w-full text-center mt-4">
          <p className="text-lg font-medium">
            Nivel de somnolencia: <strong className="text-sky-800">{Math.round(probabilidad)}%</strong>
          </p>
          <div className="w-full h-4 bg-gray-200 rounded-full mt-2 overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(probabilidad, 100)}%`,
                backgroundColor:
                  probabilidad < 40
                    ? "#3b82f6"
                    : probabilidad < 75
                    ? "#facc15"
                    : "#ef4444",
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
          {[{ label: "Parpadeos", value: parpadeos },
            { label: "Microsueños", value: microsuenos },
            { label: "Bostezos", value: bostezos },
            { label: "Tiempo", value: tiempo }].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-sky-500 rounded-lg shadow-md text-center py-3"
              >
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-sky-700">
                  {item.label === "Tiempo"
                    ? <span className="font-mono">{item.value}</span>
                    : item.value}
                </p>
              </div>
            ))}
        </div>

        <div className="w-full mt-6 bg-white border border-blue-300 rounded shadow p-4">
          <h2 className="text-sky-700 font-semibold text-lg mb-2">
            Evolución de la somnolencia
          </h2>
          <ProbabilidadChart data={historial} />
        </div>

        <button
          onClick={detenerSesion}
          className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded shadow hover:bg-red-700 transition"
        >
          Detener detección
        </button>

        <div className="w-full mt-8 bg-white text-black rounded-lg border border-sky-200 shadow max-h-80 overflow-y-scroll">
          <table className="w-full text-sm table-auto">
            <thead className="bg-sky-100 sticky top-0 z-10 text-sky-800 font-semibold">
              <tr>
                <th className="py-2 px-4 text-left">Evento</th>
                <th className="py-2 px-4 text-left">Hora</th>
                <th className="py-2 px-4 text-left">Probabilidad</th>
              </tr>
            </thead>
            <tbody>
              {(eventos.slice(-30).reverse()).map((ev, idx) => (
                <tr key={idx} className="border-t border-gray-200 hover:bg-sky-50 transition">
                  <td className="py-2 px-4">{ev.tipo}</td>
                  <td className="py-2 px-4">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-4">{Math.round(ev.prob)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
