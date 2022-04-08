const DataPool = () => import('@/views/yqmmpro/customer/datapool')
const Company = () => import('@/views/yqmmpro/customer/company')
const Research = () => import('@/views/yqmmpro/customer/researcher')

export default [
  {
    path: 'researcher',
    name: 'YqmmproCustomerResearcher',
    component: Research,
    meta: {
      title: '科研客户库',
    },
  },
  {
    path: 'company',
    component: Company,
    meta: {
      title: '企业客户',
    },
  },
  {
    path: 'dataPool',
    component: DataPool,
    meta: {
      title: '数据公海',
    },
  },
]
