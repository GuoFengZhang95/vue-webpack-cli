export default [
  {
    path: 'person',
    name: 'SystemPerson',
    component: () => import('@/views/system/person/index'),
    meta: {
      title: '个人信息',
    },
  },
  {
    path: 'notice',
    name: 'SystemNotice',
    component: () => import('@/views/system/notice/list'),
    meta: {
      title: '通知消息',
    },
  },
]
