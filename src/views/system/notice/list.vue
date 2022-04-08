<template>
  <div id="page-system-notice-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations :show-reload="false" @parentReload="parentReload">
        <template #operations>
          <div class="input-wrp ml24">
            <MuSearch @globalSearch="globalSearch"></MuSearch>
          </div>
        </template>
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="columns"
        :data-source="tableList"
        :table-size="tableSize"
        @confirmFiltering="confirmFiltering"
      ></common-table>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations
        :total-count="totalCount"
        :current="pno"
        @tablePageChange="tablePageChange"
        @tablePageSizeChange="tablePageSizeChange"
      ></MuBottomOperations>
    </div>
  </div>
</template>

<script>
  import { getSystemNoticeList } from '@/api/common.js'
  import NoticeDetail from './components/detail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'SystemNotice',
    data() {
      return {
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  onClick={() => {
                    this.showNoticeDetail(record.noticeId)
                  }}
                >
                  {record.title}
                </span>
              )
            },
          },
          {
            title: '通知类型',
            dataIndex: 'type',
            key: 'type',
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'default',
              options: [],
            },
            customRender: (text, record, index) => {
              let node =
                record.type == 1
                  ? '普通通知'
                  : record.type == 2
                  ? '资料下载'
                  : '未知'
              return <span>{node}</span>
            },
          },
          {
            title: '发送人',
            dataIndex: 'senderName',
            key: 'senderName',
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
          },
        ],
        tableList: [],
        pno: 1, //当前页,
        perpage: this.pageSize, //每页数量
        totalCount: 0,
        filterData: {
          noticeType: '',
        },
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'tableHeight', 'tableWidth', 'pageSize']),
    },
    mounted() {
      this.perpage = this.pageSize
      this.$getLPTableSize()
      this.init()
    },
    methods: {
      init() {
        this._getSystemNoticeList()
      },
      _getSystemNoticeList() {
        let data = {
          pageNum: this.pno,
          pageSize: this.perpage,
          searchKey: this.keyword,
          type: this.noticeType,
        }
        Object.assign(data, this.filterData)
        this.loading = true

        getSystemNoticeList(data)
          .then(res => {
            res.data.searchList.noticeTypeList.forEach(item => {
              item.value = item.id
            })
            this.$addListId(res.data.list, 'noticeId')
            this.columns.forEach((item, index) => {
              if (item.dataIndex == 'type') {
                this.columns[index].filterInfo.options =
                  res.data.searchList.noticeTypeList
                // this.$set(this.columns, index,)
              }
            })
            this.tableList = res.data.list
            this.totalCount = res.data.totalCount
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      // 打开消息详情
      showNoticeDetail(noticeId) {
        this.$globalDrawer.show({
          component: NoticeDetail,
          options: {
            name: 'NoticeDetail',
            title: '消息详情',
            props: { id: noticeId },
          },
        })
      },
      // 刷新
      parentReload() {
        this.reload()
        this.$router.replace({
          name: 'EosOrderList',
        })
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this.pno = 1
        this._getSystemNoticeList()
      },
      // page变化
      tablePageChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize ? pageSize : this.pageSize
        this._getSystemNoticeList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this._getSystemNoticeList()
      },
      // 筛选
      confirmFiltering(e) {
        const { name, value } = e
        if (name === 'type') {
          this.filterData.type = value
        }
        this._getSystemNoticeList()
      },
    },
  }
</script>

<style lang="less" scoped></style>

<style lang="less"></style>
