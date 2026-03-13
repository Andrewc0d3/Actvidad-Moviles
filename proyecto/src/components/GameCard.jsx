// ============================================
// COMPONENTE: GameCard
// Muestra una sola tarjeta de juego con imagen,
// nombre y contador de jugadores
// ============================================

import { useState } from "react";

const fallbackColors = [
  "#1a1a2e", "#16213e", "#0f3460", "#533483",
  "#2b2d42", "#1b4332", "#212529", "#3d405b",
];

// ── CAMBIO 1: agregar onJugar a los props ──
function GameCard({ game, size, onJugar }) {
  const [imgError, setImgError] = useState(false);
  const fallbackColor = fallbackColors[game.id % fallbackColors.length];

  const sizeClasses = {
    large: "gamecard gamecard--large",
    medium: "gamecard gamecard--medium",
    small: "gamecard gamecard--small",
  };

  const cardClass = sizeClasses[size] || "gamecard gamecard--medium";

  return (
    <div className={cardClass}>
      <div
        className="gamecard__img-wrapper"
        style={{ backgroundColor: fallbackColor }}
      >
        {!imgError ? (
          <img
            src={game.image}
            alt={game.title}
            className="gamecard__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="gamecard__img-fallback">
            <span>{game.title[0]}</span>
          </div>
        )}

        {game.players > 0 && (
          <div className="gamecard__players">
            <span className="gamecard__players-icon">👤</span>
            <span>{game.players}</span>
          </div>
        )}

        {game.isNew && (
          <div className="gamecard__new-badge">N</div>
        )}

        <div className="gamecard__overlay">
          <p className="gamecard__title">{game.title}</p>
          {/* ── CAMBIO 2: conectar onClick al botón ── */}
          <button
            className="gamecard__play-btn"
            onClick={() => onJugar && onJugar(game)}
          >
            ▶ Jugar
          </button>
        </div>
      </div>

      {size === "small" && (
        <p className="gamecard__name">{game.title}</p>
      )}
    </div>
  );
}

export default GameCard;