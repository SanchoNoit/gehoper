import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// ################## BOOTSTRAP ####################
import '@/scss/styles.scss'
import * as bootstrap from 'bootstrap'

/* ########### FONTAWESOME usando Library ######### */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* Iconos especificos */
import { faHouse, faWandMagicSparkles, faCircleQuestion, faClock, faCheck } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faWandMagicSparkles, faCircleQuestion, faClock, faCheck)

// ################## ROUTER #################### 
import { createRouter, createWebHashHistory } from 'vue-router'

const Bienvenida = () => import('@/components/bienvenida.vue');
const CalendarioBasico = () => import('@/components/calendarioBasico.vue');
const GestorJornadasCalendario = () => import('@/components/gestorJornadasCalendario.vue');

const routes = [
  { path: '/', redirect: '/bienvenida' },
  { path: '/bienvenida', component: Bienvenida, name: 'bienvenida' },
  { path: '/calendarioBasico', component: CalendarioBasico, name: 'calendarioBasico' },
  { path: '/GestorJornadasCalendario', component: GestorJornadasCalendario, name: 'gestorJornadasCalendario' },
  { path: '/:pathMatch(.*)*', component: Bienvenida, name: 'bienvenida'},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Pinia const
const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
