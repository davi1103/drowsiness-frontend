import React from "react";

const estilos = {
  bajo: {
    bg: "bg-sky-100",
    border: "border-sky-400",
    text: "text-sky-800",
    icon: "🔵",
  },
  moderado: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-800",
    icon: "🟡",
  },
  alto: {
    bg: "bg-orange-200",
    border: "border-orange-600",
    text: "text-orange-800",
    icon: "🟠",
  },
  critico: {
    bg: "bg-red-200 animate-pulse",
    border: "border-red-600",
    text: "text-red-900 font-bold",
    icon: "🔴",
  },
};

const Alerta = ({ tipo = "bajo", mensaje = "" }) => {
  const estilo = estilos[tipo] || estilos.bajo;

  return (
    <div
      className={`w-full border-l-8 ${estilo.bg} ${estilo.border} ${estilo.text} px-4 py-3 rounded shadow flex items-center gap-3 transition-all`}
    >
      <span className="text-xl">{estilo.icon}</span>
      <span className="text-sm sm:text-base">{mensaje}</span>
    </div>
  );
};

export default Alerta;
