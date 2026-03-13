import GameFeed from "./components/GameFeed";
import Header from "./components/header";
import { AuthProvider } from "./components/AuthContext";
import "./App.css";
import Footer from "./components/Footer";

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
      {/* Footer - Andres Sanchez */}
      <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;