<template>
  <div class="edit-address-wrp">
    <a-modal
      :title="addressTitle"
      :centered="true"
      :footer="null"
      width="740px"
      :visible="addressModalVisible"
      :destroy-on-close="true"
      @cancel="cancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="收货人：" prop="receiver">
          <a-input
            v-model="form.receiver"
            placeholder="请填写收货人姓名"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="电话/手机号" prop="phone">
          <a-input v-model="form.phone" placeholder="请填写电话/手机"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所在地区">
          <a-cascader
            :value="regionIds"
            :options="regionOptions"
            :load-data="loadData"
            placeholder="省/市/区"
            @change="onRegionChange"
          ></a-cascader>
        </a-form-model-item>
        <a-form-model-item ref="detail" label="详细地址" prop="detail">
          <a-input v-model="form.detail" placeholder="请填写详细地址"></a-input>
        </a-form-model-item>
        <div class="edit-address-checkbox">
          <a-checkbox
            v-if="addressType != 'temporary'"
            v-model="form.isDefault"
            @change="setIsDefault"
          >
            设为默认地址
          </a-checkbox>
        </div>
      </a-form-model>
      <div class="confirm clearfix">
        <a-button
          type="primary"
          class="fr"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { editAdress, getRegionList } from '@/api/eos/index'
  // ========== 表单验证 ==========
  // 验证收货人（判断必填）
  let validateReceiver = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入收货地址！'))
    } else {
      callback()
    }
  }
  // 验证电话/手机号（判断必填）
  let validatePhone = (rule, value, callback) => {
    // let regMobilePhone = new RegExp('^(1[3-9]{1}\\d{9}|0\\d{2,3}-\\d{8})$')
    if (value === '') {
      callback(new Error('请输入电话/手机号！'))
    } else {
      callback()
    }
  }
  // 验证详细地址（判断必填）
  let validateDetail = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入详细地址！'))
    } else {
      callback()
    }
  }
  export default {
    name: 'EditAddress',
    props: {
      addressModalVisible: {
        type: Boolean,
        default: false,
      },
      // 编辑时的地址信息
      addressInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
      // 编辑 或者 新增
      addressType: {
        type: String,
        default: 'add',
      },
    },
    data() {
      return {
        addressTitle: '',
        loading: false,
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
        regionOptions: [],
        selectedOptions: [], //选中项集合
        form: {
          receiver: '',
          phone: '',
          detail: '',
          isDefault: false,
          provinceId: '',
          cityId: '',
          districtId: '',
          id: '',
        },
        regionInfo: {},
        regionIds: [],
        // 表单验证
        rules: {
          receiver: [{ validator: validateReceiver, trigger: 'blur' }],
          phone: [{ validator: validatePhone, trigger: 'blur' }],
          detail: [{ validator: validateDetail, trigger: 'blur' }],
        },
      }
    },
    computed: {},
    watch: {
      addressInfo: {
        handler(newVal) {
          this.regionInfo = newVal
          if (this.addressType == 'edit') {
            // 填充表格
            this.regionIds = [
              newVal.provinceId,
              newVal.cityId,
              newVal.districtId,
            ]
            this.form.receiver = newVal.receiver
            this.form.detail = newVal.detail
            this.form.phone = newVal.phone
            this.form.isDefault = newVal.isDefault ? true : false
            this.form.id = newVal.addressId
            // 处理地区
            let provinceData = {
              type: 'province',
            }
            let p1 = getRegionList(provinceData)
            let cityData = {
              type: 'city',
              provinceId: newVal.provinceId,
            }
            let p2 = getRegionList(cityData)
            let districtData = {
              type: 'area',
              cityId: newVal.cityId,
            }
            let p3 = getRegionList(districtData)
            Promise.all([p1, p2, p3]).then(res => {
              res[0].data.forEach(item => {
                item.isLeaf = false
                item.type = 'province'
                item.nextType = 'city'
                item.label = item.province
                item.value = item.id
              })
              this.regionOptions = res[0].data
              // 查询省份在省份列表的index
              let provinceIndex = this.regionOptions.findIndex(item => {
                return item.id === newVal.provinceId
              })
              let cityList = res[1].data
              cityList.forEach(item => {
                item.isLeaf = !item.hasChildren
                item.nextType = 'area'
                item.type = 'city'
                item.label = item.city
                item.value = item.id
              })
              this.$set(this.regionOptions[provinceIndex], 'children', cityList)

              // 查询城市在城市列表的index
              let cityIndex = this.regionOptions[
                provinceIndex
              ].children.findIndex(item => {
                return item.id == newVal.cityId
              })
              let districtList = res[2].data
              districtList.forEach(item => {
                item.isLeaf = true
                item.type = 'area'
                item.label = item.district
                item.value = item.id
              })
              this.$set(
                this.regionOptions[provinceIndex].children[cityIndex],
                'children',
                districtList
              )
            })
          }
        },
        immediate: true,
      },
    },
    mounted() {
      // 设置弹窗标题
      if (this.addressType == 'add') {
        this.addressTitle = '新增地址信息'
      } else if (this.addressType == 'edit') {
        this.addressTitle = '编辑地址信息'
      } else {
        this.addressTitle = '新增临时地址'
      }
      // 获取地区信息
      if (this.addressType === 'add' || this.addressType === 'temporary') {
        let data = {
          type: 'province',
        }
        getRegionList(data).then(res => {
          res.data.forEach(item => {
            item.isLeaf = false
            item.type = 'province'
            item.nextType = 'city'
            item.label = item.province
            item.value = item.id
          })
          this.regionOptions = res.data
        })
      }
    },
    methods: {
      // 手动关闭弹窗
      cancel() {
        let data = {
          isSubmit: false,
        }
        this.$emit('closeAddressModal', data)
      },
      // 是否设为默认地址
      setIsDefault(e) {
        // console.log(e.target.checked)
      },
      // 地区ids
      onRegionChange(value, selectedOptions) {
        this.selectedOptions = selectedOptions
        this.regionIds = value
      },
      // 地区数据懒加载
      loadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        if (targetOption.nextType === 'city') {
          let data = {
            type: 'city',
            provinceId: targetOption.id,
          }
          getRegionList(data).then(res => {
            if (res.data.length) {
              res.data.forEach(item => {
                item.isLeaf = !item.hasChildren
                item.nextType = 'area'
                item.type = 'city'
                item.label = item.city
                item.value = item.id
              })
              targetOption.children = res.data
              this.regionOptions = [...this.regionOptions]
            } else {
              this.$message.warning('暂无更详细的地区信息！')
              this.regionOptions = [...this.regionOptions]
            }
            targetOption.loading = false
          })
        } else if (targetOption.nextType === 'area') {
          let data = {
            type: 'area',
            cityId: targetOption.id,
          }
          getRegionList(data).then(res => {
            if (res.data.length) {
              res.data.forEach(item => {
                item.isLeaf = true
                item.nextType = ''
                item.type = 'area'
                item.label = item.district
                item.value = item.id
              })
              targetOption.children = res.data
              this.regionOptions = [...this.regionOptions]
            } else {
              this.$message.warning('暂无更详细的地区信息！')
              this.regionOptions = [...this.regionOptions]
            }
            targetOption.loading = false
          })
        }
      },
      // 处理地区id
      dealRegionIds(provinceId, cityId, districtId) {
        this.form.provinceId = provinceId ? provinceId : ''
        this.form.cityId = cityId ? cityId : ''
        this.form.districtId = districtId ? districtId : ''
      },
      // 确认
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 验证省市区信息
            if (this.regionIds.length >= 2) {
              this.dealRegionIds(...this.regionIds)
              let data = { ...this.form }
              data.isDefault = data.isDefault ? 1 : 0
              this.loading = true
              if (this.addressType == 'temporary') {
                this.loading = false
                // 更新父级页面临时地址信息
                let parentData = {
                  receiver: this.form.receiver,
                  phone: this.form.phone,
                  detail: this.form.detail,
                }
                this.selectedOptions.forEach((item, index) => {
                  switch (index) {
                    case 0:
                      parentData.province = item.label
                      break
                    case 1:
                      parentData.city = item.label
                      break
                    case 2:
                      parentData.district = item.label
                      break
                    default:
                      break
                  }
                })
                this.$emit('setTemporaryAddress', parentData)
                this.$emit('closeAddressModal', { isSubmit: false })
              } else {
                editAdress(data)
                  .then(res => {
                    this.loading = false
                    this.$message.success('提交成功')
                    this.$emit('closeAddressModal', { isSubmit: true })
                    this.$bus.$emit('loadList')
                  })
                  .catch(err => {
                    this.loading = false
                  })
              }
            } else {
              this.$message.error('请填写完整的地区信息！')
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .edit-address-checkbox {
    padding-left: 148px;
  }
</style>
<style lang="less"></style>
