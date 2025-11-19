import { useState } from 'react'
import { useEffect } from 'react'
const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom)&order=id.asc';
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


  return (
    <>
     {posts.map((post) => (
          <article key={post.id}>
            <h3>{post.arbres?.nom}</h3>
            <p>{post.descripcio}</p>
          </article>
        ))}
    </>
  )
}

export default HomePage
