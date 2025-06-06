import React from "react";

function FiltroRegistros({ filtros, setFiltros }) {
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div>
        <label className="mr-2">Desde:</label>
        <input
          type="date"
          name="desde"
          value={filtros.desde}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div>
        <label className="mr-2">Hasta:</label>
        <input
          type="date"
          name="hasta"
          value={filtros.hasta}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div>
        <label className="mr-2">Prob. mínima:</label>
        <input
          type="number"
          name="probMin"
          step="0.01"
          value={filtros.probMin}
          onChange={handleChange}
          className="p-2 border rounded w-24"
        />
      </div>
    </div>
  );
}

export default FiltroRegistros;
