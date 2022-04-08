export default [
  {
    label: 'AI外呼',
    icon: 'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-robot-gray.svg',
    icon_h:
      'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-robot-light.svg',
    path: '/ai/outbound',
    children: [
      {
        label: '外呼任务',
        path: '/ai/outbound/task',
      },
      {
        label: '黑名单',
        path: '/ai/outbound/blacklist',
      },
      {
        label: '呼叫设置',
        path: '/ai/outbound/option',
      },
    ],
  },
]
