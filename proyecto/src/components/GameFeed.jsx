// ============================================
// COMPONENTE: GameFeed
// Contiene todo el feed de juegos:
// 1. Carrusel principal (featured)
// 2. Sección "Juegos Nuevos"
// Al hacer clic en "Jugar" → abre el juego correspondiente
// ============================================

import { useState } from "react";
import GameCard from "./GameCard";
import Domino from "./domino";  // <-- minúscula para coincidir con el archivo
import { featuredGames, featuredGames2, newGames } from "../data/games";

// ── Mapa de componentes por nombre ──
// OJO: ponemos la FUNCIÓN, no <Domino /> — eso lo hacemos abajo al renderizar
// Para agregar otro juego: Snake: Snake, Tetris: Tetris, etc.
const JUEGOS_MAP = {
  Domino: Domino,
};

function GameFeed() {
  // Cuántos juegos nuevos mostrar
  const [visibleNewGames, setVisibleNewGames] = useState(5);

  // Juego actualmente abierto (null = mostrar feed normal)
  const [juegoAbierto, setJuegoAbierto] = useState(null);

  function handleShowMore() {
    setVisibleNewGames((prev) => prev + 5);
  }

  // Se llama cuando el usuario hace clic en "Jugar"
  function handleJugar(game) {
    setJuegoAbierto(game);
  }

  // Volver al feed
  function handleCerrar() {
    setJuegoAbierto(null);
  }

  // ── Si hay un juego abierto, mostrar el juego ──
  if (juegoAbierto) {

    // Busca el componente en el mapa según el campo "componente" del juego
    const ComponenteJuego = JUEGOS_MAP[juegoAbierto.componente];

    return (
      <div style={{ backgroundColor: "#0f1117", minHeight: "100vh" }}>

        {/* Barra superior con nombre del juego y botón volver */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          backgroundColor: "#1a1a2e",
          borderBottom: "1px solid #333355",
        }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
            🎮 {juegoAbierto.title}
          </span>
          <button
            onClick={handleCerrar}
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid #f0c040",
              color: "#f0c040",
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            ← Volver al feed
          </button>
        </div>

        {/* El componente del juego — se instancia nuevo cada vez que se abre */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
          {ComponenteJuego ? (
            <ComponenteJuego />
          ) : (
            <p style={{ color: "#8b90a8", marginTop: 40 }}>
              Juego "{juegoAbierto.componente}" no disponible aún.
            </p>
          )}
        </div>

      </div>
    );
  }

  // ── Feed normal ──
  return (
    <div className="feed">

      {/* ======================================
          SECCIÓN 1: CARRUSEL PRINCIPAL
          ====================================== */}
      <section className="feed__featured">
        <div className="feed__featured-row feed__featured-row--top">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} size="large" onJugar={handleJugar} />
          ))}
        </div>

        <div className="feed__featured-row feed__featured-row--bottom">
          {featuredGames2.map((game) => (
            <GameCard key={game.id} game={game} size="medium" onJugar={handleJugar} />
          ))}
        </div>
      </section>

      {/* ======================================
          SECCIÓN 2: JUEGOS NUEVOS
          ====================================== */}
      <section className="feed__new-games">

        <div className="feed__section-header">
          <div className="feed__section-title">
            <div className="feed__section-icon">N</div>
            <h2>JUEGOS NUEVOS</h2>
          </div>
          <div className="feed__section-count">
            <span className="feed__count-n">N</span>
            <span>{newGames.length}</span>
          </div>
        </div>

        <div className="feed__new-grid">
          {newGames.slice(0, visibleNewGames).map((game) => (
            <GameCard key={game.id} game={game} size="small" onJugar={handleJugar} />
          ))}
        </div>

        {visibleNewGames < newGames.length && (
          <div className="feed__show-more">
            <button className="feed__show-more-btn" onClick={handleShowMore}>
              Ver más juegos
            </button>
          </div>
        )}

      </section>

    </div>
  );
}

export default GameFeed;