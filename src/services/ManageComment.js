import baseUrl from "../apis/instance";


// Lấy danh sách comment (phân trang, sắp xếp)
export const fetchComments = async (page, size, sortOrder, searchTerm) => {
  try {
    const response = await baseUrl.get("/superAdmin/comments", {
      params: {
        page: page - 1,
        size,
        sortBy: "createdAt",
        direction: sortOrder === "ascend" ? "asc" : "desc",
        content: searchTerm || null,
      },
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    throw error;
  }
};

// Tìm kiếm comment
export const searchComments = async (content, userId, postId, page, size, sortOrder) => {
  try {
    const response = await baseUrl.get("/superAdmin/comments/search", {
      params: {
        content,
        userId,
        postId,
        page: page - 1,
        size,
        sortBy: "createdAt",
        direction: sortOrder === "ascend" ? "asc" : "desc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bình luận:", error);
    throw error;
  }
};

// Xóa comment với lý do
export const deleteComment = async (commentId, reason) => {
  console.log("commentId =>> ",commentId);
  console.log("reason =>> ",reason);
  try {
    await baseUrl.delete(`/superAdmin/comments/${commentId}?reason=${reason}`);
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    throw error;
  }
};

// Xuất các hàm API
export default {
  fetchComments,
  searchComments,
  deleteComment,
};
