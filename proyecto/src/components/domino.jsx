// ============================================
// Domino.jsx - Dominó clásico 1 jugador vs CPU
// Autor: Juliana
//
// Uso en GameFeed.jsx:
//   import Domino from "./Domino";
//   // ya está integrado en handleJugar
// ============================================

import { useState, useEffect, useCallback } from "react";

// ── Generar el set completo de fichas de dominó (0-6) ──
function generarFichas() {
  const fichas = [];
  let id = 0;
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      fichas.push({ id: id++, izq: i, der: j });
    }
  }
  return fichas;
}

// ── Mezclar array ──
function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Repartir fichas ──
function repartir() {
  const todas = mezclar(generarFichas());
  return {
    manoJugador: todas.slice(0, 7),
    manoCPU:     todas.slice(7, 14),
    pozo:        todas.slice(14),
  };
}

// ── Verificar si una ficha puede colocarse ──
function puedeColocar(ficha, extremoIzq, extremoDer) {
  return (
    ficha.izq === extremoIzq || ficha.der === extremoIzq ||
    ficha.izq === extremoDer || ficha.der === extremoDer
  );
}

// ── Orientar la ficha para que encaje en el extremo ──
function orientar(ficha, extremo) {
  if (ficha.izq === extremo) return { ...ficha };
  return { ...ficha, izq: ficha.der, der: ficha.izq };
}

// ── Puntos en mano ──
function sumarMano(mano) {
  return mano.reduce((s, f) => s + f.izq + f.der, 0);
}

// ── Dibujar puntos de dominó en SVG ──
function PuntosSVG({ valor, flip = false }) {
  const posiciones = {
    0: [],
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
  };

  const puntos = posiciones[valor] || [];

  return (
    <svg
      width="40" height="40"
      viewBox="0 0 100 100"
      style={{ transform: flip ? "rotate(180deg)" : "none" }}
    >
      {puntos.map(([ x, y ], i) => (
        <circle key={i} cx={x} cy={y} r={10} fill="#1a1a2e" />
      ))}
    </svg>
  );
}

// ── Componente de ficha individual ──
function Ficha({ ficha, horizontal = true, onClick, seleccionada, enMano }) {
  const base = {
    display: "inline-flex",
    flexDirection: horizontal ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f0e8",
    borderRadius: 6,
    border: seleccionada ? "3px solid #f0c040" : "2px solid #bbb",
    boxShadow: seleccionada
      ? "0 0 12px rgba(240,192,64,0.8)"
      : "2px 2px 6px rgba(0,0,0,0.4)",
    cursor: onClick ? "pointer" : "default",
    transition: "transform 0.15s, box-shadow 0.15s",
    transform: seleccionada ? "translateY(-6px)" : "none",
    padding: 3,
    gap: 2,
    userSelect: "none",
    flexShrink: 0,
  };

  const lineaEstilo = {
    backgroundColor: "#bbb",
    ...(horizontal
      ? { width: 2, height: 34, margin: "0 2px" }
      : { height: 2, width: 34, margin: "2px 0" }),
  };

  return (
    <div style={base} onClick={onClick}>
      <PuntosSVG valor={ficha.izq} />
      <div style={lineaEstilo} />
      <PuntosSVG valor={ficha.der} />
    </div>
  );
}

