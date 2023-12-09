import request from '@/utils/request'

export function QueryPersonDoorAuthList(data) {
  return request({
    url: 'Hikvision/QueryPersonDoorAuthList',
    method: 'post',
    data
  })
}

export function queryPersonList(name) {
  return request({
    url: '/Hikvision/QueryPersonIdNameList?name=' + name,
    method: 'get',
  })
}

export function QueryDoorDeviceDict(keyword) {
  return request({
    url: '/Hikvision/QueryDoorDeviceDict?keyword=' + keyword,
    method: 'get',
  })
}

export default { QueryPersonDoorAuthList, queryPersonList, QueryDoorDeviceDict }
