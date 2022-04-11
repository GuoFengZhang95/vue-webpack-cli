import Vue from 'vue'

import {
  ConfigProvider,
  LocaleProvider,
  Button,
  Icon,
  Input,
  InputNumber,
  Checkbox,
  Badge,
  Tabs,
  Form,
  FormModel,
  Select,
  Table,
  Modal,
  Row,
  Col,
  Spin,
  Descriptions,
  DatePicker,
  Drawer,
  Popconfirm,
  Popover,
  Pagination,
  Dropdown,
  Menu,
  Tooltip,
  Tree,
  Radio,
  Cascader,
  Tag,
  message,
  Collapse,
  Steps,
  Divider,
  TreeSelect,
  Transfer,
  TimePicker,
  Carousel,
  Switch,
} from 'ant-design-vue'

import 'ant-design-vue/dist/antd.less'

// import Antd from 'ant-design-vue'
// console.log(Antd.version)
message.config({
  top: '80px',
  duration: 2,
  maxCount: 1,
})

Vue.use(ConfigProvider)
Vue.use(LocaleProvider)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Badge)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(Drawer)
Vue.use(Dropdown)
Vue.use(Descriptions)
Vue.use(Icon)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Modal)
Vue.use(Menu)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Select)
// Vue.use(Slider)
Vue.use(Spin)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(Table)
// Vue.use(Timeline)
Vue.use(Tooltip)
// Vue.use(Upload)
// Vue.use(List)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Tree)
Vue.use(TreeSelect)
Vue.use(Radio)
Vue.use(Cascader)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(Divider)
Vue.use(TreeSelect)
Vue.use(Transfer)
Vue.use(TimePicker)
Vue.use(Carousel)
// Vue.use(Alert)
Vue.use(Switch)

Vue.prototype.$message = message
Vue.prototype.$modal = Modal
