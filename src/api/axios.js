import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://petopia-backend-xmwf.onrender.com',
    baseURL: 'http://localhost:8000',
});

export default instance;
