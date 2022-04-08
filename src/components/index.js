import Avatar from './global/Avatar/index.vue'
import BottomOperations from './global/BottomOperations/index.vue'
import Clamp from './global/Clamp/index.vue'
import CommonTable from './global/CommonTable/index.vue'
import Divid from './global/Divid/index.vue'
import DotStatus from './global/DotStatus/index.vue'
import ExpressList from './global/ExpressList/index.vue'
import InputNumber from './global/InputNumber/index.vue'
import Image from './global/Image/index.vue'
import Button from './global/Button/index.vue'
import Drawer from './global/Drawer/index.vue'
import Pagination from './global/Pagination/index.vue'
import Tab from './global/Tab/index.vue'
import Table from './global/Table/index.vue'
import PageHeader from './global/PageHeader/index.vue'
import Search from './global/Search/index.vue'
import SearchGroup from './global/SearchGroup/index.vue'
import TopOperations from './global/TopOperations/index.vue'
import Tree from './global/Tree/index'
import DrawerLayout from './global/DrawerLayout/index.js'
import DefaultArea from './global/DefaultArea/index.vue'
import AuthTips from './global/AuthTips/index.vue'

const components = [
  Avatar,
  BottomOperations,
  Clamp,
  CommonTable,
  Divid,
  DotStatus,
  ExpressList,
  InputNumber,
  Image,
  Button,
  Drawer,
  Pagination,
  Tab,
  Table,
  PageHeader,
  Search,
  SearchGroup,
  TopOperations,
  Tree,
  DefaultArea,
  AuthTips,
]
/* eslint-disable-next-line no-unused-vars */
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  Vue.use(DrawerLayout)
}

export default {
  version: '',
  install,
}
