import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NuevoFormulario() {
  const navigate = useNavigate();
  const [tipos, setTipos] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [campos, setCampos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  //cargar tipos de formulario
  useEffect(() => {
    api.get('/tipos-formulario').then(res => setTipos(res.data));
  }, []);

  useEffect(() => {
    if (tipoSeleccionado) {
      const tipo = tipos.find(t => t.id === parseInt(tipoSeleccionado));
      setCampos(tipo?.campos || []);
      setRespuestas({});
    }
  }, [tipoSeleccionado]);

  const handleRespuesta = (campoId, valor) => {
    setRespuestas(prev => ({ ...prev, [campoId]: valor }));
  };
  //envio del formulario
  const handleSubmit = async (estado) => {
    setError('');

    if (!titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    if (!tipoSeleccionado) {
      setError('Debes seleccionar un tipo de formulario.');
      return;
    }
    //validar campos obligatorios
    const camposObligatoriosVacios = campos.filter(c => 
      c.obligatorio && (!respuestas[c.id] || respuestas[c.id].toString().trim() === '')
    );

    if (camposObligatoriosVacios.length > 0) {
      setError(`Los siguientes campos son obligatorios: ${camposObligatoriosVacios.map(c => c.etiqueta).join(', ')}`);
      return;
    }

    setEnviando(true);
    try {
      const res = await api.post('/formularios', {
        titulo,
        tipo_formulario_id: parseInt(tipoSeleccionado),
        respuestas: campos.map(c => ({
          campo_id: c.id,
          valor: respuestas[c.id] || '',
        })),
      });

      if (estado === 'enviado') {
        await api.patch(`/formularios/${res.data.id}/estado`, { estado: 'enviado' });
      }

      navigate('/formularios');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el formulario');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/formularios')} className="text-gray-500 hover:text-gray-700">
          ← Volver
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Nuevo formulario</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Accidente de tráfico — Calle Mayor" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de formulario</label>
          <select value={tipoSeleccionado} onChange={e => setTipoSeleccionado(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecciona un tipo...</option>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {campos.map(campo => (
          <div key={campo.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.etiqueta}
              {campo.obligatorio ? ' *' : ''}
            </label>
            {campo.tipo_dato === 'textarea' ? (
              <textarea rows={3} value={respuestas[campo.id] || ''}
                onChange={e => handleRespuesta(campo.id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            ) : (
              <input
                type={campo.tipo_dato === 'fecha' ? 'date' : campo.tipo_dato === 'numero' ? 'number' : 'text'}
                value={respuestas[campo.id] || ''}
                onChange={e => handleRespuesta(campo.id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {tipoSeleccionado && (
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSubmit('borrador')} disabled={enviando}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
              Guardar borrador
            </button>
            <button onClick={() => handleSubmit('enviado')} disabled={enviando}
              className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              Enviar formulario
            </button>
          </div>
        )}
      </div>
    </div>
  );
}