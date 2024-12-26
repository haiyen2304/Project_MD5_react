import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, message, Popconfirm, Space } from "antd";
import { deleteComment, fetchComments, searchComments } from "../../services/ManageComment";


const { Search } = Input;

const ManageComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sortOrder, setSortOrder] = useState("descend");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadComments();
  }, [pagination.current, pagination.pageSize, sortOrder,searchTerm]);

  // Hàm lấy danh sách bình luận
  const loadComments = async () => {
    setLoading(true);
    try {
      // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
      if (searchTerm) {
        const data = await searchComments(
          searchTerm,
          null,
          null,
          pagination.current,
          pagination.pageSize,
          sortOrder
        );
        setComments(data.content);
        setPagination({
          ...pagination,
          total: data.totalElements,
        });
      } else {
        // Nếu không có từ khóa, gọi API lấy danh sách bình luận thông thường
        const data = await fetchComments(
          pagination.current,
          pagination.pageSize,
          sortOrder
        );
        setComments(data.content);
        setPagination({
          ...pagination,
          total: data.totalElements,
        });
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value); 
    setPagination({ ...pagination, current: 1 }); // Reset trang về trang đầu tiên
  };

  const handleDelete = async () => {
    if (!reason) {
      message.warning("Vui lòng nhập lý do trước khi xóa.");
      return;
    }
    try {
      await deleteComment(selectedCommentId, reason);
      message.success("Xóa bình luận thành công!");
      setSelectedCommentId(null);
      setReason("");
      loadComments(); // Làm mới danh sách sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa bình luận.");
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
    },
    {
      title: "Số bình luận con",
      dataIndex: "childCommentCount",
      key: "childCommentCount",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xóa bình luận này?"
            onConfirm={() => setSelectedCommentId(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, _, sorter) => {
    setPagination({ ...pagination });
    if (sorter.order) {
      setSortOrder(sorter.order);
    }
  };

  return (
    <div>
      <h1>Quản lý bình luận</h1>
      <Search
        placeholder="Tìm kiếm bình luận..."
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="Nhập lý do xóa bình luận"
        open={!!selectedCommentId}
        onCancel={() => setSelectedCommentId(null)}
        onOk={handleDelete}
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do xóa bình luận..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ManageComment;
