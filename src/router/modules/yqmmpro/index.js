const YqmmProPage = () => import('@/views/yqmmpro')
const BusinessPage = () => import('@/views/yqmmpro/business')
const ProjectPage = () => import('@/views/yqmmpro/project')
const CustomerPage = () => import('@/views/yqmmpro/customer')
const MiningPage = () => import('@/views/yqmmpro/mining')

import business from './modules/business'
import project from './modules/project'
import customer from './modules/customer'
import mining from './modules/mining'

export default [
  {
    path: 'yqmmpro',
    component: YqmmProPage,
    redirect: '/yqmmpro/business/purchaseIntention',
    children: [
      {
        path: 'business',
        component: BusinessPage,
        children: business,
      },
      {
        path: 'project',
        component: ProjectPage,
        children: project,
      },
      {
        path: 'customer',
        component: CustomerPage,
        children: customer,
      },
      {
        path: 'mining',
        component: MiningPage,
        children: mining,
      },
      {
        path: '/yqmmpro/detail/:name/:id',
        name: 'CommonDetailContainer',
        component: () => import('@/views/yqmmpro/detailcontainer'),
        meta: { title: '详情' },
      },
    ],
  },
]
