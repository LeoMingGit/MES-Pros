import request from '@/utils/request'

export function AddPersonRole(data) {
  return request({
    url: 'Hikvision/AddPersonRole',
    method: 'post',
    data
  })
}

export function UpdatePersonRole(data) {
  return request({
    url: 'Hikvision/UpdatePersonRole',
    method: 'post',
    data
  })
}
export function UpdatePersonToRoleGroup(data) {
  return request({
    url: 'Hikvision/UpdatePersonToRoleGroup',
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

export function QueryPersonRoleDropList(keyword) {
  return request({
    url: '/Hikvision/QueryPersonRoleDropList?keyword=' + keyword,
    method: 'get',
  })
}

export function queryPrincipalList(name) {
  return request({
    url: '/Hikvision/QueryPersonList?name=' + name,
    method: 'get',
  })
}

export function QueryPersonRoleDetail(roleId) {
  return request({
    url: '/Hikvision/QueryPersonRoleDetail?roleId=' + roleId,
    method: 'get',
  })
}
export function AddPersonToRoleGroup(data) {
  return request({
    url: '/Hikvision/AddPersonToRoleGroup',
    method: 'post',
    data
  })
}

export function QueryPersonToRoleGroupDetailList(data) {
  return request({
    url: '/Hikvision/QueryPersonToRoleGroupDetailList',
    method: 'post',
    data
  })
}

export function QueryPersonList(data) {
//  debugger
  return request({
    url: '/Hikvision/QueryPersonList',
    method: 'post',
    data
  })
}

export function DeleteRoleDetail(data) {
  return request({
    url: '/Hikvision/DeleteRoleDetail',
    method: 'post',
    data
  })
}

export default { AddPersonRole, UpdatePersonRole, queryFactoryDict, queryPrincipalList, QueryPersonRoleDropList,
  QueryPersonRoleDetail, AddPersonToRoleGroup, UpdatePersonToRoleGroup, QueryPersonToRoleGroupDetailList,
  QueryPersonList, DeleteRoleDetail }
