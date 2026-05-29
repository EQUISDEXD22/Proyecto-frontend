import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Usuario: {user?.nombre}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-orange-100 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Usuario actual</p>
          <p className="text-lg font-medium text-gray-800 capitalize mt-1">{user?.rol}</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-100 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Fecha</p>
          <p className="text-lg font-medium text-gray-800 mt-1">{new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}