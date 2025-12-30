import React from 'react';
import { supabase } from '../supabaseClient';

const Perfil = () => {

  const handleLogout = async () => {
    try {
      // 1. Tanquem sessió a Supabase
      await supabase.auth.signOut();
      
      // 2. Redirigim a l'arrel i refresquem per netejar qualsevol estat (inclòs "isGuest")
      window.location.href = "/";
    } catch (error) {
      console.error("Error tancant sessió:", error);
    }
  };

  // Estils ràpids integrats (Objecte d'estils)
  const styles = {
    container: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      fontFamily: 'var(--font-principal)' // Aprofitem les teves variables
    },
    btnVermell: {
      backgroundColor: '#FF4D4D', // Vermell intens
      color: 'white',
      border: 'none',
      padding: '12px 0',
      width: '80%',
      maxWidth: '300px',
      borderRadius: '10px',
      fontSize: '20px',
      fontFamily: 'var(--font-titols)', // Aprofitem les teves variables
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '40px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <h1>Perfil</h1>
      <p>Aquest apartat estarà disponible properament.</p>
      <p>Aquí podràs veure les teves estadístiques i editar les teves dades.</p>
      
      {/* BOTÓ TANCAR SESSIÓ */}
      <button style={styles.btnVermell} onClick={handleLogout}>
        Tancar Sessió
      </button>
    </div>
  );
}

export default Perfil;