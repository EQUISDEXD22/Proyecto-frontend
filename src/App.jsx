import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Formularios from './pages/Formularios';
import NuevoFormulario from './pages/NuevoFormulario';
import Usuarios from './pages/Usuarios';
import Fichaje from './pages/Fichaje';
import TiposFormulario from './pages/TiposFormulario';
import Layout from './components/Layout';

/**
 * Define las rutas usando React Router.
 * 
 * Estructura de rutas:
 * /login - Login (pública)
 * / - Dashboard (autenticada)
 * /formularios - Listado de formularios (autenticada)
 * /formularios/nuevo - Crear formulario (autenticada)
 * /fichaje - Fichaje (autenticada)
 * /usuarios - Gestión de usuarios (solo admin)
 * /tipos-formulario → Tipos de formulario (solo admin)
 */
function RutaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function RutaAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.rol === 'admin' ? children : <Navigate to="/" />;
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
        <Route path="fichaje" element={<Fichaje />} />
        {/* Rutas de administrador */}
        <Route path="usuarios" element={<RutaAdmin><Usuarios /></RutaAdmin>} />
        <Route path="tipos-formulario" element={<RutaAdmin><TiposFormulario /></RutaAdmin>} />
      </Route>
    </Routes>
  );
}