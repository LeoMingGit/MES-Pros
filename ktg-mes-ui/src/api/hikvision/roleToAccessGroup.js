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
export function UpdateHikRoleToAccessGroup(data) {
  return request({
    url: 'Hikvision/UpdateHikRoleToAccessGroup',
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

export function queryroleDropList(keyword) {
  return request({
    url: '/Hikvision/QueryRoleToAccessGroupDropList?keyword=' + keyword,
    method: 'get',
  })
}

export function QueryPersonRoleDetail(roleId) {
  return request({
    url: '/Hikvision/QueryPersonRoleDetail?roleId=' + roleId,
    method: 'get',
  })
}
export function AddHikRoleToAccessGroup(data) {
  return request({
    url: '/Hikvision/AddHikRoleToAccessGroup',
    method: 'post',
    data
  })
}

export function QueryAccessToGroupPagedList(data) {
  return request({
    url: '/Hikvision/QueryAccessToGroupPagedList',
    method: 'post',
    data
  })
}

export function QueryHikAccessGroupList(data) {
  return request({
    url: '/Hikvision/QueryHikAccessGroupList',
    method: 'post',
    data
  })
}

export default { AddPersonRole, UpdatePersonRole, queryFactoryDict, queryroleDropList, QueryPersonRoleDropList,
  QueryPersonRoleDetail, AddHikRoleToAccessGroup, UpdateHikRoleToAccessGroup, QueryAccessToGroupPagedList,
  QueryHikAccessGroupList }
