import axios from 'axios';

/** 
 * Crea instancia de Axios con la URL base de la API. 
 * Añade automáticamente el token de autenticación en la 
 * cabecera de cada petición.
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
//aqui se añade el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;