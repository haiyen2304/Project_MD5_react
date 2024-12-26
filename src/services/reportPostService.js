import baseUrl from "../apis/instance";

export const fetchPostReports = async (page, size) => {
  const response = await baseUrl.get(`/superAdmin/reports/posts?page=${page - 1}&size=${size}`);
  return response.data;
};

export const deletePostWithReport = async (reportId) => {
  await baseUrl.post(`/superAdmin/reports/delete-post/${reportId}`);
};

export const ignorePostReport = async (reportId) => {
  await baseUrl.post(`/superAdmin/reports/ignore/${reportId}`);
};
