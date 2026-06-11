import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ESTADO_COLORES = {
  borrador: 'bg-gray-100 text-gray-600',
  enviado:  'bg-blue-50 text-blue-600',
  valido:   'bg-green-50 text-green-600',
  denegado: 'bg-red-50 text-red-600',
};

export default function Formularios() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formularios, setFormularios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    estado: '',
    tipo_formulario_id: '',
    usuario_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    periodo: '',
    ordenar_por: 'created_at',
    direccion: 'desc',
  });

  const esGestor = user?.rol === 'supervisor' || user?.rol === 'admin';

  useEffect(() => {
    api.get('/tipos-formulario').then(res => setTipos(res.data)).catch(() => {});
    if (esGestor) {
      api.get('/agentes').then(res => setAgentes(res.data)).catch(() => {});
    }
  }, []);

  useEffect(() => { cargarFormularios(); }, [filtros]);



  const cargarFormularios = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.tipo_formulario_id) params.tipo_formulario_id = filtros.tipo_formulario_id;
      if (filtros.usuario_id) params.usuario_id = filtros.usuario_id;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.periodo) params.periodo = filtros.periodo;
      params.ordenar_por = filtros.ordenar_por;
      params.direccion = filtros.direccion;

      const res = await api.get('/formularios', { params });
      setFormularios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: '', tipo_formulario_id: '', usuario_id: '',
      fecha_desde: '', fecha_hasta: '', periodo: '',
      ordenar_por: 'created_at', direccion: 'desc',
    });
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/formularios/${id}/estado`, { estado });
      cargarFormularios();
    } catch (err) {
      console.error(err);
    }
  };

  const exportarPdf = async (id) => {
    try {
      const res = await api.get(`/formularios/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `formulario_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
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

      <div className="bg-white rounded-lg border border-orange-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Estado</label>
            <select value={filtros.estado} onChange={e => handleFiltro('estado', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Todos</option>
              <option value="borrador">Borrador</option>
              <option value="enviado">Enviado</option>
              <option value="valido">Válido</option>
              <option value="denegado">Denegado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Tipo de formulario</label>
            <select value={filtros.tipo_formulario_id} onChange={e => handleFiltro('tipo_formulario_id', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Todos</option>
              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          {esGestor && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Agente</label>
              <select value={filtros.usuario_id} onChange={e => handleFiltro('usuario_id', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                <option value="">Todos</option>
                {agentes.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellidos}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input type="date" value={filtros.fecha_desde} onChange={e => handleFiltro('fecha_desde', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input type="date" value={filtros.fecha_hasta} onChange={e => handleFiltro('fecha_hasta', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
          </div>
          {/*Nuevos filtros*/}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ultimo...</label>
            <select value={filtros.periodo} onChange={e => handleFiltro('periodo', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Cualquiera</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ordenar por</label>
            <select value={filtros.ordenar_por} onChange={e => handleFiltro('ordenar_por', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="created_at">Fecha</option>
              <option value="titulo">Título</option>
              <option value="tipo">Tipo</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dirección</label>
            <select value={filtros.direccion} onChange={e => handleFiltro('direccion', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end pt-2">
            <button onClick={limpiarFiltros}className="text-sm text-white px-5 py-2 rounded transition" style={{ backgroundColor: '#F97316' }}>Limpiar filtros</button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : formularios.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay formularios que coincidan con los filtros</p>
      ) : (
        <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Título</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Agente</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Fecha</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {formularios.map(f => (
                <tr key={f.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{f.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.tipo_formulario?.nombre || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.usuario?.nombre} {f.usuario?.apellidos}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${ESTADO_COLORES[f.estado]}`}>
                      {f.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(f.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {esGestor && f.estado === 'enviado' && (
                      <>
                        <button onClick={() => cambiarEstado(f.id, 'valido')}
                          className="text-xs text-green-600 hover:text-green-800 transition">
                          Validar
                        </button>
                        <button onClick={() => cambiarEstado(f.id, 'denegado')}className="text-xs text-red-500 hover:text-red-700 transition">Denegar</button>
                      </>
                    )}
                    <button onClick={() => exportarPdf(f.id)}className="text-xs text-orange-500 hover:text-orange-700 transition">PDF</button>
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