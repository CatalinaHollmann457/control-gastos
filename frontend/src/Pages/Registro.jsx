import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registro() {
  const [formulario, setFormulario] = useState({ nombre: '', apellido: '', email: '', contrasena: '', confirmar: '' });
  const navigate = useNavigate();

  const manejarCambio = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        contrasena: formulario.contrasena,
        confirmar_contrasena: formulario.confirmar
      })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registro exitoso');
      navigate('/');
    } else {
      alert(data.mensaje);
    }
  };
  return (
    <div className="container">
      <h1>Registro</h1>
      <form onSubmit={manejarEnvio}>
        <input name="nombre" type="text" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} required />
        <input name="apellido" type="text" placeholder="Apellido" value={formulario.apellido} onChange={manejarCambio} required />
        <input name="email" type="email" placeholder="Correo Electrónico" value={formulario.email} onChange={manejarCambio} required />
        <input name="contrasena" type="password" placeholder="Contraseña" value={formulario.contrasena} onChange={manejarCambio} required />
        <input name="confirmar" type="password" placeholder="Confirmar Contraseña" value={formulario.confirmar} onChange={manejarCambio} required />
        <button type="submit">Registrarse</button>
        <button type="button" onClick={() => navigate('/')}>Volver</button>
      </form>
    </div>
  );
}