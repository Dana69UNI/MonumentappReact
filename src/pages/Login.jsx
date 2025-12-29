import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

// ICONES
import Tree from '../assets/icons/Tree.svg?react';
import Apple from '../assets/icons/Apple.svg?react';
import Google from '../assets/icons/Google.svg?react';

const Login = ({ onEntrarComaInvitat }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Estat per saber si estem fent Login o Registre
  const [isRegistering, setIsRegistering] = useState(false);

  // Gestió de l'enviament (Login o Registre)
  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    let error = null;

    if (isRegistering) {
      // REGISTRE
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        error = signUpError;
      } else {
        alert('Revisa el teu correu per confirmar el registre!');
        setIsRegistering(false); // Tornem al login
      }
    } else {
      // LOGIN
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    }

    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      
      {/* --- BLOC DALT (LOGO) --- */}
      <div className="login-top">
        <Tree style={{ width: '40px', height: '40px', color: 'var(--negre)' }} />
        <p className="app-name">MonumentApp</p>
      </div>


      {/* --- BLOC MIG (FORMULARI) --- */}
      <div className="login-form-container">
        
        {/* Títol dinàmic */}
        <h1 className="login-title">
            {isRegistering ? "Crear compte" : "Iniciar sessió"}
        </h1>

        {/* INPUT EMAIL */}
        <input 
            type="email" 
            className={`login-input ${email.length > 0 ? 'omplert' : ''}`}
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        {/* INPUT PASSWORD */}
        <input 
            type="password" 
            className={`login-input ${password.length > 0 ? 'omplert' : ''}`}
            placeholder="Contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        {/* Text recuperació (només visible en Login) */}
        {!isRegistering && (
            <div className="forgot-pass-container">
                <span className="text-normal">No recordes la contrasenya? </span>
                <span className="text-link">Recupera-la</span>
            </div>
        )}

        {/* Missatge d'error si n'hi ha */}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {/* BOTÓ PRINCIPAL (Iniciar / Crear) */}
        <button className="btn-principal" onClick={handleAuth} disabled={loading}>
            {loading ? "Carregant..." : (isRegistering ? "Registrar-se" : "Iniciar")}
        </button>

        {/* BOTÓ INVITAT (Outline) */}
        <button className="btn-invitat" onClick={onEntrarComaInvitat}>
            Entrar com a invitat
        </button>

        {/* SECCIÓ SOCIALS */}
        <p className="text-continue">O bé continua amb</p>
        
        <div className="socials-container">
            {/* GOOGLE */}
            <button className="btn-social">
                <Google style={{ width: '30px', height: '30px', color: 'var(--negre)' }} />
                <span>Google</span>
            </button>
            
            {/* APPLE */}
            <button className="btn-social">
                <Apple style={{ width: '30px', height: '30px', color: 'var(--negre)' }} />
                <span>Apple</span>
            </button>
        </div>

      </div>


      {/* --- BLOC BAIX (REGISTRE TOGGLE) --- */}
      <div className="login-bottom">
        <p className="text-no-sessio">
            {isRegistering ? "Ja tens compte?" : "No tens sessió?"}
        </p>
        <button className="btn-registrat" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Inicia sessió" : "Registra't"}
        </button>
      </div>

    </div>
  );
};

export default Login;