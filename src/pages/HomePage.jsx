import { useState, useEffect } from 'react';
import Header from '../components/header';
import './HomePage.css';

const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom)&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

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
    return <p className="loading-message">Carregant Arbres...</p>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Using first 3 items from posts for the carousel
  const carouselItems = posts ? posts.slice(0, 3) : [];
  // Using first item for "REPTE DEL MES"
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="carousel-section">
          <h3 className="section-title">Arbres recomenats</h3>
          <div className="carousel-scroll">
            {carouselItems.map((item) => (
              <div className="card" key={item.id}>
                <div className="card-image-placeholder">
                  <div className="placeholder-icon"></div>
                </div>
                <p className="card-text">{item.arbres?.nom}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section - REPTE DEL MES */}
        
          <div className="featured-section">
            <h3 className="featured-title">REPTE DEL MES</h3>
            <p className="featured-subtitle">
              aqui aniria la descripcio si haguessim fet el fetch
            </p>
            <div className="featured-content">
              <div className="featured-image">
                <div className="image-placeholder">
                  <div className="placeholder-icon-large"></div>
                </div>
              </div>
              <div className="featured-details">
                <h4 className="featured-tree-name">Nom si fetch</h4>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span className="detail-text">localitzacio si hagues fetch</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Alçaria:</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Capçal:</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Volt del canó:</span>
                </div>
              </div>
            </div>
          </div>

        {/* All Posts Section 
        <div className="posts-section">
          {posts && posts.map((post) => (
            <article key={post.id} className="post-article">
              <h3>{post.arbres?.nom}</h3>
              <p>{post.descripcio}</p>
            </article>
          ))}
            
        </div>
        */}
      </div>
    </>
  );
}

export default HomePage;