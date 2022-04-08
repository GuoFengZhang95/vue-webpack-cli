const AiPage = () => import('@/views/ai')

const OutboundPage = () => import('@/views/ai/outbound/index')
const SpeechPage = () => import('@/views/ai/speech/index')

import outbound from './modules/outbound'
import speech from './modules/speech'

export default [
  {
    path: 'ai',
    component: AiPage,
    redirect: '/ai/outbound/task',
    children: [
      {
        path: 'outbound',
        component: OutboundPage,
        children: outbound,
      },
      {
        path: 'speech',
        component: SpeechPage,
        children: speech,
      },
    ],
  },
]
