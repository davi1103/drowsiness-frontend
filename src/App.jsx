import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detection from "./pages/Detection";
import Registros from "./pages/Registros";
import SesionDetalle from "./pages/SesionDetalle";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detectar" element={<Detection />} />
        <Route path="/registros" element={<Registros />} />
        <Route path="/registros/:id" element={<SesionDetalle />} />
      </Routes>
    </Router>
  );
}
