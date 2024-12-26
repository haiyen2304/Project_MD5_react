import React, { useEffect, useState } from "react";
import { Table, message, Popconfirm, Button } from "antd";
import { blockUserByReport, fetchUserReports, ignoreUserReport } from "../../services/reportUserService";

const ReportUsers = () => {
  const [data, setData] = useState([]); // Data for table
  const [loading, setLoading] = useState(false); // Loading state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const loadReports = async (page, size) => {
    setLoading(true);
    try {
      const response = await fetchUserReports(page, size);

      if (response && response.content) {
        setData(response.content);
        setPagination({
          current: page,
          pageSize: size,
          total: response.totalElements,
        });
      } else {
        message.error("Không tìm thấy dữ liệu báo cáo!");
      }
    } catch (error) {
      message.error("Không thể tải danh sách báo cáo người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleBlockUser = async (reportId) => {
    try {
      await blockUserByReport(reportId);
      message.success("Người dùng đã bị khóa thành công!");
      loadReports(pagination.current, pagination.pageSize); // Reload data
    } catch (error) {
      message.error("Không thể khóa người dùng!");
    }
  };

  const handleIgnoreReport = async (reportId) => {
    try {
      await ignoreUserReport(reportId);
      message.success("Báo cáo đã được bỏ qua!");
      loadReports(pagination.current, pagination.pageSize); // Reload data
    } catch (error) {
      message.error("Không thể bỏ qua báo cáo!");
    }
  };

  const columns = [
    {
      title: "ID Báo Cáo",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Người Bị Báo Cáo",
      key: "targetDetail",
      render: (_, record) =>
        record.targetDetail ? record.targetDetail : "Không có thông tin",
    },
    {
      title: "Người Báo Cáo",
      key: "reportedBy",
      render: (_, record) =>
        record.reportedBy ? record.reportedBy : "Không có thông tin",
    },
    {
      title: "Lý Do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Bạn có chắc muốn khóa người dùng này không?"
            onConfirm={() => handleBlockUser(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger style={{ marginRight: 10 }}>
              Khóa Người Dùng
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Bạn có chắc muốn bỏ qua báo cáo này không?"
            onConfirm={() => handleIgnoreReport(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button>Bỏ Qua</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Danh Sách Báo Cáo Người Dùng</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
          },
        }}
      />
    </div>
  );
};

export default ReportUsers;

