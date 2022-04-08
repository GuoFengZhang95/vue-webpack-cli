import request from '@/utils/request'
import domain from './domain'

/**
 * @description 获取用户是否登录
 * @returns {Promise<{success:boolean,isLogin:boolean}>}
 */
export function getLoginStatus() {
  return request({
    url: '/user/login/info',
    method: 'get',
    // params: data,
    baseURL: domain.Api_Base_Url,
    jsonp: false,
  })
}

// 获取物流订单
export function getExpressInfo(data) {
  return request({
    url: '/common/express/logisticsinfo',
    method: 'get',
    params: data,
    baseURL: domain.Mall_Base_Url,
  })
}

// 获取产品分类
export function getProductCata(data) {
  return request({
    url: '/seller/catalog/list',
    method: 'get',
    params: data,
    baseURL: domain.Mall_Base_Url,
  })
}

// 获取用户信息
export function getBaseUserInfo(data) {
  return request({
    url: '/web/getUserInfo',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}

// 获取通知列表
export function getSystemNoticeList(data) {
  return request({
    url: '/app/yqmm/notice/list',
    method: 'get',
    params: data,
    baseURL: domain.Mis_Service_Url,
  })
}
// 获取通知详情
export function getNoticeDetail(data) {
  return request({
    url: '/app/yqmm/notice/detail',
    method: 'get',
    params: data,
    baseURL: domain.Mis_Service_Url,
  })
}

// 获取文件的阿里云下载地址
export function getAliyunOSSUrl(data) {
  return request({
    url: '/app/aliyun/oss/generateUrl',
    method: 'get',
    params: data,
    baseURL: domain.Mis_Service_Url,
  })
}

/**
 * @description 获取文件在阿里云的动态下载地址
 * @param {object} data
 * @param {string} data.fileUrl
 * @returns
 */
export function getFileUrl(data) {
  return request({
    url: '/web/aliyun/oss/generatePreSignedUrl',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}

// 获取商机提醒列表
export function getBusinessRemind(data) {
  return request({
    url: '/web/saas/business/remind',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}
