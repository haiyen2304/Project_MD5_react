import React, { useEffect, useState } from "react";
import { Popconfirm, Table, message } from "antd";
import {  deletePostWithReport, fetchPostReports, ignorePostReport } from "../../services/reportPostService";

const ReportPosts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Fetch reports
  const loadReports = async (page, size) => {
    setLoading(true);
    try {
      const response = await fetchPostReports(page, size);
      setData(response.content || []);
      setPagination({
        ...pagination,
        current: page,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Error fetching post reports!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  // Delete post and report
  const handleDeletePost = async (reportId) => {
    try {
      await deletePostWithReport(reportId);
      message.success("Post and report deleted successfully!");
      loadReports(pagination.current, pagination.pageSize); // Reload data
    } catch (error) {
      message.error("Failed to delete post and report!");
    }
  };

  // Ignore report
  const handleIgnoreReport = async (reportId) => {
    try {
      await ignorePostReport(reportId);
      message.success("Report ignored successfully!");
      loadReports(pagination.current, pagination.pageSize); // Reload data
    } catch (error) {
      message.error("Failed to ignore report!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Người báo cáo",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Bài viết",
      dataIndex: "targetDetail",
      key: "targetDetail",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này không?"
            onConfirm={() => handleDeletePost(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <button style={{ marginRight: 10 }}>Xóa bài viết</button>
          </Popconfirm>
          <button onClick={() => handleIgnoreReport(record.id)}>Bỏ qua</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách báo cáo bài viết</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize }),
        }}
      />
    </div>
  );
};

export default ReportPosts;
