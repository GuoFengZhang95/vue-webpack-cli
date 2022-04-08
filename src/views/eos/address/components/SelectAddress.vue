<template>
  <div class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuPageHeader
        :show-reload="false"
        :show-back="false"
        title="地址信息"
      ></MuPageHeader>
      <MuTopOperations :show-reload="false">
        <template #operations>
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
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :scroll="{ y: tableHeight }"
        :columns="columns"
        :data-source="tableList"
        :table-size="tableSize"
      ></common-table>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations
        :show-size-changer="true"
        :total-count="totalCount"
        :current="pno"
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
  import EditAddress from './EditAddress'
  import { mapGetters } from 'vuex'
  export default {
    name: 'SelectAddress',
    components: {
      EditAddress,
    },

    data() {
      return {
        upperLimit: 1000,
        // 地址弹窗
        addressModalVisible: false,
        addressInfo: {},
        tableList: [],
        addressType: '', //地址弹窗的类型
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '收货人',
            dataIndex: 'receiver',
            key: 'receiver',
          },
          {
            title: '所在地区',
            dataIndex: 'province',
            key: 'province',
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
          },
          {
            title: '电话/手机',
            dataIndex: 'phone',
            key: 'phone',
          },
          {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            width: 240,
            customRender: (text, record, index) => {
              return (
                <div>
                  <a-button
                    type='link'
                    onClick={() => {
                      this.selectAddress(record)
                    }}
                  >
                    使用此地址
                  </a-button>
                  <a-divider type='vertical' />
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
                    {record.isDefault === 1 ? '默认' : '设为默认'}
                  </a-button>
                </div>
              )
            },
          },
        ],
        pno: 1,
        keyword: '',
        perpage: '',
        totalCount: 0,
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'tableHeight', 'tableWidth', 'pageSize']),
    },
    mounted() {
      this.perpage = this.pageSize
      this.$getLPTableSize()
      this._getAddressList()
    },
    methods: {
      // 全局搜索
      globalSearch(value) {
        this.pno = 1
        this.keyword = value
        this._getAddressList()
      },
      // page变化
      tablePageChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize ? pageSize : this.pageSize
        this._getAddressList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this._getAddressList()
      },
      _getAddressList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          keyword: this.keyword,
        }
        getAddressList(data).then(res => {
          this.$addListId(res.data, 'addressId', false)
          this.tableList = res.data
          this.totalCount = res.totalCount
        })
      },
      // 选择地址
      selectAddress(item) {
        this.$bus.$emit('modifyAddress', item)
        this.$globalDrawer.close()
      },
      // 编辑地址信息
      editAdress(addressType, addressInfo) {
        this.addressModalVisible = true
        this.addressType = addressType
        this.addressInfo = addressInfo
      },
      // 设置默认地址
      setDefaultAddress(record, index) {
        if (record.isDefault === 1) {
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
            this.$bus.$emit('setDefaultAddress', record)
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
            let data = {
              id: record.addressId,
            }
            operateAdress(data).then(res => {
              this.$message.success('已删除！')
              this.selectAll = false
              this.selectedRowKeys = []
              this._getAddressList()
            })
          },
          onCancel() {},
        })
      },
      // 关闭地址弹窗
      closeAddressModal(e) {
        this.addressModalVisible = false
        if (e.isSubmit) {
          this._getAddressList()
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .address-info-wrp {
    display: flex;
    align-items: center;
    .add {
      display: flex;
      align-items: center;
    }
    .address-info-add {
      font-size: 13px;
      margin-left: 4px;
      margin-right: 14px;
    }
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
  .ant-drawer-body {
    height: 100%;
  }
</style>

<style lang="less">
  //
</style>
