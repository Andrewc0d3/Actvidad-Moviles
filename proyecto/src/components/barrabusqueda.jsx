import { useState, useMemo } from 'react';
import './barraBusqueda.css';

export function SearchBar({ items = [], onSearch, placeholder = "Buscar..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      // Buscar en propiedades: name, title, label, description
      if (typeof item === 'string') {
        return item.toLowerCase().includes(searchLower);
      }
      
      const text = Object.values(item)
        .join(' ')
        .toLowerCase();
      
      return text.includes(searchLower);
    });
  }, [searchTerm, items]);

  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      if (value.trim()) {
        onSearch(filteredItems, value);
      } else {
        onSearch([], '');
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch([], '');
    }
  };

  const handleItemClick = (item) => {
    if (typeof item === 'string') {
      setSearchTerm(item);
    } else if (item.name) {
      setSearchTerm(item.name);
    } else if (item.title) {
      setSearchTerm(item.title);
    }
    setIsActive(false);
  };

  return (
    <div className="search-bar-container">
      <div className={`search-bar ${isActive ? 'active' : ''}`}>
        <svg className="search-icon" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 200)}
          placeholder={placeholder}
          className="search-input"
        />
        
        {searchTerm && (
          <button className="clear-btn" onClick={handleClear} title="Limpiar búsqueda">
            ✕
          </button>
        )}
      </div>

      
      {isActive && searchTerm.trim() && filteredItems.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <span className="result-count">{filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}</span>
          </div>
          <ul className="results-list">
            {filteredItems.slice(0, 8).map((item, index) => (
              <li
                key={index}
                onClick={() => handleItemClick(item)}
                className="result-item"
              >
                <span className="result-icon">📌</span>
                <span className="result-text">
                  {typeof item === 'string' ? item : item.name || item.title || JSON.stringify(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      
      {isActive && searchTerm.trim() && filteredItems.length === 0 && items.length > 0 && (
        <div className="search-results">
          <div className="no-results">
            <span>No se encontraron resultados para "{searchTerm}"</span>
          </div>
        </div>
      )}
    </div>
  );
}
