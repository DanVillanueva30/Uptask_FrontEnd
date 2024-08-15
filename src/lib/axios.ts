import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

//Antes de enviar una solicitud se inyecta el token del usuario para que esté autorizado.
api.interceptors.request.use( config => {
    const token = localStorage.getItem('AUTH_TOKEN_uptask');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;