<template>
  <div id="page-sass-invoice-mine" class="content-page-wrp">
    <div class="except-bottom-operations">
      <MuPageHeader
        :show-reload="false"
        sub-title="增税普票"
        @parentReload="parentReload"
      ></MuPageHeader>
      <MuTopOperations :show-reload="false">
        <template #operations>
          <div class="invoice-info-wrp ml24 center-flex">
            <div v-if="tableList.length <= 14" class="btn-operation">
              <a-icon type="plus-square" color="white"></a-icon>
              <span style="cursor: pointer" @click="editInvoice('add', 1, {})">
                新增普票
              </span>
            </div>
            <img src />
            <span class="invoice-info-tips">
              增值税普通发票最多15条，还能添加
              <a-button type="link">{{ 15 - tableList.length }}</a-button>
              条
            </span>
          </div>
        </template>
      </MuTopOperations>
      <common-table
        :loading="loading"
        :scroll="{}"
        :columns="columns"
        :data-source="tableList"
        :table-size="tableSize"
      ></common-table>
      <MuPageHeader :show-reload="false" sub-title="增税专票"></MuPageHeader>
      <MuTopOperations :show-reload="false">
        <template #operations>
          <div class="invoice-info-wrp ml24 center-flex">
            <div class="btn-operation">
              <a-icon type="edit" color="white"></a-icon>
              <span
                style="cursor: pointer"
                @click="editInvoice('edit', 2, vatInvoice)"
              >
                编辑专票
              </span>
            </div>
            <!-- <span class="invoice-info-tips">
              <img src />修改信息需要重新提交认证，请谨慎修改信息
            </span> -->
          </div>
        </template>
      </MuTopOperations>
      <div class="a-descriptions-wrp">
        <a-descriptions :column="2">
          <a-descriptions-item label="单位名称">
            <span>{{ vatInvoice.title }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="注册电话">
            <span>{{ vatInvoice.regTel }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="纳税人识别号">
            <span>{{ vatInvoice.taxCode }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="开户银行">
            <span>{{ vatInvoice.bank }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="注册地址">
            <span>{{ vatInvoice.regAddress }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="银行账号">
            <span>{{ vatInvoice.account }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <!-- 编辑增值税发票 -->
    <edit-invoice
      v-if="invoiceModalVisible"
      :invoice-modal-visible="invoiceModalVisible"
      :type="invoiceType"
      :invoice-info="invoiceInfo"
      @commitInvoice="afterInvoiceCommit"
      @closeInvoiceModal="closeInvoiceModal"
    ></edit-invoice>
  </div>
</template>

<script>
  import { getInvoiceList, operateCommonInvoice } from '@/api/eos/index'
  import EditInvoice from './components/EditInvoice'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosMineInvoice',
    components: {
      EditInvoice,
    },
    inject: ['reload'],
    data() {
      return {
        loading: false,
        form: {
          title: '',
          taxCode: '',
          regAddress: '',
          regTel: '',
          bankName: '',
          bankAccount: '',
        },
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
            title: '单位名称',
            dataIndex: 'title',
            key: 'title',
            scopedSlots: { customRender: 'title' },
          },
          {
            title: '纳税人识别号',
            dataIndex: 'taxCode',
            key: 'taxCode',
          },
          {
            title: '注册地址',
            dataIndex: 'regAddress',
            key: 'regAddress',
          },
          {
            title: '注册电话',
            dataIndex: 'regTel',
            key: 'regTel',
          },
          {
            title: '开户银行',
            dataIndex: 'bank',
            key: 'bank',
          },
          {
            title: '银行账号',
            dataIndex: 'account',
            key: 'account',
          },
          {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            customRender: (text, record, index) => {
              return (
                <div>
                  <a-button
                    type='link'
                    onClick={() => {
                      this.editInvoice('edit', 1, record)
                    }}
                  >
                    编辑
                  </a-button>
                  <a-divider type='vertical' />
                  <a-button
                    type='link'
                    onClick={() => {
                      this.operateInvoice(1, record, index)
                    }}
                  >
                    {record.isDefault ? '默认' : '设为默认'}
                  </a-button>
                  <a-divider type='vertical' />
                  <a-button
                    type='link'
                    onClick={() => {
                      this.operateInvoice(2, record, index)
                    }}
                  >
                    删除
                  </a-button>
                </div>
              )
            },
          },
        ],
        // 表格数据
        tableList: [],
        invoiceInfo: {},
        invoiceType: 1,
        // 发表编辑弹窗
        invoiceModalVisible: false,
        //专票信息
        vatInvoice: {},
      }
    },
    computed: {
      ...mapGetters(['tableSize']),
    },
    watch: {},
    mounted() {
      this._getInvoiceList()
    },
    methods: {
      parentReload() {
        this.reload()
      },
      _getInvoiceList() {
        this.loading = true
        getInvoiceList()
          .then(res => {
            this.$addListId(res.data.normal, 'taxCode')
            this.tableList = res.data.normal
            Object.assign(this.vatInvoice, res.data.vat)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      // 编辑发票
      editInvoice(type, invoiceType, record) {
        // type： add新增、edit编辑
        // invoiceType： 1:普票 2:专票
        // record 行信息
        this.invoiceModalVisible = true
        this.invoiceInfo = record
        this.invoiceType = invoiceType
      },
      // 关闭发票弹窗
      closeInvoiceModal() {
        this.invoiceModalVisible = false
      },
      afterInvoiceCommit() {
        this.invoiceModalVisible = false
        this.$message.success('发票编辑成功！')
        this._getInvoiceList()
      },
      // 操作普票 删除/设为默认
      operateInvoice(type, record, index) {
        let data = {
          id: record.id,
          type,
        }
        if (type === 2) {
          this.$confirm({
            title: '是否删除当前发票？',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              operateCommonInvoice(data).then(res => {
                this.tableList.splice(index, 1)
                this.$message.success('删除成功！')
              })
            },
            onCancel() {},
          })
        } else if (type == 1) {
          if (record.isDefault == 1) {
            this.$message.warn('请勿重复设置！')
          } else {
            operateCommonInvoice(data).then(res => {
              this.tableList.forEach(item => {
                item.isDefault = 0
              })
              this.tableList[index].isDefault = 1
            })
          }
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .title-text {
    border: 1px solid rebeccapurple;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .edit-style {
    position: relative;
    background-color: #fff;
    background-clip: padding-box;
    border: 0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    width: 765px;
    height: 546px;
  }
  .invoice-info-wrp {
    img {
      margin-left: 10px;
      margin-right: 4px;
    }
    .invoice-info-tips {
      font-size: 12px;
      color: #999;
    }
  }
  .a-descriptions-wrp {
    margin-left: 24px;
    span {
      color: #000;
    }
  }
  .edit-form-wrp {
    margin-top: 16px;
  }
</style>
