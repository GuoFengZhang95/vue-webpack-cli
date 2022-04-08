const Customer = () => import('@/views/yqmmpro/business/customer')
const PurchaseIntention = () =>
  import('@/views/yqmmpro/business/purchaseIntention')
const Bid = () => import('@/views/yqmmpro/business/bid')
const Major = () => import('@/views/yqmmpro/business/major')
const Fund = () => import('@/views/yqmmpro/business/fund')
const Order = () => import('@/views/yqmmpro/business/order')

export default [
  {
    path: 'purchaseIntention',
    component: PurchaseIntention,
    meta: {
      title: '采购意向',
    },
  },
  {
    path: 'major',
    component: Major,
    meta: {
      title: '重大商情',
    },
  },
  {
    path: 'fund',
    component: Fund,
    meta: {
      title: '基金课题',
    },
  },
  {
    path: 'customer',
    component: Customer,
    meta: {
      title: '科研客户',
    },
  },
  {
    path: 'bid',
    component: Bid,
    meta: {
      title: '招投标',
    },
  },
  {
    path: 'order',
    component: Order,
    meta: {
      title: '接单',
    },
  },
]
