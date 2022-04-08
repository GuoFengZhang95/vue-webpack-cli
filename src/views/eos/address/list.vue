<template>
  <div id="page-sass-address-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations :show-reload="false" @parentReload="parentReload">
        <template #operations>
          <template v-if="!selectedRowKeys.length">
            <div class="input-wrp ml24">
              <MuSearch @globalSearch="globalSearch"></MuSearch>
            </div>
            <div class="address-info-wrp ml24 center-flex">
              <img src="@/assets/images/info-tips.png" alt />
              <span class="address-info-count">
                已经保存{{ totalCount }}条地址，还能保存
                <a-button type="link">{{ upperLimit - totalCount }}</a-button>
                条地址
              </span>
              <div class="btn-operation" @click="editAdress('add')">
                <a-icon type="plus-square" color="white"></a-icon>
                <span class="address-info-add">新增地址</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="bulk-operations ml24">
              <div class="left area">
                <div v-if="!selectAll">
                  <span>当前已选</span>
                  <a-button type="link">{{ selectedRowKeys.length }}</a-button>
                  <span>条地址</span>
                </div>
                <div v-else>
                  <span>选择全部</span>
                  <a-button type="link">{{ totalCount }}</a-button>
                  <span>条地址</span>
                </div>
                <a-divider type="vertical"></a-divider>
                <div class="btn-operation" @click="deleteAdress('bulk')">
                  <a-icon type="close-square" color="white"></a-icon>
                  <span>批量删除</span>
                </div>
              </div>
              <div class="right area">
                <div
                  v-if="selectedRowKeys.length"
                  class="icon-close-wrp mr24"
                  style="cursor: pointer"
                  @click="reset"
                >
                  <a-icon type="close"></a-icon>
                </div>
              </div>
            </div>
          </template>
        </template>
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :loading="loading"
        :scroll="{ y: tableHeight, x: tableWidth }"
        :data-source="tableList"
        :columns="columns"
        :table-size="tableSize"
        :row-selection="rowSelection"
      ></common-table>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations
        :current="pno"
        :total-count="totalCount"
        @tablePageChange="tablePageChange"
        @tablePageSizeChange="tablePageSizeChange"
      ></MuBottomOperations>
    </div>
    <!-- 地址弹窗 -->
    <edit-address
      v-if="addressModalVisible"
      :address-modal-visible="addressModalVisible"
      :address-type="addressType"
      :address-info="addressInfo"
      @closeAddressModal="closeAddressModal"
    ></edit-address>
  </div>
</template>

