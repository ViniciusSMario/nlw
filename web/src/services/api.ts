import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.10.10:3030/"
}
);

export default api;