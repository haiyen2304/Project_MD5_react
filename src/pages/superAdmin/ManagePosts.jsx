import React, { useEffect, useState } from "react";
import { Table, Input, Button, message } from "antd";
import PostService from "../../services/PostService";

const { Search } = Input;

const ManagerPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [keyword, setKeyword] = useState("");

  // Fetch data function
  const fetchPosts = async (page = 0, size = 5, searchKeyword = "") => {
    setLoading(true);
    try {
      const response = searchKeyword
        ? await PostService.searchPosts(searchKeyword)
        : await PostService.getAllPosts(page, size);

      // Nếu có tìm kiếm, API trả về dạng List, không có pagination
      if (searchKeyword) {
        setPosts(response.data);
      } else {
        setPosts(response.data.content);
        setPagination({
          current: page + 1,
          pageSize: size,
          total: response.data.totalElements,
        });
      }
    } catch (error) {
      message.error("Error loading article data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Toggle Hide Post
  const handleToggleHide = async (postId) => {
    try {
      await PostService.toggleHidePost(postId);
      message.success("Update post status successfully");
      fetchPosts(pagination.current - 1, pagination.pageSize, keyword);
    } catch (error) {
      message.error("There was an error updating the post status.");
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setKeyword(value);
    fetchPosts(0, pagination.pageSize, value);
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Creator",
      dataIndex: ["user", "firstName"],
      key: "user",
      render: (_, record) => `${record.user.firstName} ${record.user.lastName}`,
    },
    {
      title: "Status",
      dataIndex: "isHidden",
      key: "isHidden",
      render: (isHidden) =>
        isHidden ? <span style={{ color: "red" }}>Hidden</span> : "Display",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleToggleHide(record.id)}>
          {record.isHidden ? "Display" : "Hidden"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "20px", padding: "10px" }}>Post Management</h1>
      <Input.Search
        placeholder="Search post..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20, width: 400 }}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={posts}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            fetchPosts(page - 1, pageSize, keyword);
          },
        }}
      />
    </div>
  );
};

export default ManagerPosts;
