
import { useState, useEffect } from 'react';
import api from '../api/axios';

const ACCION_COLORS = {
  crear:  'bg-green-50 text-green-600',
  editar: 'bg-blue-50 text-blue-600',
  estado: 'bg-orange-50 text-orange-600',
};

export default function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarAuditoria(); }, []);
  const cargarAuditoria = async () => {
        try {
        const res = await api.get('/auditoria');
        setRegistros(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Registro de auditoría</h2>
        <p className="text-gray-400 text-sm mt-1">Historial de todas las acciones realizadas sobre los formularios</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : registros.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay registros de auditoría</p>
      ) : (
        <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Acción</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Descripción</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Fecha y hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {registros.map(r => (
                <tr key={r.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${ACCION_COLORS[r.accion] || 'bg-gray-50 text-gray-600'}`}>
                      {r.accion}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{r.descripcion || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {r.usuario?.nombre} {r.usuario?.apellidos}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">
                    {new Date(r.created_at).toLocaleString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}