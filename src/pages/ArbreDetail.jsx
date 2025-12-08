import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useVisited } from '../context/contextVisitats'

const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom, alcada, gruix, capcal)&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q'

function ArbreDetail() {
  const { id } = useParams() // id = arbre_id desde HomePage
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toggleVisited, isVisited } = useVisited();
  useEffect(() => {
  if (!id) return
  const fetchDetail = async () => {
    try {
      const url = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&arbre_id=eq.${id}&select=id,descripcio,arbre_id,arbres(nom, alcada, gruix, capcal)&order=id.asc`;
      const res = await fetch(url, {
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`
        }
      })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      setItem(data[0] ?? null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  fetchDetail()
}, [id])


  if (loading) return <p>Carregant...</p>
  if (error) return <div className="error-message">Error: {error}</div>
  if (!item) return <div>No s'ha trobat l'arbre</div>

  const arbre = item.arbres ?? {}
  // intenta varios nombres de campo comunes para la imagen (ajusta si tu campo tiene otro nombre)
  const image = arbre?.imatge


  return (
    
    <div className="arbre-detail">
      <button onClick={() => navigate(-1)} className="back-button">Go back</button>
      <button onClick={() => toggleVisited(item)} style={{ backgroundColor: isVisited(item.id) ? 'green' : 'grey' }}>
      {isVisited(item.id) ? '✔ Marcat com a visitat' : '○ Marcar com a visitat'} </button>

      {image ? <img src={image} alt={arbre.nom ?? 'Arbre'} /> : null}
      <h1>{arbre.nom}</h1>
      <p>{item.descripcio || arbre.descripcio}</p>

      {/* Aquí mostramos exactament les mateixes parts del <ul> que tens en HomePage */}
      <ul>
        <li>Alçada: {arbre?.alcada}m</li>
        <li>Gruix: {arbre?.gruix}m</li>
        <li>Capçal: {arbre?.capcal}m</li>
      </ul>
    </div>
  )
}

export default ArbreDetail
