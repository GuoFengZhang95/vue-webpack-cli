const SystemPage = () => import('@/views/system')

import systemRoutes from './modules'
import member from './modules/member'

export default [
  {
    path: 'system',
    component: SystemPage,
    redirect: '/system/notice',
    children: [...systemRoutes, ...member],
  },
]
