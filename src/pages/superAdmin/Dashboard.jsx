import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { Table } from "antd";
import {
  getDashboardStatistics,
  getGroupStatistics,
  getSummaryStatistics,
  getUserStatistics,
} from "../../services/Admin";

const Dashboard = () => {
  const [dailyPostData, setDailyPostData] = useState([]);
  const [dailyUserData, setDailyUserData] = useState([]);
  const [dailyGroupData, setDailyGroupData] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [timeRange, setTimeRange] = useState("monthly", 12); // Lựa chọn phạm vi thời gian
  const [summaryData, setSummaryData] = useState(null); // Tổng dữ liệu
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoadingPosts(true);
        setLoadingUsers(true);
        setLoadingGroups(true);
        setLoadingSummary(true);
        const data = await getSummaryStatistics(timeRange, 12); // Gọi API
        setSummaryData(data); // Gán tổng dữ liệu
        const [postData, userData, groupData] = await Promise.all([
          getDashboardStatistics("monthly", 12),
          getUserStatistics("monthly", 12),
          getGroupStatistics("monthly", 12),
        ]);

        setDailyPostData(
          Object.entries(postData).map(([date, count]) => ({ date, count }))
        );
        setDailyUserData(
          Object.entries(userData).map(([date, count]) => ({ date, count }))
        );
        setDailyGroupData(
          Object.entries(groupData).map(([date, count]) => ({ date, count }))
        );
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoadingPosts(false);
        setLoadingUsers(false);
        setLoadingGroups(false);
        setLoadingSummary(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const columns = [
    {
      title: "Statistic",
      dataIndex: "statistic",
      key: "statistic",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  const data = [
    {
      key: "1",
      statistic: "Total Users Registered",
      total: summaryData?.totalRegistrations || 0,
    },
    {
      key: "2",
      statistic: "Total Posts Created",
      total: summaryData?.totalPosts || 0,
    },
    {
      key: "3",
      statistic: "Total Groups Created",
      total: summaryData?.totalGroups || 0,
    },
  ];

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="flex justify-end space-x-4">
          <label htmlFor="timeRange" className="font-semibold">
            Time Range:
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyPostData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="count" name="Posts" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyUserData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="count" name="Users" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyGroupData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            name="Groups"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="text-xl font-bold mb-2">Summary Statistics</h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loadingSummary}
        bordered
      />
    </div>
  );
};

export default Dashboard;
