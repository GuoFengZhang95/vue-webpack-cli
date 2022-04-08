const Design = () => import('@/views/ai/speech/design')
const Dictionary = () => import('@/views/ai/speech/dictionary')
const Train = () => import('@/views/ai/speech/train')

export default [
  {
    path: 'design',
    component: Design,
    meta: {
      title: '话术设计',
    },
  },
  {
    path: 'dictionary',
    component: Dictionary,
    meta: {
      title: '话术训练',
    },
  },
  {
    path: 'train',
    component: Train,
    meta: {
      title: '智能词典',
    },
  },
]
