import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ESTADO_COLORES = {
  borrador: 'bg-gray-100 text-gray-600',
  enviado:  'bg-blue-50 text-blue-600',
  valido:   'bg-green-50 text-green-600',
  denegado: 'bg-red-50 text-red-600',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarEstadisticas(); }, []);

  const cargarEstadisticas = async () => {
    try {
      const res = await api.get('/estadisticas');
      setDatos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Bienvenido, {user?.nombre}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-orange-100 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{datos.totales.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-100 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Borradores</p>
              <p className="text-2xl font-semibold text-gray-500 mt-1">{datos.totales.borrador}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-100 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Enviados</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">{datos.totales.enviado}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-100 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Validos</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{datos.totales.valido}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-100 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Denegados</p>
              <p className="text-2xl font-semibold text-red-500 mt-1">{datos.totales.denegado}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Últimos formularios</h3>
              <button onClick={() => navigate('/formularios')}className="text-xs text-orange-500 hover:text-orange-700 transition">Ver todos</button>
            </div>

            {datos.ultimos.length === 0 ? (
              <p className="text-gray-400 text-sm p-6">No hay formularios todavia</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Título</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Tipo</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Estado</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {datos.ultimos.map(f => (
                    <tr key={f.id} className="hover:bg-orange-50 transition">
                      <td className="px-6 py-3 text-sm text-gray-800">{f.titulo}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{f.tipo_formulario?.nombre || '—'}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded capitalize ${ESTADO_COLORES[f.estado]}`}>
                          {f.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400">
                        {new Date(f.created_at).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}