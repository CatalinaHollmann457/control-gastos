import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      navigate('/gastos');
    } else {
      alert(data.mensaje);
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={manejarEnvio}>
        <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        <button type="submit">Iniciar Sesión</button>
        <div className="switch-screen">
          ¿No tienes cuenta? <span className="link" onClick={() => navigate('/registro')}>Crear Cuenta</span>
        </div>
      </form>
    </div>
  );
}