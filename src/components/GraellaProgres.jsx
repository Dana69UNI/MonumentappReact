import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GraellaProgres.css';

import TreeIcon from '../assets/icons/Tree.svg?react';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';
const URL_VISITATS = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?es_visitat=eq.true&select=arbre_id';
const TOTAL_ARBRES = 234;

const GraellaProgres = () => {
  const navigate = useNavigate();
  const [visitedIds, setVisitedIds] = useState(new Set());
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(URL_VISITATS, {
          method: "GET",
          headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        const ids = new Set(data.map(item => item.arbre_id));
        setVisitedIds(ids);
      } catch (error) {
        console.error("Error carregant graella:", error);
      }
    };
    fetchProgress();
  }, []);

  const caselles = Array.from({ length: TOTAL_ARBRES }, (_, i) => i + 1);

  return (
    <div className="graella-container">
      {caselles.map((id) => {
        const isVisited = visitedIds.has(id);

        return (
          <div 
            key={id} 
            className="graella-item"
            onClick={() => navigate(`/cercar/${id}`)} 
          >
            {isVisited ? (
              <TreeIcon className="icona-arbre-graella"/>            
            ) : (
              <div className="cercle-graella"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GraellaProgres;