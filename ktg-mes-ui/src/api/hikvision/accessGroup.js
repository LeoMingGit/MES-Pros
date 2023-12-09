import request from '@/utils/request'

export function addAccessGroup(data) {
  return request({
    url: 'Hikvision/AddAccessGroup',
    method: 'post',
    data
  })
}

export function editAccessGroup(data) {
  return request({
    url: 'Hikvision/UpdateAccessGroup',
    method: 'post',
    data
  })
}
export function EditAccessDetailDoor(data) {
  return request({
    url: 'Hikvision/EditAccessDetailDoor',
    method: 'post',
    data
  })
}
export function queryFactoryDict(keyword) {
  return request({
    url: '/Hikvision/QueryFactoryDict?keyword=' + keyword,
    method: 'get',
  })
}

export function queryAccessDoorGroup(keyword) {
  return request({
    url: '/Hikvision/QueryAccessDoorGroupList?keyword=' + keyword,
    method: 'get',
  })
}

export function queryPrincipalList(name) {
  return request({
    url: '/Hikvision/QueryPersonList?name=' + name,
    method: 'get',
  })
}

export function QueryAccessGroupDetail(groupId) {
  return request({
    url: '/Hikvision/QueryAccessGroupDetail?groupId=' + groupId,
    method: 'get',
  })
}
export function AddAccessDetailDoor(data) {
  return request({
    url: '/Hikvision/AddAccessDetailDoor',
    method: 'post',
    data
  })
}

export function QueryGroupDoorDetailList(data) {
  return request({
    url: '/Hikvision/QueryGroupDoorDetailList',
    method: 'post',
    data
  })
}

export function QueryAcsDevice(data) {
//  debugger
  return request({
    url: '/Hikvision/QueryAcsDevice',
    method: 'post',
    data
  })
}

export function DeleteAccessGroupDetail(data) {
  //  debugger
  return request({
    url: '/Hikvision/DeleteAccessGroupDetail',
    method: 'post',
    data
  })
}

export default { addAccessGroup, editAccessGroup, queryFactoryDict, queryPrincipalList, queryAccessDoorGroup,
  QueryAccessGroupDetail, AddAccessDetailDoor, EditAccessDetailDoor,
  QueryAcsDevice, DeleteAccessGroupDetail }
