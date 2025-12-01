import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?select=id,descripcio,arbre_id,arbres(nom,alcada,gruix,capcal)&id=eq.'
const API_KEY = 'TU_API_KEY'

function ArbreDetail() {
 

  return (
	<h1>DIOMIO</h1>
  )
}

export default ArbreDetail
