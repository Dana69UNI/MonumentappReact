import { createContext, useState, useContext } from 'react';

// 1. Creem el Context
const PendentsContext = createContext();

// 2. Creem el Provider
export function PendentsProvider({ children }) {
  const [pendents, setPendents] = useState([]);

  // Funció per afegir/treure (toggle)
  const togglePendent = (post) => {
    // Comprovem si ja existeix
    const exists = pendents.find(item => item.id === post.id);

    if (exists) {
      // Si existeix, el treiem
      setPendents(pendents.filter(item => item.id !== post.id));
    } else {
      // Si no existeix, l'afegim
      setPendents([...pendents, post]);
    }
  };

  // Funció per saber si està pendent
  const isPendent = (id) => {
    return pendents.some(item => item.id === id);
  };

  // 3. Retornem el Provider amb els valors compartits
  return (
    <PendentsContext.Provider value={{ pendents, togglePendent, isPendent }}>
      {children}
    </PendentsContext.Provider>
  );
}

// 4. Hook personalitzat per consumir-ho
export const usePendents = () => useContext(PendentsContext);
