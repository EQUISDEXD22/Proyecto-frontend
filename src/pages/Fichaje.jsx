import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Fichaje() {
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fichando, setFichando] = useState(false);

  useEffect(() => { cargarFichajes(); }, []);

  const cargarFichajes = async () => {
    try {
      const res = await api.get('/fichajes');
      setFichajes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fichar = async (tipo) => {
    setFichando(true);
    try {
      await api.post('/fichajes', { tipo });
      cargarFichajes();
    } catch (err) {
      console.error(err);
    } finally {
      setFichando(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Fichaje</h2>

      <div className="bg-white rounded-lg border border-orange-100 p-6 mb-6">
        <p className="text-sm text-gray-400 mb-4">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex gap-4">
          <button onClick={() => fichar('entrada')} disabled={fichando}
            className="flex-1 py-3 rounded text-sm text-white bg-green-500 hover:bg-green-600 transition disabled:opacity-50">
            Registrar entrada
          </button>
          <button onClick={() => fichar('salida')} disabled={fichando}
            className="flex-1 py-3 rounded text-sm text-white bg-red-400 hover:bg-red-500 transition disabled:opacity-50">
            Registrar salida
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-600">Historial</h3>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Cargando</p>
        ) : fichajes.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No hay fichajes registrados en el sistema</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fichajes.map(f => (
                <tr key={f.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${f.tipo === 'entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {f.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">
                    {new Date(f.created_at).toLocaleString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}