export default [
  {
    path: 'dashboard',
    name: 'EosDashboard',
    component: () => import('@/views/eos/dashboard/index'),
    meta: {
      title: '易采销首页',
    },
  },
  {
    path: 'product/list',
    name: 'EosProductList',
    component: () => import('@/views/eos/product/list'),
    meta: {
      title: '产品列表',
    },
  },
  {
    path: 'shopcart/list',
    name: 'EosShopcartList',
    component: () => import('@/views/eos/shopcart/list'),
    meta: {
      title: '我的购物车',
    },
  },
  {
    path: 'shopcart/settlement',
    name: 'EosSettlement',
    component: () => import('@/views/eos/shopcart/settlement'),
    meta: {
      title: '结算订单',
    },
  },
  {
    path: 'shopcart/payment',
    name: 'EosPayment',
    component: () => import('@/views/eos/shopcart/payment'),
    meta: {
      title: '支付订单',
    },
  },
  {
    path: 'shopcart/payresult',
    name: 'EosPayResult',
    component: () => import('@/views/eos/shopcart/payresult'),
    meta: {
      title: '支付结果',
    },
  },
  {
    path: 'order/list',
    name: 'EosOrderList',
    component: () => import('@/views/eos/order/list'),
    meta: {
      title: '订单列表',
    },
  },
  {
    path: 'invoice/mine',
    name: 'EosMineInvoice',
    component: () => import('@/views/eos/invoice/mine'),
    meta: {
      title: '我的发票',
    },
  },
  {
    path: 'invoice/list',
    name: 'EosInvoiceList',
    component: () => import('@/views/eos/invoice/list'),
    meta: {
      title: '发票申请',
    },
  },
  {
    path: 'invoice/application',
    name: 'EosInvoiceApplication',
    component: () => import('@/views/eos/invoice/application'),
    meta: {
      title: '申请发票',
    },
  },
  {
    path: 'address/list',
    name: 'EosAddressList',
    component: () => import('@/views/eos/address/list'),
    meta: {
      title: '地址管理',
    },
  },
  {
    path: 'brand/list',
    name: 'EosBrandList',
    component: () => import('@/views/eos/brand/list'),
    meta: {
      title: '品牌管理',
    },
  },
  {
    path: 'usercenter',
    name: 'EosUserCenter',
    component: () => import('@/views/eos/usercenter/usercenter'),
    meta: {
      title: '个人中心',
    },
  },
]
