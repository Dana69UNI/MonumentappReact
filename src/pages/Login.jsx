import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './LoginRegister.css';

// ICONES
import Tree from '../assets/icons/Tree.svg?react';
import Apple from '../assets/icons/Apple.svg?react';
import Google from '../assets/icons/Google.svg?react';

const Login = ({ onEntrarComaInvitat, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // LOGIN
  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      
      {/* DALT */}
      <div className="login-top">
        <Tree style={{ width: '40px', height: '40px', color: 'var(--negre)' }} />
        <p className="app-name">MonumentApp</p>
      </div>

      {/* MIG */}
      <div className="login-form-container">
        
        <h1 className="login-title">Iniciar sessió</h1>

        <input 
            type="email" 
            className={`login-input ${email.length > 0 ? 'omplert' : ''}`}
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input 
            type="password" 
            className={`login-input ${password.length > 0 ? 'omplert' : ''}`}
            placeholder="Contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <div className="forgot-pass-container">
            <span className="text-normal">No recordes la contrasenya? </span>
            <span className="text-link">Recupera-la</span>
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {/* BOTÓ LOGIN */}
        <button className="btn-principal" onClick={handleLogin} disabled={loading}>
            {loading ? "Carregant..." : "Iniciar"}
        </button>

        {/* BOTÓ INVITAT */}
        <button className="btn-invitat" onClick={onEntrarComaInvitat}>
            Entrar com a invitat
        </button>

        {/* SOCIALS */}
        <p className="text-continue">O bé continua amb</p>
        
        <div className="socials-container">
            <button className="btn-social">
                <Google style={{ width: '30px', height: '30px', color: 'var(--negre)' }} />
                <span>Google</span>
            </button>
            <button className="btn-social">
                <Apple style={{ width: '30px', height: '30px', color: 'var(--negre)' }} />
                <span>Apple</span>
            </button>
        </div>

      </div>

      {/* BAIX (ENLLAÇ A REGISTRE) */}
      <div className="login-bottom">
        <p className="text-no-sessio">No tens sessió?</p>
        <button className="btn-registrat" onClick={onGoToRegister}>
            Registra't
        </button>
      </div>

    </div>
  );
};

export default Login;