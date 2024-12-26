import React, { useEffect, useState } from "react";
import { Table, Button, Input, notification, Pagination } from "antd";
import GroupService from "../../services/GroupService";

const ManagerGroup = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState({ page: 0, size: 5, total: 0 });

  useEffect(() => {
    fetchGroups();
  }, [pagination.page]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = keyword
        ? await GroupService.searchGroups(keyword, pagination.page, pagination.size)
        : await GroupService.getGroups(pagination.page, pagination.size);
      const { content, totalElements } = response.data;
      setGroups(content);
      setPagination((prev) => ({ ...prev, total: totalElements }));
    } catch (error) {
      notification.error({ message: "Error fetching groups", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 0 }));
    fetchGroups();
  };

  const handleLockUnlock = async (groupId, isLocked) => {
    try {
      if (isLocked) {
        await GroupService.unlockGroup(groupId);
        notification.success({ message: "Group unlocked successfully" });
      } else {
        await GroupService.lockGroup(groupId);
        notification.success({ message: "Group locked successfully" });
      }
      fetchGroups();
    } catch (error) {
      notification.error({ message: "Action failed", description: error.response.data.message });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Locked", dataIndex: "isLocked", key: "isLocked", render: (isLocked) => (isLocked ? "Yes" : "No") },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type={record.isLocked ? "primary" : "danger"}
            onClick={() => handleLockUnlock(record.id, record.isLocked)}
          >
            {record.isLocked ? "Unlock" : "Lock"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
     <h1 style={{ fontSize: '20px',padding: '10px' }}>Manager Group</h1>
      <Input.Search
        placeholder="Search groups..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20, width: 400 }}
      />
      <Table
        dataSource={groups}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={pagination.page + 1}
        pageSize={pagination.size}
        total={pagination.total}
        onChange={(page) => setPagination((prev) => ({ ...prev, page: page - 1 }))}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
};

export default ManagerGroup;
