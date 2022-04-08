const Purchase = () => import('@/views/yqmmpro/project/purchase')
const Major = () => import('@/views/yqmmpro/project/major')
const Fund = () => import('@/views/yqmmpro/project/fund')
const Bid = () => import('@/views/yqmmpro/project/bid')

export default [
  {
    path: 'purchase',
    name: 'YqmmproProjectPurchase',
    component: Purchase,
    meta: {
      title: '采购意向',
    },
  },
  {
    path: 'major',
    name: 'YqmmproProjectMajor',
    component: Major,
    meta: {
      title: '重大商情',
    },
  },
  {
    path: 'fund',
    name: 'YqmmproProjectFund',
    component: Fund,
    meta: {
      title: '基金课题',
    },
  },
  {
    path: 'bid',
    name: 'YqmmproProjectBid',
    component: Bid,
    meta: {
      title: '招投标',
    },
  },
]
