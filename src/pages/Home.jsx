import { useState, useEffect } from 'react';
import Header from '../components/header';
import './Home.css';
import { Link } from 'react-router-dom';

// === APIs ===
const API_RECOMENATS = "https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom,alcada,gruix,capcal)&order=id.asc";
const API_RECOMENATS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q";

const API_REPTE = "https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?mes=eq.2025-12-01&select=id,descripcio,arbre_id,arbres(nom,municipi,alcada,gruix,capcal,comarques(comarca))";
const API_REPTE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q";

const API_ULTIM = "URL_ULTIM";       // Chicos esto del último árbol visitado va con API??
const API_ULTIM_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q"; 

function HomePage() {
  // Carrusel
  const [items, setItems] = useState([]);
  // Repte del mes
  const [repte, setRepte] = useState(null);
  // Últim arbre visitat
  const [ultim, setUltim] = useState(null);
  // Loading
  const [loading, setLoading] = useState(true);

  // Fetch genérico con headers
  const fetchAPI = async (url, key) => {
    try {
      const res = await fetch(url, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      return await res.json();
    } catch (e) {
      console.error("Error:", e);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // 1) Arbres recomenats para carrusel
      const recom = await fetchAPI(API_RECOMENATS, API_RECOMENATS_KEY);
      if (recom) {
        const carouselData = recom.map((item) => ({
          id: item.id,
          arbre_id: item.arbre_id,
          text: item.arbres?.nom,
          img: item.arbres?.capcal || "#", // Ajusta según campo imagen real
        }));
        setItems(carouselData);
      }

      // 2) Repte del mes
      const repteRes = await fetchAPI(API_REPTE, API_REPTE_KEY);
      if (repteRes) setRepte(repteRes[0]);

      // 3) Últim arbre visitat
      const ultimRes = await fetchAPI(API_ULTIM, API_ULTIM_KEY);
      if (ultimRes) setUltim(ultimRes[0]);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <p>Carregant...</p>;

  return (
    <>
      <Header />

      {/* Carrusel */}
      <div>
        <h3 className='TituloArbresRecomentas'>Arbres recomenats</h3>
        <div className="carousel-scroll">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/arbre/${item.arbre_id}`}
              className="card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={item.img}  />
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Reto del mes*/}
      <section className="Grup_RepteDelMes">
        <h3 className="Titol_Repte">Repte del mes</h3>

        {repte && repte.arbres && (
          <div className="Info_Repte">
            {repte.imatge && (
              <img
                src={repte.imatge}
                alt={repte.arbres.nom}
                className="Imatge_Repte"
              />
            )}
            <div className="Dades_Repte">
              <h4>{repte.arbres.nom}</h4>
              {repte.descripcio && <p>{repte.descripcio}</p>}
              {repte.arbres.municipi && <p>{repte.arbres.municipi}</p>}
              {repte.arbres.comarques?.comarca && <p>{repte.arbres.comarques.comarca}</p>}
              <ul>
                <li>Alçada: {repte.arbres.alcada} m</li>
                <li>Gruix: {repte.arbres.gruix} m</li>
                <li>Capçal: {repte.arbres.capcal} m</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Diario */}
      <section className="Grup_Diari">
        <h3 className="Titol_Diari">Diari</h3>
        <div className="PuntsDiari">
          {[...Array(120)].map((_, i) => (
            <span key={i} className="punt"></span>
          ))}
        </div>
      </section>

      {/* Último arbol visitado, esta puesto como si cogiese de una API (gracias al chatGPT) */}
      <section className="Grup_UltimArbreVisitat">
        <h3 className="Titol_UltimArbre">Últim arbre visitat</h3>
        {ultim ? (
          <>
            <p className="Data_Ultim">{ultim.data_visita}</p>
            <p className="Descripcio_Ultim">{ultim.descripcio}</p>
            <div className="Info_Ultim">
              {ultim.imatge && (
                <img src={ultim.imatge} alt={ultim.nom} className="Imatge_Ultim" />
              )}
              <div className="Detalls_Ultim">
                <h3>{ultim.nom}</h3>
                {ultim.localitzacio && <p>{ultim.localitzacio}</p>}
                <ul>
                  <li>Alçada: {ultim.alcada}m</li>
                  <li>Gruix: {ultim.gruix}m</li>
                  <li>Capçal: {ultim.capcal}m</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p>No hi ha dades de l'últim arbre visitat.</p>
        )}
      </section>
    </>
  );
}

export default HomePage;
