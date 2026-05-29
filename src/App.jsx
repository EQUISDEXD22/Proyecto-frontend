import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Formularios from './pages/Formularios';
import NuevoFormulario from './pages/NuevoFormulario';
import Usuarios from './pages/Usuarios';
import Fichaje from './pages/Fichaje';
import Layout from './components/Layout';
import TiposFormulario from './pages/TiposFormulario';

function RutaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) 
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <RutaProtegida>
          <Layout />
        </RutaProtegida>
      }>
        <Route index element={<Dashboard />} />
        <Route path="formularios" element={<Formularios />} />
        <Route path="formularios/nuevo" element={<NuevoFormulario />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="fichaje" element={<Fichaje />} />
        <Route path="tipos-formulario" element={<TiposFormulario />} />
      </Route>
    </Routes>
  );
}