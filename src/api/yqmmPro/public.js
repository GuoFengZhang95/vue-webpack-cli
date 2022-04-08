import request from '@/utils/request'
import domain from '../domain'

// 获取解锁商机列表 （1客源，2采购意向，3标讯，4重大商情，5接单）
export function getUnLockList(data) {
  return request({
    url: '/web/saas/unlockData/getUnLockList',
    method: 'post',
    data,
    baseURL: domain.App_Web_Base_Url,
  })
}

/**
 * @description 校验权限(企业成员) 是否可以访问成员管理
 * @param {*} data
 * @returns 1可以访问 2无卡导致无权限 3权限不足
 */
export function getMemberAuth(data) {
  return request({
    url: '/web/getProAuthority',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}
/**
 * @description 校验权限 是否可查看已解锁信息列表
 * @param {object} data
 * @param {number} data.companyId
 * @param {number} data.module 1客源，2采购意向，3标讯，4重大商情，5接单
 * @returns {Promise<{data:{menuAuthority:1|2|3}}>} 1有权限 2无权限(无卡/无企业) 3无权限（有卡的企业用户但是管理员没有开权限）
 */
export function getUnlockAuth(data) {
  return request({
    url: '/web/getProUnLockListAuthority',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}
/**
 * @description 点赞 取消点赞
 * @param {string|number} data.targetId
 * @param {string|number} data.module 1资讯、2产品、3展会、4企业、5商机、6评论 7方案 8圈子 9 找人 10标讯 11采购意向 12客源 历史原因 标讯采购意向暂时传1
 * @param {string|number} data.action 1点赞 2取消点赞
 * @returns {Promise<{success:boolean,msg: string}>}
 */
export function like(data = {}) {
  data.isRelease = process.env.ENV === '' ? 1 : 0
  return request({
    url: '/web/like/save',
    method: 'post',
    data,
    baseURL: domain.App_Web_Base_Url,
  })
}
/**
 * @description 收藏 取消收藏
 * @param {string|number} data.targetId
 * @param {string|number} data.module 1资讯、2产品、3展会、4企业、5商机、6评论 7方案 8圈子 9 找人 10标讯 11采购意向 12客源
 * @param {string|number} data.action 1收藏 2取消收藏
 * @returns {Promise<{success:boolean,msg: string}>}
 */
export function collect(data = {}) {
  data.isRelease = process.env.ENV === '' ? 1 : 0
  return request({
    url: '/web/collect/save',
    method: 'post',
    data,
    baseURL: domain.App_Web_Base_Url,
  })
}

/**
 * @description 获取仪器买卖小程序码
 * @param {object} data
 * @param {boolean} data.autoColor
 * @param {boolean} data.isHyaLine
 * @param {object} data.lineColor
 * @param {string} data.page
 * @param {string} data.path
 * @param {string} data.scene
 * @param {number} data.width
 * @returns
 */
export function getYqmmQrCode(data) {
  return request({
    url: '/app/yqmm/preview/getPublicYqmmPreviewQRCode',
    method: 'post',
    data,
    baseURL: domain.Mis_Service_Url,
  })
}
/**
 * @description 获取仪器买卖各模块热搜
 * @param {object} data
 * @param {boolean} data.searchType 搜索类型：1-首页搜索、2-标讯搜索、3-采购单位搜索、4-中标单位搜索、5-需求搜索 6-资讯搜索 7-采购意向搜索 8-采购方分析搜索 9客源搜索
 * @returns {Promise<{code:'0'|'1',msg:string,data:[{id:number,searchKey:string,createTime:string}]}>}
 */
export function getYqmmHotSearchByModule(data) {
  return request({
    url: '/web/yqmm/keyWordSearch/getHotSearch',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}

/**
 * @description 新增仪器买卖搜索记录
 * @param {object} data
 * @param {boolean} data.isHotSearch     是否添加热门搜索：搜索是否有返回结果
 * @param {string} data.searchClient 	 注册客户端，1-Web（默认）、2-Wap、3-APP、4-微信小程序、5-应用
 * @param {string} data.searchKey
 * @param {string} data.searchPlatform  搜索平台，1-商城（默认）、2-仪器+、3-有需必应、4-翰林院、5-仪器买卖、6-木木课堂、7-芝麻研、8-SAAS分销、9-CMS
 * @param {number} data.searchType 		 搜索类型：1-首页搜索、2-标讯搜索、3-采购单位搜索、4-中标单位搜索、5-需求搜索 6-资讯搜索 7-采购意向搜索 8-采购方分析搜索 9-客源搜索
 * @returns
 */
export function addYqmmSearchLog(data) {
  return request({
    url: '/web/yqmm/keyWordSearch/addSearchLog',
    method: 'post',
    data,
    baseURL: domain.App_Web_Base_Url,
  })
}
/**
 * @description 获取仪器买卖搜索记录
 * @param {object} data
 * @param {number} data.searchType 		 搜索类型：1-首页搜索、2-标讯搜索、3-采购单位搜索、4-中标单位搜索、5-需求搜索 6-资讯搜索 7-采购意向搜索 8-采购方分析搜索 9-客源搜索
 * @returns {Promise<{code: '0'|'1',data: {yqmmHotSearchs:Array,yqmmSearchLogs:array}}>}
 */
export function getYqmmSearchLog(data) {
  return request({
    url: '/web/yqmm/keyWordSearch/getSearchLog',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}
/**
 * @description 清空搜索记录
 * @param {object} data
 * @param {number} data.searchType
 */
export function deleteYqmmSearchLog(data) {
  return request({
    url: '/web/yqmm/keyWordSearch/deleteSearchLog',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}
