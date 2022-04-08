const Blacklist = () => import('@/views/ai/outbound/blacklist')
const Option = () => import('@/views/ai/outbound/option')
const Task = () => import('@/views/ai/outbound/task')

export default [
  {
    path: 'blacklist',
    component: Blacklist,
    meta: {
      title: '黑名单',
    },
  },
  {
    path: 'option',
    component: Option,
    meta: {
      title: '呼叫设置',
    },
  },
  {
    path: 'task',
    component: Task,
    meta: {
      title: '外呼任务',
    },
  },
]
