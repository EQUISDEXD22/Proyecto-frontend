import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Layout
 * 
 * Estructura principal de la aplicación autenticada.
 * Muestra el sidebar de navegación lateral.
 * El sidebar adapta su contenido al rol del usuario.
 */

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFF8F3' }}>
          {/* Todo el menu lateral */}
      <aside className="w-56 flex flex-col" style={{ backgroundColor: '#F97316', minHeight: '100vh' }}>
        <div className="px-6 py-6 border-b border-orange-400">
          <h1 className="text-white font-semibold text-lg tracking-wide">Apptestados</h1>
          <p className="text-orange-100 text-xs mt-1">{user?.nombre} {user?.apellidos}</p>
          <span className="text-orange-200 text-xs capitalize">{user?.rol}</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <NavLink to="/" end className={({ isActive }) =>
            `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
          }>
            Dashboard
          </NavLink>

          <NavLink to="/formularios" className={({ isActive }) =>
            `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
          }>
            Formularios
          </NavLink>

          <NavLink to="/fichaje" className={({ isActive }) =>
            `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
          }>
            Fichaje
          </NavLink>

          {user?.rol === 'admin' && (
            <NavLink to="/usuarios" className={({ isActive }) =>
              `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
            }>
              Usuarios
            </NavLink>
            
          )}

          {user?.rol === 'admin' && (
            <NavLink to="/tipos-formulario" className={({ isActive }) =>
              `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
            }>
              Tipos de formulario
            </NavLink>
          )}

          {user?.rol === 'admin' && (
            <NavLink to="/auditoria" className={({ isActive }) =>
              `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-500'}`
            }>
              Auditoría
            </NavLink>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-orange-400">
          <button onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-orange-100 hover:bg-orange-500 rounded transition text-left">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ backgroundColor: '#FFF8F3' }}>
        <Outlet />
      </main>
    </div>
  );
}