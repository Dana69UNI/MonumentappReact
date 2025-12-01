import { useState } from 'react'
import { useEffect } from 'react'
import Header from '../components/header'
import './HomePage.css'

import { Link } from 'react-router-dom' //para convertir la caja "article" en un link clickable



const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom,alcada,gruix,capcal)&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q'

function HomePage() {
  
 
const [posts, setPosts] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`
          }
        });
        const data = await response.json();
        setPosts(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(); 
    
  }, []); 

  

  if (loading) {
    return <p>Carregant Arbres...</p>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }


  const items = [
    { id: 1, text: "Texto 1", img: "#" },
    { id: 2, text: "Texto 2", img: "#" },
    { id: 3, text: "Texto 3", img: "#" },
  ];


  return (
    <>
    <Header />

  <div>
      <h3 className='TituloArbresRecomentas'>Arbres recomenats</h3>
      <div className="carousel-scroll">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.img} alt="" />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
  </div>
    
  {/* Div on es mostren tots els arbres */}
          <div className='arbresRecomenats'>
              {posts.map((post) => (
                  <Link
                      to={`/arbre/${post.arbre_id}`}
                      key={post.id}
                      style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                      <article className='arbresArticles'>
                          <h3>{post.arbres?.nom}</h3>
                          <p>{post.descripcio}</p>
                          <ul>
                              <li>Alçada: {post.arbres?.alcada}m</li>
                              <li>Gruix: {post.arbres?.gruix}m</li>
                              <li>Capçal: {post.arbres?.capcal}m</li>
                          </ul>
                      </article>
                  </Link>
              ))}
          </div>

     
    </>
  )
}

export default HomePage
