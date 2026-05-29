import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TiposFormulario() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormTipo, setShowFormTipo] = useState(false);
  const [showFormCampo, setShowFormCampo] = useState(null);
  const [formTipo, setFormTipo] = useState({ nombre: '', descripcion: '' });
  const [formCampo, setFormCampo] = useState({ etiqueta: '', tipo_dato: 'texto', obligatorio: false, orden: 1 });
  const [error, setError] = useState('');

  useEffect(() => { cargarTipos(); }, []);

  const cargarTipos = async () => {
    try {
      const res = await api.get('/tipos-formulario');
      setTipos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearTipo = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tipos-formulario', formTipo);
      setShowFormTipo(false);
      setFormTipo({ nombre: '', descripcion: '' });
      cargarTipos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear tipo');
    }
  };

  const crearCampo = async (e, tipoId) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/campos', { ...formCampo, tipo_formulario_id: tipoId });
      setShowFormCampo(null);
      setFormCampo({ etiqueta: '', tipo_dato: 'texto', obligatorio: false, orden: 1 });
      cargarTipos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear campo');
    }
  };

  const desactivarTipo = async (id) => {
    if (!confirm('¿Desactivar este tipo de formulario?')) return;
    await api.delete(`/tipos-formulario/${id}`);
    cargarTipos();
  };

  const eliminarCampo = async (id) => {
    if (!confirm('¿Eliminar este campo?')) return;
    await api.delete(`/campos/${id}`);
    cargarTipos();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tipos de formulario</h2>
        <button onClick={() => setShowFormTipo(!showFormTipo)}
          className="text-sm text-white px-4 py-2 rounded transition"
          style={{ backgroundColor: '#F97316' }}>
          Nuevo tipo
        </button>
      </div>

      {showFormTipo && (
        <div className="bg-white rounded-lg border border-orange-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Crear tipo de formulario</h3>
          <form onSubmit={crearTipo} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nombre</label>
              <input value={formTipo.nombre} onChange={e => setFormTipo({ ...formTipo, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Ej: Accidente de tráfico" required/>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Descripción</label>
              <input value={formTipo.descripcion} onChange={e => setFormTipo({ ...formTipo, descripcion: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Descripción opcional"/>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-3">
              <button type="submit"
                className="text-sm text-white px-4 py-2 rounded"
                style={{ backgroundColor: '#F97316' }}>
                Crear
              </button>
              <button type="button" onClick={() => setShowFormTipo(false)}
                className="text-sm text-gray-500 px-4 py-2 rounded border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : tipos.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay tipos de formulario creados</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tipos.map(tipo => (
            <div key={tipo.id} className="bg-white rounded-lg border border-orange-100 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{tipo.nombre}</h3>
                  {tipo.descripcion && <p className="text-xs text-gray-400 mt-0.5">{tipo.descripcion}</p>}
                </div>
                <div className="flex gap-3 items-center">
                  <span className={`text-xs px-2 py-1 rounded ${tipo.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {tipo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button onClick={() => setShowFormCampo(showFormCampo === tipo.id ? null : tipo.id)}
                    className="text-xs text-orange-500 hover:text-orange-700 transition">
                    Añadir campo
                  </button>
                  <button onClick={() => desactivarTipo(tipo.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition">
                    Desactivar
                  </button>
                </div>
              </div>

              {showFormCampo === tipo.id && (
                <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                  <h4 className="text-xs font-medium text-gray-600 mb-3">Nuevo campo</h4>
                  <form onSubmit={(e) => crearCampo(e, tipo.id)} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Etiqueta</label>
                      <input value={formCampo.etiqueta} onChange={e => setFormCampo({ ...formCampo, etiqueta: e.target.value })}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                        placeholder="Nombre del campo" required/>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tipo de dato</label>
                      <select value={formCampo.tipo_dato} onChange={e => setFormCampo({ ...formCampo, tipo_dato: e.target.value })}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-orange-400">
                        <option value="texto">Texto</option>
                        <option value="numero">Número</option>
                        <option value="fecha">Fecha</option>
                        <option value="textarea">Texto largo</option>
                        <option value="select">Selección</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Orden</label>
                      <input type="number" value={formCampo.orden} onChange={e => setFormCampo({ ...formCampo, orden: parseInt(e.target.value) })}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-orange-400"/>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={formCampo.obligatorio}
                          onChange={e => setFormCampo({ ...formCampo, obligatorio: e.target.checked })}
                          className="accent-orange-500"/>
                        Campo obligatorio
                      </label>
                    </div>
                    {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}
                    <div className="col-span-2 flex gap-3">
                      <button type="submit"
                        className="text-xs text-white px-3 py-1.5 rounded"
                        style={{ backgroundColor: '#F97316' }}>
                        Añadir campo
                      </button>
                      <button type="button" onClick={() => setShowFormCampo(null)}
                        className="text-xs text-gray-500 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {tipo.campos && tipo.campos.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left px-6 py-2 text-xs text-gray-400 uppercase tracking-wide">Campo</th>
                      <th className="text-left px-6 py-2 text-xs text-gray-400 uppercase tracking-wide">Tipo</th>
                      <th className="text-left px-6 py-2 text-xs text-gray-400 uppercase tracking-wide">Orden</th>
                      <th className="text-left px-6 py-2 text-xs text-gray-400 uppercase tracking-wide">Obligatorio</th>
                      <th className="text-left px-6 py-2 text-xs text-gray-400 uppercase tracking-wide"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tipo.campos.sort((a, b) => a.orden - b.orden).map(campo => (
                      <tr key={campo.id} className="hover:bg-orange-50 transition">
                        <td className="px-6 py-3 text-sm text-gray-700">{campo.etiqueta}</td>
                        <td className="px-6 py-3 text-sm text-gray-400 capitalize">{campo.tipo_dato}</td>
                        <td className="px-6 py-3 text-sm text-gray-400">{campo.orden}</td>
                        <td className="px-6 py-3 text-sm text-gray-400">{campo.obligatorio ? 'Sí' : 'No'}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => eliminarCampo(campo.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-6 py-4 text-xs text-gray-400">Sin campos definidos</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}