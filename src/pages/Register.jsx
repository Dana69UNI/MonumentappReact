import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './LoginRegister.css'; // Compartim estils (Login.css ha d'incloure els estils nous que et vaig passar abans)

// ICONES
import Tree from '../assets/icons/Tree.svg?react';
import Apple from '../assets/icons/Apple.svg?react';
import Google from '../assets/icons/Google.svg?react';
import Fletxa from '../assets/icons/Enrere.svg?react'; // Per als desplegables

const Register = ({ onGoToLogin, onRegisterSuccess }) => {
  // Camps del formulari
  const [formData, setFormData] = useState({
    nom: '',
    cognoms: '',
    email: '',
    password: '',
    confirmPassword: '',
    edat: '',      // Ara serà un string numèric gestionat manualment
    comarca_id: '' 
  });

  // Dades per als selects
  const [llistaComarques, setLlistaComarques] = useState([]);

  // Gestió d'errors
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pop-up èxit
  const [showPopup, setShowPopup] = useState(false);

  // 1. CARREGAR COMARQUES
  useEffect(() => {
    const fetchComarques = async () => {
      const { data } = await supabase.from('comarques').select('id, comarca').order('comarca');
      if (data) setLlistaComarques(data);
    };
    fetchComarques();
  }, []);

  // 2. GESTIÓ INPUTS (Amb limitació d'edat)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // VALIDACIÓ ESPECÍFICA PER L'EDAT (Input Numèric)
    if (name === 'edat') {
        // Si està buit, deixem borrar
        if (value === '') {
            setFormData({ ...formData, edat: '' });
            return;
        }

        const numero = parseInt(value, 10);

        // Si no és un número, o és 0, o és més gran de 140 -> IGNORAR (no actualitzem l'estat)
        if (isNaN(numero) || numero <= 0 || numero > 140) {
            return; 
        }
        
        // Si passa el filtre, actualitzem
        setFormData({ ...formData, edat: value });
    } 
    else {
        // Resta de camps normals
        setFormData({ ...formData, [name]: value });
    }
    
    // Netegem l'error d'aquest camp si l'usuari escriu
    if (errors[name]) {
        setErrors({ ...errors, [name]: false });
    }
  };

  // 3. VALIDACIÓ I SUBMIT
  const handleRegister = async () => {
    setGlobalError(null);
    let newErrors = {};
    let hasError = false;

    // A. Validació Camps Buits (Tots menys edat)
    const requiredFields = ['nom', 'cognoms', 'email', 'password', 'confirmPassword', 'comarca_id'];
    requiredFields.forEach(field => {
        if (!formData[field]) {
            newErrors[field] = true;
            hasError = true;
        }
    });

    // B. Validació Email (@)
    if (formData.email && !formData.email.includes('@')) {
        newErrors.email = true;
        hasError = true;
    }

    // C. Validació Contrasenyes iguals
    if (formData.password !== formData.confirmPassword) {
        newErrors.password = true;
        newErrors.confirmPassword = true;
        setGlobalError("Les contrasenyes no coincideixen.");
        hasError = true;
    }

    if (hasError) {
        setErrors(newErrors);
        if (!globalError) setGlobalError("Si us plau, revisa els camps marcats en vermell.");
        return;
    }

    // 4. REGISTRE A SUPABASE
    setLoading(true);
    
    // Passem les dades extra a 'options.data'. 
    // IMPORTANT: El Trigger SQL ha d'estar actualitzat per llegir aquests camps!
    const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                username: formData.email.split('@')[0], 
                nom: formData.nom,
                cognoms: formData.cognoms,
                // Si edat està buida passem null, sinó el número
                edat: formData.edat ? parseInt(formData.edat) : null, 
                comarca_id: parseInt(formData.comarca_id)
            }
        }
    });

    setLoading(false);

    if (error) {
        // AQUI ES GESTIONA L'ERROR DE CORREU DUPLICAT
        // Supabase sol retornar: "User already registered"
        setGlobalError(error.message); 
    } else {
        // ÈXIT! NOMÉS SI NO HI HA ERROR
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
            onRegisterSuccess(); 
        }, 5000);
    }
  };

  return (
    <div className="login-page-container">
      
      {/* HEADER: (Pots descomentar-lo si el vols) */}
      {/* <div className="login-top">
        <Tree style={{ width: '40px', height: '40px', color: 'var(--negre)' }} />
        <p className="app-name">MonumentApp</p>
      </div> */}

      <div className="login-form-container">
        <h1 className="login-title">Registrar-se</h1>

        {/* --- INPUTS --- */}
        
        {/* NOM */}
        <input type="text" name="nom" placeholder="Nom"
            className={`login-input ${formData.nom ? 'omplert' : ''} ${errors.nom ? 'error' : ''}`}
            value={formData.nom} onChange={handleChange}
        />
        
        {/* COGNOMS */}
        <input type="text" name="cognoms" placeholder="Cognoms"
            className={`login-input ${formData.cognoms ? 'omplert' : ''} ${errors.cognoms ? 'error' : ''}`}
            value={formData.cognoms} onChange={handleChange}
        />

        {/* EMAIL */}
        <input type="email" name="email" placeholder="Correu electrònic"
            className={`login-input ${formData.email ? 'omplert' : ''} ${errors.email ? 'error' : ''}`}
            value={formData.email} onChange={handleChange}
        />

        {/* PASSWORD */}
        <input type="password" name="password" placeholder="Contrasenya"
            className={`login-input ${formData.password ? 'omplert' : ''} ${errors.password ? 'error' : ''}`}
            value={formData.password} onChange={handleChange}
        />

        {/* REPEAT PASSWORD */}
        <input type="password" name="confirmPassword" placeholder="Repeteixi la contrasenya"
            className={`login-input ${formData.confirmPassword ? 'omplert' : ''} ${errors.confirmPassword ? 'error' : ''}`}
            value={formData.confirmPassword} onChange={handleChange}
        />

        {/* --- DESPLEGABLES / INPUTS ESPECIALS --- */}

        {/* EDAT (ARA ÉS INPUT NUMÈRIC) */}
        {/* Fem servir 'login-input' normal però type number */}
        <input 
            type="number" 
            name="edat" 
            placeholder="Edat (opcional)"
            className={`login-input ${formData.edat ? 'omplert' : ''}`}
            value={formData.edat} 
            onChange={handleChange}
            inputMode="numeric" // Això obre el teclat numèric al mòbil
        />

        {/* COMARCA BASE (Obligatori) */}
        <div className="login-select-container">
            <select name="comarca_id" value={formData.comarca_id} onChange={handleChange}
                className={`login-select ${formData.comarca_id ? 'omplert' : 'placeholder'} ${errors.comarca_id ? 'error' : ''}`} 
                style={errors.comarca_id ? { borderColor: 'red', color: 'red' } : {}}
            >
                <option value="">Comarca base</option>
                {llistaComarques.map(c => <option key={c.id} value={c.id}>{c.comarca}</option>)}
            </select>
            <Fletxa className="select-arrow-login" />
        </div>


        {/* ERROR GLOBAL MSG */}
        {globalError && <p className="error-msg">{globalError}</p>}


        {/* BOTÓ REGISTRAR-SE */}
        <button className="btn-principal" onClick={handleRegister} disabled={loading}>
            {loading ? "Carregant..." : "Registrar-se"}
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

      {/* FOOTER */}
      <div className="login-bottom">
        <p className="text-no-sessio">Ja tens sessió?</p>
        <button className="btn-registrat" onClick={onGoToLogin}>
            Iniciar-la
        </button>
      </div>

      {/* POPUP ÈXIT */}
      {showPopup && (
        <div className="popup-overlay">
            <div className="popup-box">
                <Tree style={{ width: '50px', height: '50px', color: 'var(--blau)' }} />
                <p className="popup-text">
                    S'ha creat el compte correctament!
                    <br/><br/>
                    Revisa el teu correu per validar la sessió.
                </p>
            </div>
        </div>
      )}

    </div>
  );
};

export default Register;