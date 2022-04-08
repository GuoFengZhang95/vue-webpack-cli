import store from '../store'
import _ from 'lodash'
export default {
  /* eslint-disable-next-line no-unused-vars */
  install(Vue, options) {
    // 设置列表 id
    Vue.prototype.$addListId = function (list, listIdName, e = true) {
      if (e) {
        list.forEach((item, index) => {
          item['listId'] = item[listIdName] ? item[listIdName] : index
          for (let attr in item) {
            if (
              item[attr] === undefined ||
              item[attr] === null ||
              item[attr] === ''
            )
              item[attr] = '-'
          }
        })
      }
    }
    // 防抖
    Vue.prototype.$debounce = function (fn, time) {
      let _arguments = arguments
      let timeout = null
      return function () {
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          fn.call(this, _arguments)
        }, time)
      }
    }
    const Bus = new Vue()
    // EventBus
    Vue.prototype.$bus = {
      /**
       * @param {any} event 第一个参数是事件对象，第二个参数是接收到消息信息，可以是任意类型
       * @method $on    事件订阅
       * @method $off    取消事件订阅
       * @method $emit    事件广播
       * @method $once    事件订阅, 触发一次
       */
      $on(...event) {
        Bus.$on(...event)
      },
      $off(...event) {
        Bus.$off(...event)
      },
      $once(...event) {
        Bus.$once(...event)
      },
      $emit(...event) {
        Bus.$emit(...event)
      },
    }

    // 获取表格页，表格的宽高
    Vue.prototype.$getLPTableSize = function () {
      if (document.getElementsByClassName('list-page-table-wrp')[0]) {
        let pageTableWrpHeight = document.getElementsByClassName(
          'list-page-table-wrp'
        )[0].offsetHeight
        // console.log('pageTableWrpHeight', pageTableWrpHeight)
        if (document.getElementsByClassName('ant-table-thead')[0]) {
          // 重新计算 app-main 中表格的scroll: X,y
          let appMainWidth = document.getElementById('app-main').offsetWidth
          store.dispatch('app/setTableWidth', appMainWidth - 8)
          let antDesignTableHeight =
            document.getElementsByClassName('ant-table-thead')[0].offsetHeight
          store.dispatch(
            'app/setTableHeight',
            pageTableWrpHeight - antDesignTableHeight
          )
          // console.log('x', appMainWidth - 8)
          // console.log('y', pageTableWrpHeight - antDesignTableHeight)
        }
      }
    }

    Vue.prototype.$lodash = _
  },
}
