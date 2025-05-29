import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [formulario, setFormulario] = useState({ fecha: '', categoria: '', descripcion: '', monto: '' });
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/api/gastos', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setGastos(data.mis_gastos || []);
        const t = data.mis_gastos?.reduce((acc, g) => acc + g.monto, 0) || 0;
        setTotal(t);
      });
  }, []);

  const manejarCambio = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/gastos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        ...formulario,
        monto: parseFloat(formulario.monto)
      })
    });
    const data = await res.json();
    if (res.ok) {
      setGastos(prev => [...prev, { ...formulario, monto: parseFloat(formulario.monto) }]);
      setTotal(prev => prev + parseFloat(formulario.monto));
      setFormulario({ fecha: '', categoria: '', descripcion: '', monto: '' });
    } else {
      alert(data.mensaje);
    }
  };

  const eliminarGasto = async (index, id, monto) => {
    const res = await fetch(`http://localhost:3000/api/gastos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    if (res.ok) {
      const nuevos = gastos.filter((_, i) => i !== index);
      setGastos(nuevos);
      setTotal(prev => prev - monto);
    }
  };

  return (
    <div className="container">
      <h1>Mis Gastos</h1>
      <form onSubmit={manejarEnvio}>
        <input type="date" name="fecha" value={formulario.fecha} onChange={manejarCambio} required />
        <select name="categoria" value={formulario.categoria} onChange={manejarCambio} required>
          <option value="" disabled>Selecciona categoría</option>
          <option>Shopping</option>
          <option>Farmacia</option>
          <option>Nafta</option>
          <option>Supermercado</option>
          <option>Comida</option>
          <option>Transporte</option>
          <option>Entretenimiento</option>
          <option>Salud</option>
          <option>Otros</option>
        </select>
        <input type="text" name="descripcion" placeholder="Descripción (opcional)" value={formulario.descripcion} onChange={manejarCambio} />
        <input type="number" name="monto" placeholder="Monto" value={formulario.monto} onChange={manejarCambio} required />
        <button type="submit">Guardar Gasto</button>
      </form>
      <h2>Historial</h2>
      <div id="gastos-list">
        {gastos.map((g, i) => (
          <div className="gasto-item" key={i}>
            {g.fecha} - {g.categoria}: ${g.monto.toFixed(2)}
            <button onClick={() => eliminarGasto(i, g.id, g.monto)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div className="total">Total: ${total.toFixed(2)}</div>
      <button id="logout" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Cerrar Sesión</button>
    </div>
  );
}
