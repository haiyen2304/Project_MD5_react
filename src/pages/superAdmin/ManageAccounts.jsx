import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Typography,
  Space,
  message,
  Row,
  Col,
  Select,
} from "antd";
import debounce from "lodash.debounce";
import baseUrl from "../../apis/instance";

const { Text } = Typography;
const { Option } = Select;

const ManageAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Lưu trữ chiều sắp xếp
  const [sortField, setSortField] = useState("firstName"); // Lưu trữ trường sắp xếp

  // const API_URL = 'http://localhost:8080/api/v1/superAdmin';

  const fetchUsers = useCallback(
    async (sortField = "firstName", sortOrder = "asc") => {
      setLoading(true);
      try {
        // const token = new Cookies().get("data"); // Lấy token từ cookie
        const response = await baseUrl.get(`superAdmin/sort`, {
          params: { sortField, sortOrder }, // Truyền cả field và order
        });
        setUsers(response.data);
      } catch (error) {
        message.error("Unable to load user list.");
        console.error("Error while retrieving user data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(sortField, sortOrder); // Đảm bảo gọi đúng khi có thay đổi
    return () => {
      debounceSearch.cancel(); // Làm sạch debounce khi component bị unmount
    };
  }, [fetchUsers, sortField, sortOrder]);

  const debounceSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (value) {
          try {
            const response = await baseUrl.get(`superAdmin/search`, {
              params: { keyword: value },
            });
            setUsers(response.data);
          } catch (error) {
            console.error("Error while searching for user:", error);
          }
        } else {
          fetchUsers(sortField, sortOrder); // Gọi lại API khi không tìm kiếm
        }
      }, 300),
    [sortField, sortOrder, fetchUsers]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await baseUrl.get(`superAdmin/${userId}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleLockUser = async (id) => {
    setLoading(true);
    try {
      await baseUrl.put(`superAdmin/${id}/lock`);
      fetchUsers(sortField, sortOrder); // Tải lại danh sách sau khi khóa
    } catch (error) {
      console.error("Error locking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockUser = async (id) => {
    setLoading(true);
    try {
      await baseUrl.put(`superAdmin/${id}/unlock`);
      fetchUsers(sortField, sortOrder); // Tải lại danh sách sau khi mở khóa
    } catch (error) {
      console.error("Error while unlocking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    setSortField(field); // Cập nhật trường sắp xếp
    setSortOrder(order); // Cập nhật chiều sắp xếp
    fetchUsers(field, order); // Gọi API với trường và chiều sắp xếp mới
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item, index) => ({
        key: item.id,
        stt: index + 1,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        gender: item.gender,
        phone: item.phone,
        status: item.status,
      }));
  }, [users, searchTerm, sortOrder]);

  const columns = [
    { key: "stt", title: "STT", dataIndex: "stt" },
    { key: "email", title: "Email", dataIndex: "email" },
    { key: "firstName", title: "FirstName", dataIndex: "firstName" },
    { key: "lastName", title: "LastName", dataIndex: "lastName" },
    { key: "gender", title: "Gender", dataIndex: "gender" },
    { key: "phone", title: "Phone", dataIndex: "phone" },
    { key: "status", title: "Status", dataIndex: "status" },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleViewDetails(record.key)}>
            See details
          </Button>
          {record.status === "ACTIVE" ? (
            <Button onClick={() => handleLockUser(record.key)}>Lock</Button>
          ) : (
            <Button onClick={() => handleUnlockUser(record.key)}>Unlock</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "20px", padding: "10px" }}>Users Management</h1>
      <Row
        gutter={16}
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col span={12}>
          <Input
            placeholder="Search for users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col span={12}>
          <Select
            onChange={handleSortChange}
            value={`${sortField}-${sortOrder}`}
            style={{ width: "100%" }}
          >
            <Option value="firstName-asc"> (A-Z)</Option>
            <Option value="firstName-desc"> (Z-A)</Option>
          </Select>
        </Col>
      </Row>
      <Table dataSource={filteredUsers} columns={columns} loading={loading} />
      {selectedUser && (
        <Modal
          title="User details"
          open={!!selectedUser}
          onCancel={() => setSelectedUser(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedUser(null)}>
              Đóng
            </Button>,
          ]}
        >
          <p>
            <strong>Name:</strong> {selectedUser?.firstName}{" "}
            {selectedUser?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser?.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser?.phone}
          </p>
          <p>
            <strong>BirthDay:</strong>{" "}
            {selectedUser?.birthDay
              ? new Date(selectedUser?.birthDay).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {selectedUser?.status}
          </p>
          <p>
            <strong>Date created:</strong>{" "}
            {selectedUser?.createdAt
              ? new Date(selectedUser?.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {selectedUser?.roles
              ? selectedUser.roles.map((role) => role.roleName).join(", ")
              : "N/A"}
          </p>
        </Modal>
      )}
      {error && <Text type="danger">{error}</Text>}
    </div>
  );
};

export default ManageAccounts;
