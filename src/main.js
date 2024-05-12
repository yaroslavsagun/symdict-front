import './assets/main.css'

import {createApp} from 'vue';
import App from './App.vue'
import {router} from './Router.vue'
import 'bootstrap'
import axios from "axios";

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);
const app = createApp(App);
app.use(router);
app.config.globalProperties.$apiUrl = "https://localhost:8001/api/";
app.mount('#app');