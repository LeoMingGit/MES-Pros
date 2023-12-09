import request from '@/utils/request'

export function AddHikAccessDevice(data) {
  return request({
    url: 'Hikvision/AddHikAccessDevice',
    method: 'post',
    data
  })
}

export function EditHikAccessDevice(data) {
  return request({
    url: 'Hikvision/EditHikAccessDevice',
    method: 'post',
    data
  })
}

export function QueryParentFactoryDict(keyword) {
  return request({
    url: '/Hikvision/QueryParentFactoryDict?keyword=' + keyword,
    method: 'get',
  })
}

export function QueryFunctionDict(keyword) {
  return request({
    url: '/Hikvision/QueryFunctionDict?keyword=' + keyword,
    method: 'get',
  })
}

export function QueryHikAccessDeviceList(data) {
  return request({
    url: '/Hikvision/QueryHikAccessDeviceList',
    method: 'post',
    data
  })
}

export function DeleteHikAccessDevice(data) {
  return request({
    url: '/Hikvision/DeleteHikAccessDevice',
    method: 'post',
    data
  })
}

export default { AddHikAccessDevice, EditHikAccessDevice, QueryParentFactoryDict, QueryFunctionDict, QueryHikAccessDeviceList, }
