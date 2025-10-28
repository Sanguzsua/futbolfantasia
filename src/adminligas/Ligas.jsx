import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase/Supabase";


export default function AdminLigas() {
  const [ligas, setLigas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  async function obtenerLigas() {
    const { data, error } = await supabase
      .from("ligas")
      .select("*")
      .order("fecha_creacion", { ascending: false });
    if (error) console.error(error);
    else setLigas(data);
  }

  async function crearLiga() {
    if (!nombre.trim()) {
      mostrarMensaje("El nombre es obligatorio", "error");
      return;
    }

    const { error } = await supabase.from("ligas").insert([{ nombre, descripcion }]);
    if (error) mostrarMensaje("❌ Error: " + error.message, "error");
    else {
      mostrarMensaje("✅ Liga creada con éxito", "exito");
      setNombre("");
      setDescripcion("");
      obtenerLigas();
    }
  }

  function mostrarMensaje(texto, tipo) {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  }

  useEffect(() => {
    obtenerLigas();
  }, []);

  return (
    <div className="admin-container">
      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <h1 className="admin-titulo">⚽ Administrador de Ligas</h1>

      <div className="admin-form">
        <input
          className="admin-input"
          type="text"
          placeholder="Nombre de la liga"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="admin-input"
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button className="admin-boton" onClick={crearLiga}>
          Crear liga
        </button>
      </div>

      <h2 className="admin-subtitulo">Ligas registradas</h2>
      <div className="admin-lista">
        {ligas.length === 0 && <p>No hay ligas creadas aún.</p>}
        {ligas.map((liga) => (
          <div key={liga.id} className="admin-card">
            <h3>{liga.nombre}</h3>
            <p>{liga.descripcion}</p>
            <small>📅 {new Date(liga.fecha_creacion).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
