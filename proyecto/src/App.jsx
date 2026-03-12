
import { useState } from 'react';
import { SearchBar } from './components/barrabusqueda';
import './App.css';

// Datos de ejemplo
const SAMPLE_ITEMS = [
  { name: 'React', description: 'Biblioteca JavaScript' },
  { name: 'Vue', description: 'Framework progresivo' },
  { name: 'Angular', description: 'Framework completo' },
  { name: 'Svelte', description: 'Compilador de componentes' },
  { name: 'Next.js', description: 'Framework de React' },
  { name: 'Nuxt', description: 'Framework de Vue' },
  { name: 'Astro', description: 'SSR moderno' },
  { name: 'Node.js', description: 'Runtime JavaScript' },
  { name: 'TypeScript', description: 'JavaScript tipado' },
  { name: 'Webpack', description: 'Bundler de módulos' },
];

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearch, setLastSearch] = useState('');

  const handleSearch = (results, searchTerm) => {
    setSearchResults(results);
    setLastSearch(searchTerm);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mi Aplicación</h1>
        <p className="subtitle">Prueba la barra de búsqueda</p>
      </header>

      <main className="app-main">
        <section className="search-section">
          <SearchBar
            items={SAMPLE_ITEMS}
            onSearch={handleSearch}
            placeholder="Busca tecnologías..."
          />
        </section>

        {lastSearch && (
          <section className="results-section">
            <h2>Resultados de búsqueda</h2>
            {searchResults.length > 0 ? (
              <div className="results-grid">
                {searchResults.map((item, index) => (
                  <div key={index} className="result-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results-message">No se encontraron resultados</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
