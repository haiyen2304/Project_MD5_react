import baseUrl from "../apis/instance";

const PostService = {
  getAllPosts: (page = 0, size = 5) => {
    return baseUrl.get(`/superAdmin/posts?page=${page}&size=${size}`);
  },
  searchPosts: (keyword) => {
    return baseUrl.get(`/superAdmin/posts/search?keyword=${keyword}`);
  },
  toggleHidePost: (postId) => {
    return baseUrl.put(`/superAdmin/posts/${postId}/toggle-hide`);
  },
};

export default PostService;
