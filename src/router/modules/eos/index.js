const EosPage = () => import('@/views/eos')

import eosRoutes from './modules'

export default [
  {
    path: 'eos',
    component: EosPage,
    redirect: '/eos/dashboard',
    children: [...eosRoutes],
  },
]
