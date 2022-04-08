const Member = () => import('@/views/system/member')

export default [
  {
    path: 'member',
    component: Member,
    meta: {
      title: '成员管理',
    },
  },
]
