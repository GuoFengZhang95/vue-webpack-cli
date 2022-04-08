<template>
  <div class="system-member">
    <div v-if="memberAuthType === 1" class="table-pad">
      <MuTable
        ref="mumuTable"
        row-key="id"
        :has-index="true"
        :is-loading="isLoading"
        :selections-flag="true"
        :selections-all-flag="true"
        :selections-toggle-flag="true"
        :setting-act-flag="false"
        :page="page"
        :page-size="pageSize"
        :total="total"
        :columns="columns"
        :data-source="dataSource"
        :resize-height-offset="163"
        :selected-row-keys="selectedRowKeys"
        @pageChange="pageChange"
        @filterFlag="filterFlag"
        @pageSizeChange="pageSizeChange"
        @selectChange="selectChange"
        @reloadTable="reloadTable"
        @handleFilter="handleFilter"
        @handleRowClick="handleRowClick"
      >
        <template slot="selection">
          <a-button
            type="primary"
            class="action-btn"
            @click="openDeleteModal(true)"
          >
            <img
              src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-close.svg"
              alt="icon"
            />
            <span>批量移除</span>
          </a-button>
          <a-button
            type="primary"
            class="action-btn"
            @click="openSetRoleModal(true, undefined)"
          >
            <img
              src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-person.svg"
              alt="icon"
            />
            <span>设置角色</span>
          </a-button>
          <a-button
            type="primary"
            class="action-btn"
            @click="openSetAuthModal(true, undefined)"
          >
            <img
              src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-auth.svg"
              alt="icon"
            />
            <span>数据权限</span>
          </a-button>
          <a-button
            type="primary"
            class="action-btn"
            @click="handleAddEquityModal(true)"
          >
            <img
              src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-square-plus.svg"
              alt="icon"
            />
            <span>添加企业权益</span>
          </a-button>
          <a-button
            type="primary"
            class="action-btn"
            @click="openCancelEquityModal(true)"
          >
            <img
              src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-circle-minus.svg"
              alt="icon"
            />
            <span>取消企业权益</span>
          </a-button>
        </template>
        <template slot="action">
          <div class="search-action">
            <MuSearchGroup
              :placeholder="searchPlaceholder"
              :select-visible="false"
              :has-filter="hasFilter"
              @resetFilter="resetFilter"
              @search="handleInput"
            ></MuSearchGroup>
          </div>
        </template>
      </MuTable>
    </div>

    <auth-tips
      v-if="memberAuthType === 2 || memberAuthType === 3"
      :auth-type="memberAuthType"
    ></auth-tips>

    <delete-member
      v-if="deleteVisible"
      :visible="deleteVisible"
      :is-batch="isBatch"
      :selected-count="selectedCount"
      @action="handleDeleteAction"
    ></delete-member>

    <set-member-auth
      v-if="authVisible"
      :visible="authVisible"
      :default-value="authDefaultValue"
      @action="handleAuthAction"
    ></set-member-auth>

    <set-member-role
      v-if="roleVisible"
      :visible="roleVisible"
      :select-role-value="selectRoleValue"
      @action="handleRoleAction"
    ></set-member-role>

    <cancel-equity
      v-if="cancelEquityVisible"
      :visible="cancelEquityVisible"
      :is-batch="isBatch"
      :selected-count="selectedCount"
      @action="handleCancelEquityAction"
    ></cancel-equity>

    <add-equity
      v-if="addEquityVisible"
      :visible="addEquityVisible"
      :selected-count="selectedCount"
      @action="handleAddEquityAction"
    ></add-equity>
  </div>
</template>

