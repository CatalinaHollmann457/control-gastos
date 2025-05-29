import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IniciarSesion from './Pages/IniciarSesion';
import Registro from './Pages/Registro';
import Gastos from './Pages/Gastos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/gastos" element={<Gastos />} />
      </Routes>
    </Router>
  );
}

export default App;