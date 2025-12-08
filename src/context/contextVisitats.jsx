import { createContext, useState, useContext } from 'react';

// 1. Creem el Context (el "tub")
const VisitedContext = createContext();

// 2. Creem el Provider (el component que "injecta" les dades)
export function VisitedProvider({ children }) {
  const [visited, setVisited] = useState([]);

  // Funció per afegir/treure (toggle)
  const toggleVisited = (post) => {
    // Comprovem si ja existeix
    const exists = visited.find(item => item.id === post.id);
    
    if (exists) {
      // Si existeix, el treiem
      setVisited(visited.filter(item => item.id !== post.id));
    } else {
      // Si no existeix, l'afegim
      setVisited([...visited, post]);
    }
  };

  // Funció per saber si està visitat
  const isVisited = (id) => {
    return visited.some(item => item.id === id);
  };

  // 3. Retornem el Provider amb els valors que volem compartir
  return (
    <VisitedContext.Provider value={{ visited, toggleVisited, isVisited }}>
      {children}
    </VisitedContext.Provider>
  );
}

// 4. Hook personalitzat per consumir-ho fàcil
export const useVisited = () => useContext(VisitedContext);