// ── Ficha oculta (CPU) ──
function FichaOculta() {
  return (
    <div style={{
      width: 44, height: 84,
      backgroundColor: "#1a3a5c",
      borderRadius: 6,
      border: "2px solid #2a5a8c",
      boxShadow: "2px 2px 6px rgba(0,0,0,0.5)",
      backgroundImage: "repeating-linear-gradient(45deg, #1e4570 0px, #1e4570 4px, #1a3a5c 4px, #1a3a5c 10px)",
      flexShrink: 0,
    }} />
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function Domino() {

  const [manoJugador,   setManoJugador]   = useState([]);
  const [manoCPU,       setManoCPU]       = useState([]);
  const [pozo,          setPozo]          = useState([]);
  const [tablero,       setTablero]       = useState([]);   // fichas en mesa
  const [extremoIzq,    setExtremoIzq]    = useState(null);
  const [extremoDer,    setExtremoDer]    = useState(null);
  const [turno,         setTurno]         = useState("jugador"); // "jugador" | "cpu"
  const [seleccionada,  setSeleccionada]  = useState(null);      // índice ficha seleccionada
  const [mensaje,       setMensaje]       = useState("");
  const [ganador,       setGanador]       = useState(null);
  const [animando,      setAnimando]      = useState(false);
  const [fichaAnimada,  setFichaAnimada]  = useState(null);

  // ── Iniciar partida ──
  function iniciar() {
    const { manoJugador: mj, manoCPU: mc, pozo: pz } = repartir();

    // El que tiene el doble más alto empieza
    const doblesMJ = mj.filter(f => f.izq === f.der).sort((a, b) => b.izq - a.izq);
    const doblesMC = mc.filter(f => f.izq === f.der).sort((a, b) => b.izq - a.izq);

    let primeraFicha = null;
    let quienEmpieza = "jugador";

    if (doblesMJ.length && (!doblesMC.length || doblesMJ[0].izq >= doblesMC[0].izq)) {
      primeraFicha = doblesMJ[0];
      setManoJugador(mj.filter(f => f.id !== primeraFicha.id));
      setManoCPU(mc);
      quienEmpieza = "cpu"; // jugador colocó, turno CPU
    } else if (doblesMC.length) {
      primeraFicha = doblesMC[0];
      setManoCPU(mc.filter(f => f.id !== primeraFicha.id));
      setManoJugador(mj);
      quienEmpieza = "jugador";
    } else {
      // Sin dobles: la ficha más alta del jugador
      const masAlta = [...mj].sort((a, b) => (b.izq + b.der) - (a.izq + a.der))[0];
      primeraFicha = masAlta;
      setManoJugador(mj.filter(f => f.id !== masAlta.id));
      setManoCPU(mc);
      quienEmpieza = "cpu";
    }

    setTablero([primeraFicha]);
    setExtremoIzq(primeraFicha.izq);
    setExtremoDer(primeraFicha.der);
    setPozo(pz);
    setTurno(quienEmpieza);
    setSeleccionada(null);
    setMensaje(quienEmpieza === "cpu" ? "CPU está pensando..." : "Tu turno — selecciona una ficha");
    setGanador(null);
    setAnimando(false);
    setFichaAnimada(null);
  }

  useEffect(() => { iniciar(); }, []);

  // ── Colocar ficha en el tablero ──
  function colocarFicha(ficha, lado) {
    let fichaOrientada;
    let nuevoIzq = extremoIzq;
    let nuevoDer = extremoDer;

    if (lado === "izq") {
      fichaOrientada = orientar({ ...ficha, izq: ficha.der, der: ficha.izq }, extremoIzq);
      if (fichaOrientada.der !== extremoIzq) {
        fichaOrientada = orientar(ficha, extremoIzq);
      }
      // La ficha va a la izquierda: su der encaja con extremoIzq
      if (fichaOrientada.der === extremoIzq) {
        nuevoIzq = fichaOrientada.izq;
      } else {
        fichaOrientada = { ...ficha, izq: ficha.der, der: ficha.izq };
        nuevoIzq = fichaOrientada.izq;
      }
      setTablero(prev => [fichaOrientada, ...prev]);
      setExtremoIzq(nuevoIzq);
    } else {
      fichaOrientada = orientar(ficha, extremoDer);
      if (fichaOrientada.izq === extremoDer) {
        nuevoDer = fichaOrientada.der;
      } else {
        fichaOrientada = { ...ficha, izq: ficha.der, der: ficha.izq };
        nuevoDer = fichaOrientada.der;
      }
      setTablero(prev => [...prev, fichaOrientada]);
      setExtremoDer(nuevoDer);
    }

    return fichaOrientada;
  }

  // ── Jugador selecciona ficha ──
  function handleSeleccionar(index) {
    if (turno !== "jugador" || ganador || animando) return;
    setSeleccionada(index === seleccionada ? null : index);
    setMensaje("Ahora elige dónde colocarla: ← izquierda o derecha →");
  }

  // ── Jugador coloca en un lado ──
  function handleColocar(lado) {
    if (turno !== "jugador" || seleccionada === null || ganador || animando) return;

    const ficha = manoJugador[seleccionada];

    if (!puedeColocar(ficha, extremoIzq, extremoDer)) {
      setMensaje("⚠️ Esa ficha no encaja. Elige otra.");
      return;
    }

    // Verificar que encaja en ese lado específico
    const encajaIzq = ficha.izq === extremoIzq || ficha.der === extremoIzq;
    const encajaDer = ficha.izq === extremoDer || ficha.der === extremoDer;

    if (lado === "izq" && !encajaIzq) {
      setMensaje("⚠️ Esa ficha no encaja a la izquierda.");
      return;
    }
    if (lado === "der" && !encajaDer) {
      setMensaje("⚠️ Esa ficha no encaja a la derecha.");
      return;
    }

    setAnimando(true);
    setFichaAnimada(ficha.id);

    setTimeout(() => {
      colocarFicha(ficha, lado);
      const nuevaMano = manoJugador.filter((_, i) => i !== seleccionada);
      setManoJugador(nuevaMano);
      setSeleccionada(null);
      setAnimando(false);
      setFichaAnimada(null);

      if (nuevaMano.length === 0) {
        setGanador("¡Ganaste! 🎉");
        return;
      }
      setTurno("cpu");
      setMensaje("CPU está pensando...");
    }, 400);
  }

  // ── Jugador roba del pozo ──
  function handleRobar() {
    if (turno !== "jugador" || ganador || animando || pozo.length === 0) return;

    const [robada, ...restoPozo] = pozo;
    setManoJugador(prev => [...prev, robada]);
    setPozo(restoPozo);
    setMensaje(`Robaste una ficha (${robada.izq}|${robada.der}). Sigue jugando.`);
  }

  // ── Turno de la CPU ──
  const turnoCPU = useCallback(() => {
    if (turno !== "cpu" || ganador || animando) return;

    setTimeout(() => {
      let manoCPUActual = [...manoCPU];
      let pozoActual    = [...pozo];
      let jugoCPU       = false;

      // Buscar ficha que encaje
      for (let intento = 0; intento < manoCPUActual.length; intento++) {
        const ficha = manoCPUActual[intento];
        if (puedeColocar(ficha, extremoIzq, extremoDer)) {
          // Elegir lado
          const encajaIzq = ficha.izq === extremoIzq || ficha.der === extremoIzq;
          const lado = encajaIzq ? "izq" : "der";

          setAnimando(true);
          setFichaAnimada(ficha.id);

          setTimeout(() => {
            colocarFicha(ficha, lado);
            const nuevaManoCPU = manoCPUActual.filter((_, i) => i !== intento);
            setManoCPU(nuevaManoCPU);
            setAnimando(false);
            setFichaAnimada(null);

            if (nuevaManoCPU.length === 0) {
              setGanador("CPU ganó 🤖");
              return;
            }
            setTurno("jugador");
            setMensaje("Tu turno — selecciona una ficha");
          }, 400);

          jugoCPU = true;
          break;
        }
      }

      // CPU roba si no puede jugar
      if (!jugoCPU) {
        if (pozoActual.length > 0) {
          const [robada, ...restoPozo] = pozoActual;
          manoCPUActual = [...manoCPUActual, robada];
          setManoCPU(manoCPUActual);
          setPozo(restoPozo);
          setMensaje("CPU robó una ficha...");

          // Reintentar con la ficha robada
          if (puedeColocar(robada, extremoIzq, extremoDer)) {
            setTimeout(() => turnoCPU(), 800);
          } else {
            setTurno("jugador");
            setMensaje("CPU no pudo jugar. Tu turno.");
          }
        } else {
          // Sin fichas en pozo: trancado
          const puntosJugador = sumarMano(manoJugador);
          const puntosCPU     = sumarMano(manoCPUActual);
          if (puntosJugador < puntosCPU) setGanador("¡Ganaste por puntos! 🎉");
          else if (puntosCPU < puntosJugador) setGanador("CPU ganó por puntos 🤖");
          else setGanador("¡Empate! 🤝");
        }
      }
    }, 1200);
  }, [turno, manoCPU, pozo, extremoIzq, extremoDer, ganador, animando]);

  useEffect(() => {
    if (turno === "cpu" && !ganador) turnoCPU();
  }, [turno, turnoCPU, ganador]);

  // ── Verificar si el jugador puede jugar ──
  const jugadorPuedeJugar = manoJugador.some(f => puedeColocar(f, extremoIzq, extremoDer));
  const hayPozo           = pozo.length > 0;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={est.pagina}>
      <div style={est.contenedor}>

        {/* ── Título ── */}
        <div style={est.titulo}>
          🁢 DOMINÓ CLÁSICO
          <span style={est.subtitulo}>Jugador vs CPU</span>
        </div>

        {/* ── Info de turno y mensaje ── */}
        <div style={est.infoBar}>
          <span style={{ ...est.turnoChip, backgroundColor: turno === "jugador" ? "#f0c040" : "#4a90d9", color: "#111" }}>
            {turno === "jugador" ? "👤 Tu turno" : "🤖 CPU"}
          </span>
          <span style={est.mensajeTexto}>{mensaje}</span>
          <span style={est.pozoInfo}>Pozo: {pozo.length}</span>
        </div>

        {/* ── Mano de la CPU (fichas ocultas) ── */}
        <div style={est.seccionCPU}>
          <span style={est.etiqueta}>CPU — {manoCPU.length} fichas</span>
          <div style={est.manoOculta}>
            {manoCPU.map((_, i) => <FichaOculta key={i} />)}
          </div>
        </div>

        {/* ── Tablero ── */}
        <div style={est.tableroContenedor}>
          <div style={est.tablero}>
            {tablero.length === 0 ? (
              <span style={{ color: "#555", fontSize: 14 }}>Mesa vacía</span>
            ) : (
              tablero.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    ...est.fichaTablero,
                    animation: fichaAnimada === f.id ? "aparecer 0.35s ease" : "none",
                  }}
                >
                  <Ficha ficha={f} horizontal={true} />
                </div>
              ))
            )}
          </div>

          {/* Extremos visibles */}
          {tablero.length > 0 && (
            <div style={est.extremos}>
              <span style={est.extremoChip}>← {extremoIzq}</span>
              <span style={est.extremoChip}>{extremoDer} →</span>
            </div>
          )}
        </div>

        {/* ── Botones de colocar ── */}
        {turno === "jugador" && seleccionada !== null && !ganador && (
          <div style={est.botonesColocar}>
            <button style={est.btnLado} onClick={() => handleColocar("izq")}>
              ← Colocar izquierda ({extremoIzq})
            </button>
            <button style={est.btnLado} onClick={() => handleColocar("der")}>
              Colocar derecha ({extremoDer}) →
            </button>
          </div>
        )}

        {/* ── Botón robar ── */}
        {turno === "jugador" && !jugadorPuedeJugar && hayPozo && !ganador && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <button style={est.btnRobar} onClick={handleRobar}>
              🎲 Robar ficha del pozo
            </button>
          </div>
        )}

        {/* ── Trancado sin pozo ── */}
        {turno === "jugador" && !jugadorPuedeJugar && !hayPozo && !ganador && (
          <div style={est.trancado}>
            🔒 No puedes jugar y el pozo está vacío. Pasas turno.
            <button style={{ ...est.btnRobar, marginLeft: 12 }} onClick={() => setTurno("cpu")}>
              Pasar turno
            </button>
          </div>
        )}

        {/* ── Mano del jugador ── */}
        <div style={est.seccionJugador}>
          <span style={est.etiqueta}>Tu mano — {manoJugador.length} fichas</span>
          <div style={est.manoJugador}>
            {manoJugador.map((ficha, i) => {
              const puedeEstaFicha = puedeColocar(ficha, extremoIzq, extremoDer);
              return (
                <div
                  key={ficha.id}
                  style={{
                    opacity: turno === "jugador" && !puedeEstaFicha && jugadorPuedeJugar ? 0.4 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Ficha
                    ficha={ficha}
                    horizontal={false}
                    seleccionada={seleccionada === i}
                    onClick={() => handleSeleccionar(i)}
                    enMano
                  />
                </div>
              );
            })}
          </div>
          <span style={est.instruccion}>
            {turno === "jugador" && !ganador
              ? seleccionada !== null
                ? "Ahora elige ← izquierda o derecha →"
                : "Toca una ficha para seleccionarla"
              : ""}
          </span>
        </div>

        {/* ── Pantalla de fin de juego ── */}
        {ganador && (
          <div style={est.overlay}>
            <div style={est.overlayCaja}>
              <p style={est.overlayTitulo}>{ganador}</p>
              <p style={est.overlayPuntos}>
                Tus puntos: {sumarMano(manoJugador)} | CPU: {sumarMano(manoCPU)}
              </p>
              <button style={est.btnNueva} onClick={iniciar}>
                🔄 Nueva partida
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Animación CSS */}
      <style>{`
        @keyframes aparecer {
          from { opacity: 0; transform: scale(0.5) translateY(-20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================
const est = {
  pagina: {
    minHeight: "100vh",
    backgroundColor: "#0f1117",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px 10px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  contenedor: {
    width: "100%",
    maxWidth: 900,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "relative",
  },
  titulo: {
    color: "#f0c040",
    fontSize: "1.5rem",
    fontWeight: 900,
    letterSpacing: 3,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  subtitulo: {
    fontSize: "0.8rem",
    color: "#8b90a8",
    fontWeight: 400,
    letterSpacing: 1,
  },
  infoBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1d27",
    border: "1px solid #2e3450",
    borderRadius: 10,
    padding: "10px 16px",
    flexWrap: "wrap",
  },
  turnoChip: {
    borderRadius: 20,
    padding: "4px 12px",
    fontWeight: 800,
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  mensajeTexto: {
    color: "#e8eaf0",
    fontSize: "0.88rem",
    flex: 1,
  },
  pozoInfo: {
    color: "#8b90a8",
    fontSize: "0.8rem",
    flexShrink: 0,
  },
  seccionCPU: {
    backgroundColor: "#1a1d27",
    border: "1px solid #2e3450",
    borderRadius: 10,
    padding: "12px 16px",
  },
  etiqueta: {
    color: "#8b90a8",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: 1,
    display: "block",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  manoOculta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  tableroContenedor: {
    backgroundColor: "#14532d",
    border: "2px solid #166534",
    borderRadius: 12,
    padding: 16,
    minHeight: 130,
  },
  tablero: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    minHeight: 90,
  },
  fichaTablero: {
    display: "inline-flex",
  },
  extremos: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  extremoChip: {
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#f0c040",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  botonesColocar: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnLado: {
    backgroundColor: "#f0c040",
    color: "#0f1117",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 800,
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnRobar: {
    backgroundColor: "#1e3a5f",
    color: "#7bb3ff",
    border: "1px solid #2a5a8c",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  trancado: {
    textAlign: "center",
    color: "#ff6b82",
    fontSize: "0.88rem",
    backgroundColor: "#2a1a1e",
    border: "1px solid #5a2a2e",
    borderRadius: 8,
    padding: "10px 16px",
  },
  seccionJugador: {
    backgroundColor: "#1a1d27",
    border: "2px solid #f0c040",
    borderRadius: 10,
    padding: "12px 16px",
  },
  manoJugador: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "flex-end",
  },
  instruccion: {
    display: "block",
    marginTop: 10,
    color: "#8b90a8",
    fontSize: "0.78rem",
    textAlign: "center",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  overlayCaja: {
    backgroundColor: "#1a1d27",
    border: "2px solid #f0c040",
    borderRadius: 16,
    padding: "40px 48px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  overlayTitulo: {
    color: "#f0c040",
    fontSize: "2rem",
    fontWeight: 900,
    margin: 0,
  },
  overlayPuntos: {
    color: "#e8eaf0",
    fontSize: "1rem",
    margin: 0,
  },
  btnNueva: {
    backgroundColor: "#f0c040",
    color: "#0f1117",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};