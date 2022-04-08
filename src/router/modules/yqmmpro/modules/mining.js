const Subscription = () => import('@/views/yqmmpro/mining/subscription')
const Dynamic = () => import('@/views/yqmmpro/mining/dynamic')
const Collection = () => import('@/views/yqmmpro/mining/collection')

export default [
  {
    path: 'subscription',
    component: Subscription,
    meta: {
      title: '订阅推送',
    },
  },
  {
    path: 'dynamic',
    component: Dynamic,
    meta: {
      title: '动态监控',
    },
  },
  {
    path: 'collection',
    component: Collection,
    meta: {
      title: '收藏信息',
    },
  },
]