<script>
  import { tableMix } from '@/mixin/index'
  import {
    DeleteMember,
    SetMemberAuth,
    SetMemberRole,
    CancelEquity,
    AddEquity,
  } from './components'
  import {
    getCompanyMemberList,
    cancelCompanyEquity,
    addCompanyEquity,
    setMemberRole,
    deleteMember,
    queryMemberName,
    updateAuth,
  } from '@/api/system/member'
  import { getMemberAuth } from '@/api/yqmmPro/public'
  import { mapGetters } from 'vuex'

  const roleAction = {
    label: '设置角色',
    value: 'setRole',
    key: 'setRole',
    disabled: false,
  }
  const dataAuthAction = {
    label: '数据权限',
    value: 'dataAuth',
    key: 'dataAuth',
    disabled: false,
  }
  const addEquityAction = {
    label: '添加企业权益',
    value: 'addEquity',
    key: 'addEquity',
    disabled: false,
  }
  const cancelEquityAction = {
    label: '取消企业权益',
    value: 'cancelEquity',
    key: 'cancelEquity',
    disabled: false,
  }
  const deleteAction = {
    label: '移除',
    value: 'delete',
    key: 'delete',
    disabled: false,
  }

  export default {
    name: 'YqmmproMember',
    components: {
      DeleteMember,
      SetMemberAuth,
      SetMemberRole,
      CancelEquity,
      AddEquity,
    },
    mixins: [tableMix],
    data() {
      return {
        searchPlaceholder: '电话',
        companyId: '',
        queryObj: {
          companyEquity: null,
          companyId: '',
          role: null,
          searchKey: '',
          searchType: '1',
          userIds: '',
          pageNum: 1,
          pageSize: 20,
        },
        hasFilter: '', // 是否有筛选条件标识
        selectAll: false,
        selectRoleValue: 0,
        columns: [
          {
            dataIndex: 'realName',
            title: '姓名',
            filter: ['search'],
            filterKey: 'realName',
            checkOpts: [],
          },
          {
            width: 150,
            dataIndex: 'mobile',
            title: '电话',
          },
          {
            dataIndex: 'position',
            title: '职务',
          },
          {
            dataIndex: 'role',
            title: '角色',
            filter: ['search'],
            filterKey: 'role',
            checkOpts: [],
          },
          {
            width: 100,
            dataIndex: 'companyEquityName',
            title: '企业权益',
            filter: ['search'],
            filterKey: 'companyEquity',
            checkOpts: [],
          },
          {
            width: 320,
            dataIndex: 'actions',
            title: '操作',
            type: 'action',
            splitType: '|',
            align: 'left',
          },
        ],

        deleteVisible: false,
        authVisible: false,
        roleVisible: false,
        cancelEquityVisible: false,
        addEquityVisible: false,
        authDefaultValue: [],
        currentActionId: null,
        isBatch: false,
        actionParams: {
          companyId: '',
          userIds: '',
          companyEquity: '',
          role: '',
          ids: '',
          isAll: '',
          newRole: '',
          searchKey: '',
          searchType: 1,
          newModules: '',
        },
        memberAuthType: null,
        canClick: true,
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
      selectedCount() {
        return this.selectAll ? this.total : this.selectedRowKeys.length
      },
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        this.companyId = this.baseUserInfo && this.baseUserInfo.companyId
        this.actionParams.companyId = this.companyId

        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.loadFilterData()
        this.defaultTableInit()
      },
      async hasAuth() {
        let { code, data } = await getMemberAuth({
          companyId: this.companyId,
        })
        let authType = 2
        if (code === '0') {
          authType = data.menuAuthority
        } else {
          authType = 2
        }
        return authType
      },
      // 加载表头筛选数据
      async loadFilterData() {
        let { code, data } = await queryMemberName({
          companyId: this.companyId,
          pageNum: 1,
          pageSize: 999999,
        })
        if (code === '0') {
          this.columns.forEach(item => {
            if (item.dataIndex === 'realName') {
              item.checkOpts =
                data.list &&
                data.list.map(e => {
                  return {
                    value: e.userId,
                    label: e.realName,
                  }
                })
            }
          })
        }
      },
      // 列表数据
      async defaultTableInit() {
        this.selectAll = false
        let { filterObj } = this
        Object.assign(this.queryObj, {
          companyEquity: this._hasVal(filterObj, 'companyEquity')
            ? filterObj.companyEquity.value.join(',')
            : '',
          role: this._hasVal(filterObj, 'role')
            ? filterObj.role.value.join(',')
            : '',
          userIds: this._hasVal(filterObj, 'realName')
            ? filterObj.realName.value.join(',')
            : '',
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        Object.assign(this.actionParams, {
          companyEquity: this.queryObj.companyEquity,
          role: this.queryObj.role,
          userIds: this.queryObj.userIds,
        })
        await this.handleQuery()
      },
      _hasVal(obj, val) {
        return Object.prototype.hasOwnProperty.call(obj, val)
      },
      // 加载列表
      async handleQuery() {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.selectedRowKeys = []
        this.isLoading = true
        this.queryObj.companyId = this.companyId
        let { code, data } = await getCompanyMemberList(this.queryObj)
        this.isLoading = false
        if (code === '0') {
          if (!data.list) return false
          this.total = data.total
          let { roleList, companyEquityList } = data.searchList
          data.list.forEach(item => {
            let roles = item.roleIds ? item.roleIds : '1'
            let maxRole = this._getMaxRoleAuth(roles)
            let result = Object.assign(item, {
              role: this._getMultiRole(item.roleIds, roleList),
              companyEquityName: this._getTargetObj(
                item.companyEquity,
                companyEquityList
              ).name,
              // 0 管理员， 2 协同管理员，3 主要成员，1 普通成员
              actions:
                maxRole === 1
                  ? [roleAction, dataAuthAction, deleteAction]
                  : maxRole === 0
                  ? '-'
                  : maxRole === 2 || maxRole === 3
                  ? [roleAction, deleteAction]
                  : null,
            })
            this._setEquityActions({
              list: result.actions,
              equity: item.companyEquity,
              count: item.equityCount,
            })
            return result
          })
          this.dataSource = data.list
          // 筛选项
          this.columns.forEach(item => {
            switch (item.dataIndex) {
              case 'role':
                item.checkOpts = this._formatFilterList(roleList)
                break
              case 'companyEquityName':
                item.checkOpts = this._formatFilterList(companyEquityList)
                break
            }
          })
        }
      },
      _setEquityActions(opts) {
        if (opts.list === '-') return
        // 企业权益： 0 无，1 有
        if (opts.equity === 1) {
          opts.list.splice(-1, 0, cancelEquityAction)
        } else if (opts.equity === 0) {
          if (opts.count > 0) {
            opts.list.splice(-1, 0, addEquityAction)
          }
        }
      },
      _getMaxRoleAuth(roles) {
        if (!roles) return
        // 0 管理员， 2 协同管理员，3 主要成员，1 普通成员
        if (roles.indexOf('0') !== -1) {
          return 0
        } else if (roles.indexOf('2') !== -1) {
          return 2
        } else if (roles.indexOf('3') !== -1) {
          return 3
        } else {
          return 1
        }
      },
      _getMultiRole(roles, list) {
        if (!roles) return
        let roleArr = roles.split(',')
        let result = []
        roleArr.forEach(e => {
          list.forEach(ee => {
            e = Number(e)
            if (e === ee.id) {
              result.push(ee.name)
            }
          })
        })
        return result.join('，')
      },
      _getTargetObj(id, list) {
        return list.find(e => {
          return e.id === id
        })
      },
      _formatFilterList(list) {
        return list.map(e => {
          return {
            value: e.id,
            label: e.name,
          }
        })
      },
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (clickType === 'action') {
          this.currentActionId = String(record.id)
          switch (rowData.key) {
            case 'delete':
              this.openDeleteModal(false)
              break
            case 'dataAuth':
              this.openSetAuthModal(false, record.moduleAuthority)
              break
            case 'setRole':
              this.openSetRoleModal(false, record)
              break
            case 'cancelEquity':
              this.openCancelEquityModal(false)
              break
            case 'addEquity':
              this.handleAddEquityModal(false)
              break
          }
        }
      },
      // 查询条件更新，查询结果
      handleInput(e) {
        this.queryObj.searchKey = e
        this.queryObj.pageNum = this.page = 1
        this.actionParams.searchKey = e
        this.handleQuery()
      },
      // 页面变更
      pageChange(current, pageSize, tableKey) {
        this.page = current
        this.selectAll = false
        this.selectedRowKeys = []
        this.defaultTableInit()
      },
      // 每页展示条数
      pageSizeChange(current, pageSize, tableKey) {
        this.page = 1
        this.pageSize = pageSize
        this.selectAll = false
        this.selectedRowKeys = []
        this.defaultTableInit()
      },
      // 打开删除弹框
      async openDeleteModal(isBatch) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.deleteVisible = true
        this.isBatch = isBatch
      },
      // 删除
      async handleDeleteAction(type) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) {
          this.deleteVisible = false
          return
        }

        if (type === 'submit') {
          if (!this.canClick) return
          this.actionParams.isAll = this.isBatch && this.selectAll
          this.actionParams.newRole = ''
          this.actionParams.newModules = ''
          this.actionParams.ids = this.isBatch
            ? this.selectedRowKeys
            : [this.currentActionId]
          this.canClick = false
          let { code } = await deleteMember(this.actionParams)
          this.canClick = true
          if (code === '0') {
            this.$message.success('操作成功！')
            this.reloadTable()
          }
        }
        this.deleteVisible = false
      },
      // 打开设置权限
      async openSetAuthModal(isBatch, menuAuth) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.isBatch = isBatch
        this.authVisible = true
        this.authDefaultValue = menuAuth ? menuAuth.split(',') : []
      },
      // 设置权限
      async handleAuthAction(e) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) {
          this.authVisible = false
          return
        }

        if (e.type === 'submit') {
          if (!this.canClick) return
          this.actionParams.isAll = this.isBatch && this.selectAll
          this.actionParams.newRole = ''
          this.actionParams.newModules = e.value.join(',')
          this.actionParams.ids = this.isBatch
            ? this.selectedRowKeys
            : [this.currentActionId]
          this.canClick = false
          let { code } = await updateAuth(this.actionParams)
          this.canClick = true
          if (code === '0') {
            this.$message.success('操作成功！')
            this.defaultTableInit()
          }
        }
        this.authVisible = false
      },
      // 设置成员角色
      async openSetRoleModal(isBatch, row) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.isBatch = isBatch
        this.roleVisible = true
        let id = 2
        if (row && row.roleIds) {
          id = this._getMaxRoleAuth(row.roleIds)
        }
        this.selectRoleValue = id
      },
      // 设置角色
      async handleRoleAction(e) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) {
          this.roleVisible = false
          return
        }

        if (e.type === 'submit') {
          if (!this.canClick) return
          this.actionParams.isAll = this.isBatch && this.selectAll
          this.actionParams.newRole = e.roleType
          this.actionParams.newModules = ''
          this.actionParams.ids = this.isBatch
            ? this.selectedRowKeys
            : [this.currentActionId]
          this.canClick = false
          let { code } = await setMemberRole(this.actionParams)
          this.canClick = true
          if (code === '0') {
            this.$message.success('操作成功！')
            this.defaultTableInit()
          }
        }
        this.roleVisible = false
      },
      // 批量取消企业权益
      async openCancelEquityModal(isBatch) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.cancelEquityVisible = true
        this.isBatch = isBatch
      },
      // 取消企业权益操作
      async handleCancelEquityAction(type) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) {
          this.cancelEquityVisible = false
          return
        }

        if (type === 'submit') {
          if (!this.canClick) return
          this.actionParams.isAll = this.isBatch && this.selectAll
          this.actionParams.newRole = ''
          this.actionParams.newModules = ''
          this.actionParams.ids = this.isBatch
            ? this.selectedRowKeys
            : [this.currentActionId]
          this.canClick = false
          let { code } = await cancelCompanyEquity(this.actionParams)
          this.canClick = true
          if (code === '0') {
            this.$message.success('操作成功！')
            this.defaultTableInit()
          }
        }
        this.cancelEquityVisible = false
      },
      // 添加企业权益
      async handleAddEquityModal(isBatch) {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) return

        this.isBatch = isBatch
        // 批量添加，先校验额度
        if (isBatch) {
          this.addEquityVisible = true
        } else {
          await this.addEquityCallback()
        }
      },
      handleAddEquityAction(type) {
        if (type === 'submit') {
          this.addEquityCallback()
        }
        this.addEquityVisible = false
      },
      // 添加企业成员权益方法
      async addEquityCallback() {
        this.memberAuthType = await this.hasAuth()
        if (this.memberAuthType !== 1) {
          this.addEquityVisible = false
          return
        }

        if (!this.canClick) return
        this.actionParams.isAll = this.isBatch && this.selectAll
        this.actionParams.newRole = ''
        this.actionParams.newModules = ''
        this.actionParams.ids = this.isBatch
          ? this.selectedRowKeys
          : [this.currentActionId]
        this.canClick = false
        let { code } = await addCompanyEquity(this.actionParams)
        this.canClick = true
        if (code === '0') {
          this.$message.success('操作成功！')
          this.addEquityVisible = false
          this.defaultTableInit()
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .system-member {
    .action-btn {
      img {
        margin-right: 4px;
        margin-top: -1px;
      }
    }

    .search-action {
      display: flex;

      .reset-search-btn {
        width: 104px;
        height: 32px;
        opacity: 1;
        border: 1px solid #00c7db;
        border-radius: 17px;
        text-align: center;
        line-height: 32px;
        margin-left: 24px;
        font-weight: 400;
        color: #00c7db;
        font-size: 14px;
        cursor: pointer;

        img {
          height: 12px;
          opacity: 0.65;
          vertical-align: -1px;
        }
      }
    }
  }
</style>

<style lang="less"></style>
