import baseUrl from "../apis/instance";

export const fetchUserReports = async (page, size) => {
  const response = await baseUrl.get(
    `/superAdmin/reports/users?page=${page - 1}&size=${size}`
  );
  return response.data; 
};

export const ignoreUserReport = async (reportId) => {
  await baseUrl.post(`/superAdmin/reports/ignore/${reportId}`);
};

export const blockUserByReport = async (reportId) => {
  await baseUrl.post(`/superAdmin/reports/block-user/${reportId}`);
};
