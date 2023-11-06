import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio';
import Registro from './pages/Tabla';
import RegisterUser from './pages/RegisterUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/test" element={<Registro />} />
        <Route path="/user" element={<RegisterUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
