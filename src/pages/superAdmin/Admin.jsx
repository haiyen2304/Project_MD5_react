// src/components/Admin.js

import React, { useEffect, useState } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  getDashboardStatistics,
  getGroupStatistics,
  getSummaryStatistics,
  getUserStatistics,
} from "../../services/Admin";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import baseUrl from "../../apis/instance";
import { Cookies } from "react-cookie";
import { Table } from "antd";

const Admin = () => {
  const [dailyPostData, setDailyPostData] = useState([]);
  const [dailyUserData, setDailyUserData] = useState([]);
  const [dailyGroupData, setDailyGroupData] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [timeRange, setTimeRange] = useState("monthly", 12); // Lựa chọn phạm vi thời gian
  const [summaryData, setSummaryData] = useState(null); // Tổng dữ liệu
  const [loadingSummary, setLoadingSummary] = useState(false);

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogout = async () => {
    try {
      // Lấy token từ cookie
      const tokenData = cookies.get("data");
      if (tokenData && tokenData.accessToken && tokenData.typeToken) {
        // Gọi API để vô hiệu hóa token
        await baseUrl.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `${tokenData.typeToken} ${tokenData.accessToken}`,
            },
          }
        );

        // Xóa token khỏi cookie và localStorage
        cookies.remove("data", { path: "/" });
        localStorage.removeItem("userId");

        // Chuyển hướng về trang login
        navigate("/login");
      } else {
        console.warn("Không tìm thấy token. Có thể người dùng đã đăng xuất.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      // Thêm hệ thống thông báo lỗi tùy chỉnh ở đây
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

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
    <div className="flex min-h-full w-full flex-col">
      {/* Thanh điều hướng trên cùng */}
      <div className="fixed z-50 grid h-14 w-full grid-cols-7 gap-4 bg-white shadow-sm dark:bg-[#e6e7ff]">
        <div className="col-span-2 flex items-center">
          <div className="ml-2 flex items-center">
            <div className="h-10 text-primary">
              <Link to="/superAdmin">
                <FontAwesomeIcon
                  icon={faFacebook}
                  style={{
                    color: "#370fff",
                    fontSize: "36px",
                    marginLeft: "20px",
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex items-center justify-center space-x-2">
          <span className="text-blue-500 text-3xl font-bold">FACEBOOK</span>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="flex h-10 w-auto items-center space-x-2 pr-2">
            <Link to="/login" onClick={handleLogout}>
              <button className="flex h-10 items-center justify-center space-x-1 rounded-full px-2 text-black dark:bg-[#1964ae] focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                <div className="h-8">
                  <img
                    src="https://random.imagecdn.app/200/200"
                    className="h-8 w-8 rounded-full"
                    alt="dp"
                  />
                </div>
                <div className="justify-content flex h-8 items-center">
                  <p className="text-sm font-semibold">ADMIN</p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Giao diện sidebar và nội dung */}
      <div className="flex pt-14">
        {/* Sidebar */}
        <div className="sticky top-[56px] h-[calc(100vh-56px)] w-[16rem] overflow-y-auto px-2 py-3 dark:bg-[#1964ae]">
          <ul className="text-black dark:text-gray-200">
            <li className="mb-2" key="manage-accounts">
              <Link
                to="/superAdmin/manage-accounts"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-user-cog text-lg"></i>
                <span className="text-sm font-semibold">User Management</span>
              </Link>
            </li>
            <li className="mb-2" key="manage-posts">
              <Link
                to="/superAdmin/manage-posts"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-edit text-lg"></i>
                <span className="text-sm font-semibold"> Posts Management</span>
              </Link>
            </li>
            <li className="mb-2" key="manage-groups">
              <Link
                to="/superAdmin/manage-groups"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-users-cog"></i>
                <span className="text-sm font-semibold">Groups Management</span>
              </Link>
            </li>
            <li className="mb-2" key="report-posts">
              <Link
                to="/superAdmin/report-posts"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-flag text-lg"></i>
                <span className="text-sm font-semibold">
                  Report Post Management
                </span>
              </Link>
            </li>
            <li className="mb-2" key="report-users">
              <Link
                to="/superAdmin/report-users"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-user-shield text-lg"></i>
                <span className="text-sm font-semibold">
                  Report User Management
                </span>
              </Link>
            </li>
            <li className="mb-2" key="manage-comments">
              <Link
                to="/superAdmin/manage-comments"
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                <i className="fas fa-user-shield text-lg"></i>
                <span className="text-sm font-semibold">
                  Comments Management
                </span>
              </Link>
            </li>
          </ul>

          <div
            className="absolute bottom-2 left-2 text-xs text-white"
            style={{ fontSize: 12 }}
          >
            - Loại website : Dịch vụ mạng xã hội, Xuất bản
            <br />
            - Có sẵn bằng : 111 ngôn ngữ
            <br />
            - Thành lập : 04-02-2004 tại Cambridge , Massachusetts
            <br />- Người sáng lập : Mark Zuckerberg, Eduardo Saverin, Andrew
            McCollum, Dustin Moskovitz, Chris Hughes
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
