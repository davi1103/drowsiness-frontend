const API_URL = import.meta.env.VITE_API_URL;

// Crear una nueva sesión
export async function crearSesion() {
  try {
    const res = await fetch(`${API_URL}/sesiones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Error al crear sesión");
    return await res.json();
  } catch (err) {
    console.error("crearSesion error:", err);
    return null;
  }
}

// Registrar un evento
export async function registrarEvento(evento) {
  try {
    const res = await fetch(`${API_URL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
    });
    if (!res.ok) throw new Error("Error al registrar evento");
    return await res.json();
  } catch (err) {
    console.error("registrarEvento error:", err);
    return null;
  }
}

// Finalizar una sesión existente
export async function finalizarSesion(id, data) {
  try {
    const res = await fetch(`${API_URL}/sesiones/${id}/finalizar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al finalizar sesión");
    return await res.json();
  } catch (err) {
    console.error("finalizarSesion error:", err);
    return null;
  }
}

// Obtener todas las sesiones
export async function getSesiones() {
  try {
    const res = await fetch(`${API_URL}/sesiones`);
    if (!res.ok) throw new Error("Error al obtener sesiones");
    return await res.json();
  } catch (err) {
    console.error("getSesiones error:", err);
    return [];
  }
}

// Obtener una sesión específica por ID
export async function getSesionPorId(id) {
  try {
    const res = await fetch(`${API_URL}/sesiones/${id}`);
    if (!res.ok) throw new Error("Sesión no encontrada");
    return await res.json();
  } catch (err) {
    console.error("getSesionPorId error:", err);
    return null;
  }
}
