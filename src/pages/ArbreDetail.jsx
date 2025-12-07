import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';
const BASE = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1';

function ArbreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // item: registro de "arbres_recomenats" si existe
  // arbre: objeto con los campos del árbol (puede venir dentro de item.arbres o venir directo)
  const [item, setItem] = useState(null);
  const [arbre, setArbre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null); // 'recom' | 'arbres'

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      setItem(null);
      setArbre(null);
      setSource(null);

      try {
        // 1) Intentamos buscar en la tabla de recomendados (mantener la lógica que ya tenías)
        const urlRec = `${BASE}/arbres_recomenats?recomenacio_estat=eq.true&arbre_id=eq.${id}&select=id,descripcio,arbre_id,arbres(nom,alcada,gruix,capcal,imatge,municipi,comarques(comarca))&order=id.asc`;
        let res = await fetch(urlRec, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const recData = await res.json();

        if (recData && recData.length > 0) {
          // Hay recomendación -> usamos esa como fuente principal
          const first = recData[0];
          setItem(first);
          setArbre(first.arbres ?? {});
          setSource('recom');
          setLoading(false);
          return;
        }

        // 2) Si no hay recomendación, buscamos directamente el árbol en la tabla "arbres"
        const urlArbre = `${BASE}/arbres?id=eq.${id}&select=id,nom,alcada,gruix,capcal,imatge,municipi,comarques(comarca)`;
        res = await fetch(urlArbre, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const arbreData = await res.json();

        if (arbreData && arbreData.length > 0) {
          setArbre(arbreData[0]);
          setSource('arbres');
        } else {
          // No existe el árbol
          setArbre(null);
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "Error unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <p>Carregant...</p>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!arbre) return <div>No s'ha trobat l'arbre</div>;

  // Buscar posible imagen en varios campos
  const image = arbre?.imatge || arbre?.imagen || arbre?.image || arbre?.foto || arbre?.url || '';

  return (
    <div className="arbre-detail">
      <button onClick={() => navigate(-1)} className="back-button">Go back</button>

      {image ? <img src={image} alt={arbre.nom ?? 'Arbre'} /> : null}

      <h1>{arbre.nom}</h1>

      {/* Si venimos de recomendados, mostramos la descripción del item; si no, mostramos la del propio árbol si existe */}
      <p>{(item && item.descripcio) || arbre.descripcio || 'Sense descripció'}</p>

      <ul>
        <li>Alçada: {arbre?.alcada ?? '—'} m</li>
        <li>Gruix: {arbre?.gruix ?? '—'} m</li>
        <li>Capçal: {arbre?.capcal ?? '—'} m</li>
        {arbre.municipi && <li>Municipi: {arbre.municipi}</li>}
        {arbre.comarques?.comarca && <li>Comarca: {arbre.comarques.comarca}</li>}
      </ul>

      <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        <em>Font: {source === 'recom' ? 'arbres_recomenats' : 'arbres'}</em>
      </div>
    </div>
  );
}

export default ArbreDetail;
