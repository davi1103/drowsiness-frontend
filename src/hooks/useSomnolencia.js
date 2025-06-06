const API_URL = import.meta.env.VITE_API_URL;
import { useRef, useState } from "react";
import axios from "axios";

export function useSomnolencia() {
  const [probabilidad, setProbabilidad] = useState(0);
  const [parpadeos, setParpadeos] = useState(0);
  const [microsuenos, setMicrosuenos] = useState(0);
  const [bostezos, setBostezos] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [framesSinEventos, setFramesSinEventos] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [sesionId, setSesionId] = useState(null);

  const FPS = 30;
  const FRAMES_POR_MINUTO = FPS * 60;

  const cooldownBostezo = useRef(0);
  const cooldownMicrosueno = useRef(0);
  const ojoCerradoDesde = useRef(null);
  const tiempoBocaAbierta = useRef(null);
  const ultimoEventoRef = useRef(Date.now());
  const tiempoInicioRef = useRef(Date.now());

  const puntosOjoIzq = [33, 160, 158, 133, 153, 144];
  const puntosOjoDer = [362, 385, 387, 263, 373, 380];
  const puntosBoca = [13, 14];

  async function iniciarSesion() {
    if (sesionId) return;
    try {
      const res = await axios.post(`${API_URL}/sesiones`, {
        fechaInicio: new Date().toISOString(),
      });
      setSesionId(res.data.id);
      tiempoInicioRef.current = Date.now();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  }

  async function finalizarSesionBackend() {
    if (!sesionId) return;
    try {
      const duracion = Math.floor((Date.now() - tiempoInicioRef.current) / 1000);
      const promedio = historial.reduce((acc, cur) => acc + cur.valor, 0) / (historial.length || 1);

      await axios.patch(`${API_URL}/sesiones/${sesionId}/finalizar`, {
        fechaFin: new Date().toISOString(),
        duracion,
        promedio: Math.round(promedio * 100) / 100,
        nivelMax: Math.max(...historial.map((h) => h.valor), 0),
        eventosTotales: eventos.length,
      });
    } catch (err) {
      console.error("Error al finalizar sesión:", err);
    }
  }

  function distancia(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  function calcularEAR(puntos) {
    const vertical1 = distancia(puntos[1], puntos[5]);
    const vertical2 = distancia(puntos[2], puntos[4]);
    const horizontal = distancia(puntos[0], puntos[3]);
    return (vertical1 + vertical2) / (2.0 * horizontal);
  }

  function agregarEvento(tipo, cantidad) {
    const evento = {
      tipo,
      timestamp: new Date().toISOString(),
      prob: probabilidad + cantidad,
    };
    setEventos((prev) => [...prev, evento]);

    if (sesionId) {
      axios.post(`${API_URL}/eventos`, {
        tipo: evento.tipo,
        timestamp: evento.timestamp,
        probabilidad: Math.round(evento.prob),
        sesionId,
      }).catch((error) => {
        console.error("Error al guardar evento en BD:", error);
      });
    }
  }

  function aumentarProbabilidad(cantidad) {
    setProbabilidad((prev) => {
      const nueva = Math.min(100, prev + cantidad);
      setHistorial((h) => [...h, { tiempo: Date.now(), valor: nueva }]);
      return nueva;
    });
    setFramesSinEventos(0);
  }

  function disminuirProbabilidad(cantidad) {
    setProbabilidad((prev) => {
      const nueva = Math.max(0, prev - cantidad);
      setHistorial((h) => [...h, { tiempo: Date.now(), valor: nueva }]);
      return nueva;
    });
    setFramesSinEventos(0);
  }

  function analizarLandmarks(landmarks) {
    const ahora = Date.now();
    const ojoIzq = puntosOjoIzq.map((i) => landmarks[i]);
    const ojoDer = puntosOjoDer.map((i) => landmarks[i]);
    const boca = puntosBoca.map((i) => landmarks[i]);

    const EAR = (calcularEAR(ojoIzq) + calcularEAR(ojoDer)) / 2;
    const aperturaBoca = distancia(boca[0], boca[1]);

    setFramesSinEventos((f) => f + 1);
    if (cooldownBostezo.current > 0) cooldownBostezo.current--;
    if (cooldownMicrosueno.current > 0) cooldownMicrosueno.current--;

    if (EAR < 0.21) {
      if (!ojoCerradoDesde.current) ojoCerradoDesde.current = ahora;
      const duracion = ahora - ojoCerradoDesde.current;
      if (duracion > 2500 && cooldownMicrosueno.current === 0) {
        aumentarProbabilidad(20);
        agregarEvento("microsueño crítico", 20);
        cooldownMicrosueno.current = FPS * 4;
        ojoCerradoDesde.current = null;
        setMicrosuenos((m) => m + 1);
        ultimoEventoRef.current = ahora;
      }
    } else {
      if (ojoCerradoDesde.current) {
        const duracion = ahora - ojoCerradoDesde.current;
        if (duracion >= 800 && cooldownMicrosueno.current === 0) {
          aumentarProbabilidad(12);
          agregarEvento("microsueño moderado", 12);
          cooldownMicrosueno.current = FPS * 4;
          setMicrosuenos((m) => m + 1);
          ultimoEventoRef.current = ahora;
        } else if (duracion < 300) {
          setParpadeos((p) => p + 1);
          agregarEvento("parpadeo", 0);
          ultimoEventoRef.current = ahora;
        }
        ojoCerradoDesde.current = null;
      }
    }

    if (aperturaBoca > 0.05 && cooldownBostezo.current === 0) {
      if (!tiempoBocaAbierta.current) tiempoBocaAbierta.current = ahora;
      const duracion = ahora - tiempoBocaAbierta.current;
      if (duracion > 400) {
        aumentarProbabilidad(6);
        agregarEvento("bostezo", 6);
        cooldownBostezo.current = FPS * 3;
        setBostezos((b) => b + 1);
        tiempoBocaAbierta.current = null;
        ultimoEventoRef.current = ahora;
      }
    } else {
      tiempoBocaAbierta.current = null;
    }

    const tiempoSinEventos = ahora - ultimoEventoRef.current;
    if (tiempoSinEventos >= 60000 && tiempoSinEventos < 61000) {
      disminuirProbabilidad(4);
      agregarEvento("sin eventos (1min)", -4);
    }

    if (framesSinEventos >= FRAMES_POR_MINUTO) {
      if (parpadeos >= 25) {
        aumentarProbabilidad(2);
        agregarEvento("parpadeos elevados", 2);
      }
      setParpadeos(0);
      setFramesSinEventos(0);
    }
  }

  function reiniciarSesion() {
    setProbabilidad(0);
    setParpadeos(0);
    setMicrosuenos(0);
    setBostezos(0);
    setEventos([]);
    setFramesSinEventos(0);
    setHistorial([]);
    setSesionId(null);
    ojoCerradoDesde.current = null;
    tiempoBocaAbierta.current = null;
    cooldownBostezo.current = 0;
    cooldownMicrosueno.current = 0;
    ultimoEventoRef.current = Date.now();
    tiempoInicioRef.current = Date.now();
  }

  function resetHistorial() {
    setHistorial([]);
  }

  return {
    probabilidad,
    analizarLandmarks,
    parpadeos,
    microsuenos,
    bostezos,
    eventos,
    tiempoInicio: tiempoInicioRef.current,
    reiniciarSesion,
    historial,
    resetHistorial,
    iniciarSesion,
    finalizarSesionBackend,
    sesionId,
  };
}
