import request from '@/utils/request'

export function GetHikAccessGroupList(data) {
  return request({
    url: 'Hikvision/GetHikAccessGroupList',
    method: 'post',
    data
  })
}
export function GetHikRoleList(data) {
  return request({
    url: 'Hikvision/GetHikRoleList',
    method: 'post',
    data
  })
}

export default { GetHikAccessGroupList, GetHikRoleList }
