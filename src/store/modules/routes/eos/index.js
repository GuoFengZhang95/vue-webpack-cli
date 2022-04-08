export default [
  {
    label: '易采销首页',
    icon_h: require('@/assets/images/icon/side-dashboard-selected.png'),
    icon: require('@/assets/images/icon/side-dashboard-unselected.png'),
    path: '/eos/dashboard',
  },
  {
    label: '产品列表',
    icon_h: require('@/assets/images/icon/side-product-selected.png'),
    icon: require('@/assets/images/icon/side-product-unselected.png'),
    path: '/eos/product/list',
  },
  {
    label: '我的购物车',
    icon_h: require('@/assets/images/icon/side-shopcart-selected.png'),
    icon: require('@/assets/images/icon/side-shopcart-unselected.png'),
    path: '/eos/shopcart/list',
  },
  {
    label: '订单管理',
    icon_h: require('@/assets/images/icon/side-order-selected.png'),
    icon: require('@/assets/images/icon/side-order-unselected.png'),
    path: '/eos/order/list',
  },
  {
    label: '发票管理',
    icon_h: require('@/assets/images/icon/side-invoice-selected.png'),
    icon: require('@/assets/images/icon/side-invoice-unselected.png'),
    path: '/eos/invoice',
    children: [
      {
        label: '我的发票',
        path: '/eos/invoice/mine',
      },
      {
        label: '发票申请',
        path: '/eos/invoice/list',
      },
    ],
  },
  {
    label: '地址管理',
    icon_h: require('@/assets/images/icon/side-address-selected.png'),
    icon: require('@/assets/images/icon/side-address-unselected.png'),
    path: '/eos/address/list',
  },
  {
    label: '品牌管理',
    icon_h: require('@/assets/images/icon/side-brand-selected.png'),
    icon: require('@/assets/images/icon/side-brand-unselected.png'),
    path: '/eos/brand/list',
  },
  {
    label: '个人中心',
    icon_h: require('@/assets/images/icon/side-usercenter-selected.png'),
    icon: require('@/assets/images/icon/side-usercenter-unselected.png'),
    path: '/eos/usercenter',
  },
]
