import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ESTADO_COLORS = {
  borrador:  'bg-gray-100 text-gray-600',
  enviado:   'bg-blue-50 text-blue-600',
  valido:    'bg-green-50 text-green-600',
  denegado:  'bg-red-50 text-red-600',
};

export default function Formularios() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => { cargarFormularios(); }, [filtroEstado]);

  const cargarFormularios = async () => {
    try {
      const params = filtroEstado ? { estado: filtroEstado } : {};
      const res = await api.get('/formularios', { params });
      setFormularios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/formularios/${id}/estado`, { estado });
      cargarFormularios();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Formularios</h2>
        {(user?.rol === 'agente' || user?.rol === 'admin') && (
          <button onClick={() => navigate('/formularios/nuevo')}
            className="text-sm text-white px-4 py-2 rounded transition"
            style={{ backgroundColor: '#F97316' }}>
            Nuevo formulario
          </button>
        )}
      </div>

      <div className="mb-4">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
          <option value="">Todos los formularios</option>
          <option value="borrador">Borrador</option>
          <option value="enviado">Enviado</option>
          <option value="valido">Válido</option>
          <option value="denegado">Denegado</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando</p>
      ) : formularios.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay formularios disponibles</p>
      ) : (
        <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Título</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Fecha</th>
                {(user?.rol === 'supervisor' || user?.rol === 'admin') && (
                  <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {formularios.map(f => (
                <tr key={f.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{f.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.tipo_formulario?.nombre || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.usuario?.nombre} {f.usuario?.apellidos}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${ESTADO_COLORS[f.estado]}`}>
                      {f.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(f.created_at).toLocaleDateString('es-ES')}
                  </td>
                  {(user?.rol === 'supervisor' || user?.rol === 'admin') && (
                    <td className="px-6 py-4 space-x-2">
                      {f.estado === 'enviado' && (
                        <>
                          <button onClick={() => cambiarEstado(f.id, 'valido')}
                            className="text-xs text-green-600 hover:text-green-800 transition">
                            Validar
                          </button>
                          <button onClick={() => cambiarEstado(f.id, 'denegado')}
                            className="text-xs text-red-500 hover:text-red-700 transition">
                            Denegar
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}