import baseUrl from "../apis/instance";

const GroupService = {
  getGroups: (page = 0, size = 5) => {
    return baseUrl.get(`/superAdmin/groups?page=${page}&size=${size}`);
  },

  searchGroups: (keyword, page = 0, size = 5) => {
    return baseUrl.get(`/superAdmin/groups/search?keyword=${keyword}&page=${page}&size=${size}`);
  },

  lockGroup: (groupId) => {
    return baseUrl.put(`/superAdmin/groups/${groupId}/lock`);
  },

  unlockGroup: (groupId) => {
    return baseUrl.put(`/superAdmin/groups/${groupId}/unlock`);
  },
};

export default GroupService;
