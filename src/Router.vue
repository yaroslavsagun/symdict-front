<script>
import {createRouter, createWebHistory} from 'vue-router'
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import Dashboard from './views/Admin/Dashboard.vue';
import Languages from './views/Admin/Languages.vue';
import Words from './views/Admin/Words.vue';
import Translations from './views/Admin/Translations.vue';
import Translate from './views/User/Translate.vue';

const routes = [
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/translate', component: Translate, meta: {requiresAuth: true}},
  {path: '/admin/dashboard', component: Dashboard, meta: {requiresAdmin: true}},
  {path: '/admin/languages', component: Languages, meta: {requiresAdmin: true}},
  {path: '/admin/words', component: Words, meta: {requiresAdmin: true}},
  {path: '/admin/translations', component: Translations, meta: {requiresAdmin: true}}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta['requiresAuth'])) {
    if (!localStorage.getItem('auth_token')) {
      next({path: '/login'})
      return;
    } else {
      next()
      return;
    }
  }
  if (to.matched.some(record => record.meta['requiresAdmin'])) {
    if (!localStorage.getItem('auth_token') || !localStorage.getItem('role') || localStorage.getItem('role') !== 'ROLE_ADMIN') {
      next({path: '/login'})
      return;
    } else {
      next()
      return;
    }
  }
  next();
})
export {router}
</script>