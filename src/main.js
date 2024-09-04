import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './assets/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap CSS
import 'bootstrap'; // 可選：引入 Bootstrap JS 如需使用 Bootstrap 的互動元件
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

createApp(App).use(router).mount('#app')
