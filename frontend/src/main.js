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
import { faHouse, faWandMagicSparkles, faCircleQuestion, 
  faClock, faCheck, faUserPlus, faRotateRight, faWrench, faTrash } from '@fortawesome/free-solid-svg-icons'
library.add(faHouse, faWandMagicSparkles, faCircleQuestion,
   faClock, faCheck, faUserPlus, faRotateRight, faWrench, faTrash)

// ################## ROUTER #################### 
import { createRouter, createWebHashHistory } from 'vue-router'

const CalendarioBasico = () => import('@/components/calendarioBasico.vue');
const GestorEmpleadosTurnos = () => import('@/components/gestorEmpleadosTurnos.vue');

const routes = [
  { path: '/', redirect: '/calendarioBasico' },
  { path: '/calendarioBasico', component: CalendarioBasico, name: 'calendarioBasico' },
  { path: '/GestorEmpleadosTurnos', component: GestorEmpleadosTurnos, name: 'gestorEmpleadosTurnos' },
  { path: '/:pathMatch(.*)*', component: CalendarioBasico, name: 'calendarioBasico'},
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
