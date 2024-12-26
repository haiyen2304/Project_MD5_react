import baseUrl from "../apis/instance";

export const getDashboardStatistics = async (type, range) => {
    try {
      const response = await baseUrl.get(`/superAdmin/dashboard/posts/statistics?type=${type}&range=${range}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  };

  export const getUserStatistics = async (type, range) => {
    try {
      const response = await baseUrl.get(`/superAdmin/dashboard/registrations/statistics?type=${type}&range=${range}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  };
  
  export const getGroupStatistics = async (type, range) => {
    try {
      const response = await baseUrl.get(`/superAdmin/dashboard/groups/statistics?type=${type}&range=${range}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching group statistics:", error);
      throw error;
    }
  };

 export const getSummaryStatistics = async (type, range) => {
  try {
    const response = await baseUrl.get(
      `/superAdmin/dashboard/summary/statistics?type=${type}&range=${range}`
    );
    return response.data; // Trả về dữ liệu tổng hợp
  } catch (error) {
    console.error("Error fetching summary statistics:", error);
    throw error;
  }
};
  