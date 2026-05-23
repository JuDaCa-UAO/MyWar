import { useEffect } from "react";

const FACTIONS = {
  nekara: {
    name: "Nekara",
    tag: "Estado régimen",
    accent: "#c2a04a",
    paragraphs: [
      "Nekara es un estado militarizado que sostiene su poder a través de la propaganda, la ocupación territorial y un ejército entrenado para obedecer sin cuestionar. Sus soldados aprenden que el enemigo existe antes de verlo.",
      "El Dictador gobierna desde una imagen sin cara. Su voz llega a través de pantallas, altavoces y órdenes de campaña. Nunca se le ve. Siempre se le obedece.",
      "Lether fue uno de esos soldados: eficiente, disciplinado, sin espacio para la duda. Hasta que Osvalia se lo cerró.",
    ],
    stats: [
      { label: "Estructura", value: "Régimen militar centralizado" },
      { label: "Táctica", value: "Ocupación + propaganda estatal" },
      { label: "Símbolo", value: "El Dictador sin rostro" },
      { label: "Personaje clave", value: "Lether (soldado)" },
    ],
  },
  osvalia: {
    name: "Osvalia",
    tag: "Territorio ocupado",
    accent: "#b08a5b",
    paragraphs: [
      "Osvalia es la nación ocupada. Su gente vive entre la supervivencia y la resistencia silenciosa, atrapada por la narrativa que Nekara construyó sobre ellos.",
      "Los osvalios no son monstruos. Son familias, casas marcadas como objetivos, y voces que no aparecen en los informes de campaña militar.",
      "Karim emerge desde aquí. No como un villano, sino como el espejo que rompe la certeza de Lether y convierte una orden en una pregunta.",
    ],
    stats: [
      { label: "Condición", value: "Nación bajo ocupación militar" },
      { label: "Resistencia", value: "Civil y silenciosa" },
      { label: "Color narrativo", value: "Tierra · cobre · ocre" },
      { label: "Personaje clave", value: "Karim" },
    ],
  },
  redencion: {
    name: "Redención",
    tag: "Arco narrativo central",
    accent: "#b9d8ff",
    paragraphs: [
      "La redención en My War no es un gesto heroico. Es el costo de haber obedecido demasiado tiempo sin preguntar.",
      "Lether no puede deshacer lo que hizo. Pero puede elegir qué hace ahora. Esa primera grieta —pequeña, casi imperceptible— es el núcleo del capítulo 1.",
      "El camino de redención se extiende a través de todos los medios: el cómic plantea la pregunta, el videojuego la hace jugable, y la película la cierra.",
    ],
    stats: [
      { label: "Tipo", value: "Arco moral transmedia" },
      { label: "Protagonista", value: "Lether" },
      { label: "Punto de quiebre", value: "Capítulo 1 · Página 11" },
      { label: "Continúa en", value: "Videojuego · Película" },
    ],
  },
};

export default function FactionModal({ faction, onClose }) {
  const data = FACTIONS[faction];

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="faction-modal-overlay" onClick={onClose}>
      <div
        className="faction-modal"
        style={{ "--faction-accent": data.accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="faction-modal__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <header className="faction-modal__header">
          <span className="faction-modal__tag">{data.tag}</span>
          <h3 className="faction-modal__name">{data.name}</h3>
        </header>

        <div className="faction-modal__body">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <ul className="faction-modal__stats">
          {data.stats.map((s) => (
            <li key={s.label}>
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
