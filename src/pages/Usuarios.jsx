import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', password: '', rol_id: '' });
  const [error, setError] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [u, r] = await Promise.all([api.get('/usuarios'), api.get('/roles')]);
      setUsuarios(u.data);
      setRoles(r.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/usuarios', form);
      setShowForm(false);
      setForm({ nombre: '', apellidos: '', email: '', password: '', rol_id: '' });
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const desactivar = async (id) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    await api.delete(`/usuarios/${id}`);
    cargarDatos();
  };

  const activar = async (id) => {
    if (!confirm('¿Activar este usuario?')) return;
    await api.patch(`/usuarios/${id}/activar`);
    cargarDatos();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="text-sm text-white px-4 py-2 rounded transition"
          style={{ backgroundColor: '#F97316' }}>
          Nuevo usuario
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-orange-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Crear usuario</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400" required/>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Apellidos</label>
              <input value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400" required/>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400" required/>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contraseña</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400" required/>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Rol</label>
              <select value={form.rol_id} onChange={e => setForm({ ...form, rol_id: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-400" required>
                <option value="">Selecciona un rol...</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
            {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}
            <div className="col-span-2 flex gap-3">
              <button type="submit"
                className="text-sm text-white px-4 py-2 rounded"
                style={{ backgroundColor: '#F97316' }}>
                Crear
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="text-sm text-gray-500 px-4 py-2 rounded border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando</p>
      ) : (
        <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Rol</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{u.nombre} {u.apellidos}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{u.rol?.nombre}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${u.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.activo ? (
                      <button onClick={() => desactivar(u.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition">
                        Desactivar
                      </button>
                    ) : (
                      <button onClick={() => activar(u.id)}
                        className="text-xs text-green-500 hover:text-green-700 transition">
                        Activar
                      </button>
                    )}
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