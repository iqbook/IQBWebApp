import axios from 'axios';

// const BASE_URL = 'http://localhost:8001';

const BASE_URL = "https://iqb-final.onrender.com"
// const BASE_URL = "https://iqb-final-dev.onrender.com"

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials:true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userAdminLoggedIn') || localStorage.getItem('userBarberLoggedIn');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;