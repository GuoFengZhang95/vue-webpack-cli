import request from '@/utils/request'
import domain from './domain'

/**
 * @description 获取解锁信息统计数据
 * @returns {Promise<{code:string,data:{biddingCount:number|null,businessCount:number|null,customerCount:number|null,importantBusinessCount:number|null,purchaseAnalysisCount:number|null,purchaseCount:number|null}}>}
 */
export function getCompanyUnlockStat() {
  return request({
    url: '/web/saas/companyManagement/getCompanyUnlockStat',
    method: 'post',
    // data,
    baseURL: domain.App_Web_Base_Url,
  })
}

// 获取用户配置信息
export function getUserConfigInfo(data) {
  return request({
    url: '/web/commonInfo/getUserConfigInfo',
    method: 'get',
    params: data,
    baseURL: domain.App_Web_Base_Url,
  })
}

// 更新用户配置信息
export function updateUserConfigInfo(data) {
  return request({
    url: '/web/commonInfo/updateUserConfigInfo',
    method: 'post',
    data,
    baseURL: domain.App_Web_Base_Url,
  })
}
