import { useState } from 'react';

export default function Auth({ onLogin, showToast }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    const usersStr = localStorage.getItem('app_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (isRegistering) {
      // Check if user exists
      const exists = users.find(u => u.username === username);
      if (exists) {
        setErrorMsg('El usuario ya existe.');
        return;
      }
      
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem('app_users', JSON.stringify(users));
      setSuccessMsg('Usuario creado con éxito. Ahora inicia sesión.');
      setIsRegistering(false);
      setPassword('');
      
    } else {
      // Default admin logic combined with real users
      if (username === 'admin' && password === '1234') {
        onLogin({ username });
        return;
      }
      
      const exists = users.find(u => u.username === username && u.password === password);
      if (exists) {
        onLogin({ username });
      } else {
        setErrorMsg('Usuario o contraseña incorrectos.');
        // Efecto shake manual simple en className (lo manejo con clases en body pero omitiremos en jsx directo si no hay lib, o simulamos)
      }
    }
  };

  return (
    <main className="glass-panel active" style={{ display: 'block', position: 'relative', margin: '0 auto' }}>
      <div className="header">
        <i className={`fa-solid ${isRegistering ? 'fa-user-plus' : 'fa-lock'} icon-large`}></i>
        <h1>{isRegistering ? 'Registro' : 'Inicia Sesión'}</h1>
        <p>{isRegistering ? 'Crea tu bóveda segura' : 'Accede a tu bóveda segura'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fa-solid fa-user"></i>
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div className="input-group" style={{ display: 'flex', alignItems: 'center' }}>
          <i className="fa-solid fa-key" style={{ position: 'absolute', left: '14px' }}></i>
          <input 
            type={showPass ? "text" : "password"}
            placeholder="Contraseña principal" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ paddingRight: '40px' }}
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)}
            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
          >
            <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} style={{ position: 'relative', left: 'auto', top: 'auto', transform: 'none' }}></i>
          </button>
        </div>
        
        {errorMsg && <p className="error-msg" style={{ display: 'block' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>{successMsg}</p>}
        
        <button type="submit" className="btn-primary">
          {isRegistering ? 'Registrarse' : 'Entrar'} <i className={`fa-solid ${isRegistering ? 'fa-check' : 'fa-arrow-right'}`}></i>
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
              setSuccessMsg('');
              setShowPass(false);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </main>
  );
}
