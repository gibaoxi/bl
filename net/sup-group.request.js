"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMyGroupsApi = getMyGroupsApi;
exports.groupSignApi = groupSignApi;

var _api = require("./api");

async function getMyGroupsApi() {
  const {
    data
  } = await _api.vcApi.get('/link_group/v1/member/my_groups');
  return data;
}

async function groupSignApi(group_id, owner_id) {
  const {
    data
  } = await _api.vcApi.get('/link_setting/v1/link_setting/sign_in', {
    params: {
      group_id,
      owner_id
    }
  });
  return data;
}