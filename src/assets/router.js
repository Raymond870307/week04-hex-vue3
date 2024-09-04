// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../page/Home.vue';
import Todolistpage from '../page/TodoListPage.vue';
import SignUpPage from '../page/SignUpPage.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Todolistpage',
    name: 'Todolistpage',
    component: Todolistpage,
  },
  {
    path: '/SignUpPage',
    name: 'SignUpPage',
    component: SignUpPage,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