<script>
  import { getAddressList, operateAdress } from '@/api/eos/index'
  import EditAddress from './components/EditAddress'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosAddressList',
    components: {
      EditAddress,
    },
    inject: ['reload'],
    data() {
      return {
        loading: false,
        upperLimit: 1000,
        totalCount: 0,
        // 列表入参
        pno: 1,
        perpage: this.pageSize, //每页数量
        keyword: '', //模糊搜素
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '收货人',
            dataIndex: 'receiver',
            key: 'receiver',
            hasPopover: false,
          },
          {
            title: '所在地区',
            dataIndex: 'province',
            key: 'province',
            hasPopover: false,
            customRender: (text, record, index) => {
              return (
                <div>
                  {record.province}
                  {record.city}
                  {record.district}
                </div>
              )
            },
          },
          {
            title: '详细地址',
            dataIndex: 'detail',
            key: 'detail',
            hasPopover: false,
          },
          {
            title: '电话/手机',
            dataIndex: 'phone',
            key: 'phone',
            hasPopover: false,
          },
          {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            hasPopover: false,
            customRender: (text, record, index) => {
              return (
                <div>
                  <a-button
                    type='link'
                    onClick={() => {
                      this.editAdress('edit', record)
                    }}
                  >
                    编辑
                  </a-button>
                  <a-divider type='vertical' />
                  <a-button
                    type='link'
                    onClick={() => {
                      this.setDefaultAddress(record, index)
                    }}
                  >
                    {record.isDefault == 1 ? '默认' : '设为默认'}
                  </a-button>
                  <a-divider type='vertical' />
                  <a-button
                    type='link'
                    onClick={() => {
                      this.deleteAdress('single', record, index)
                    }}
                  >
                    删除
                  </a-button>
                </div>
              )
            },
          },
        ],
        selectAll: false, //是否全选
        // 选中项的id集合
        selectedRowKeys: [],
        // 表格数据
        tableList: [],
        // 地址弹窗
        addressModalVisible: false,
        addressInfo: {},
        addressType: '', //地址弹窗的类型
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'tableHeight', 'tableWidth', 'pageSize']),
      rowSelection() {
        const selectedRowKeys = this.selectedRowKeys
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          selections: [
            {
              key: 'all-data',
              text: `全部${this.totalCount}条`,
              onSelect: changableRowKeys => {
                // 设置全选标志
                this.selectAll = true
                // 设置当前页选中状态
                this.selectedRowKeys = changableRowKeys
              },
            },
            {
              key: 'current-data',
              text: `当前页${this.tableList.length}条`,
              onSelect: changableRowKeys => {
                // 取消全选标志
                this.selectAll = false
                // 设置当前页选中状态
                this.selectedRowKeys = changableRowKeys
              },
            },
          ],
          onSelection: this.onSelection,
        }
      },
    },
    watch: {},
    mounted() {
      this.$getLPTableSize()
      this.perpage = this.pageSize
      this._getAddressList()
      this.$bus.$on('loadList', () => {
        this._getAddressList()
      })
    },
    methods: {
      // 刷新
      parentReload() {
        this.reload()
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this.pno = 1
        this._getAddressList()
      },
      _getAddressList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          keyword: this.keyword,
        }
        this.loading = true
        getAddressList(data)
          .then(res => {
            this.$addListId(res.data, 'addressId', false)
            this.tableList = res.data
            this.totalCount = res.totalCount
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      // page变化
      tablePageChange(page, pageSize) {
        this.reset()
        // if (this.selectAll) {
        //   this.reset()
        // }
        this.pno = page
        this.perpage = pageSize
        this._getAddressList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.reset()
        // if (this.selectAll) {
        //   this.reset()
        // }
        this.pno = page
        this.perpage = pageSize
        this._getAddressList()
      },
      //选中项发生变化时的回调
      onSelectChange(selectedRowKeys) {
        this.selectAll = false
        // selectedRowKeys 所有已选中的 ids 会跨页记录
        this.selectedRowKeys = selectedRowKeys
      },
      // 重置表格复选宽状态
      reset() {
        this.selectAll = false
        this.selectedRowKeys = []
      },
      // 设置默认地址
      setDefaultAddress(record, index) {
        if (record.isDefault == 1) {
          this.$message.warn('请勿重复设置！')
        } else {
          let data = {
            id: record.addressId,
            type: 1,
          }
          operateAdress(data).then(res => {
            this.tableList.forEach((item, i) => {
              if (i === index) {
                item.isDefault = 1
              } else {
                item.isDefault = 0
              }
            })
            this.$message.success('已设为默认')
          })
        }
      },
      // 删除地址（单个 批量）
      deleteAdress(type, record, index) {
        this.$confirm({
          title: '确定删除地址信息吗？',
          content: '',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            if (this.selectAll) {
              let data = {
                isAll: 1,
                type: 2,
              }
              operateAdress(data).then(res => {
                this.$message.success('已清空地址')
                this.selectAll = false
                this.selectedRowKeys = []
                this._getAddressList()
              })
            } else if (type === 'bulk') {
              let data = {
                id: this.selectedRowKeys.join(','),
                type: 2,
              }
              operateAdress(data).then(res => {
                this.$message.success('已删除！')
                this.selectAll = false
                this.selectedRowKeys = []
                this._getAddressList()
              })
            } else {
              let data = {
                id: record.addressId,
                type: 2,
              }
              operateAdress(data).then(res => {
                this.$message.success('已删除！')
                this.selectAll = false
                this.selectedRowKeys = []
                this._getAddressList()
              })
            }
          },
          onCancel() {},
        })
      },
      // 编辑新增地址信息弹窗
      editAdress(addressType, addressInfo) {
        this.addressModalVisible = true
        this.addressType = addressType
        this.addressInfo = addressInfo
      },
      // 关闭地址弹窗
      closeAddressModal(e) {
        this.addressModalVisible = false
        if (e.isSubmit) {
          this.parentReload()
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-address-list {
    .bulk-operations {
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .area {
        display: flex;
        align-items: center;
      }
      // .area.left {
      //   & > div {
      //     display: flex;
      //     align-items: center;
      //   }
      // }
    }
    .address-info-wrp {
      display: flex;
      align-items: center;

      .address-info-count {
        margin-right: 24px;
        font-size: 12px;
        margin-left: 6px;
        color: #999;
        .ant-btn {
          font-size: 12px;
        }
      }
    }
    .table-operations-wrp {
      display: flex;
      justify-content: space-around;
    }
  }
</style>
