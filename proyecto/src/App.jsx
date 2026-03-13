import GameFeed from "./components/GameFeed";
import Header from "./components/header";
import { AuthProvider } from "./components/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app">

        {/* Barra superior - Jesús */}
        <Header />

        {/* Cuerpo principal */}
        <div className="app__body">
          <main className="app__main">
            {/* Feed de juegos con Tetris integrado */}
            <GameFeed />
          </main>
        </div>

      </div>
    </AuthProvider>
  );
}

export default App;