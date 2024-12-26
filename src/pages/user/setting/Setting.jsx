import React, { useEffect, useState } from "react";

import { Avatar, Button, List, message, Typography } from "antd";
import {
  SettingOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  LogoutOutlined,
  BulbOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../../../apis/instance";

const { Text } = Typography;
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");
const avatar = localStorage.getItem("avatar");
const Setting = () => {
  const menuItems = [
    {
      key: "1",
      title: "Cài đặt & quyền riêng tư",
      icon: <SettingOutlined />,
      link: "/settings",
    },
    {
      key: "2",
      title: "Trợ giúp & hỗ trợ",
      icon: <QuestionCircleOutlined />,
      link: "/help",
    },
    {
      key: "3",
      title: "Màn hình & trợ năng",
      icon: <EyeOutlined />,
      link: "/accessibility",
    },
    {
      key: "4",
      title: "Đóng góp ý kiến",
      icon: <BulbOutlined />,
      link: "/feedback",
    },
    {
      key: "5",
      title: "Đăng xuất",
      icon: <LogoutOutlined />,
      link: "/login",
    },
  ];
  const handleLogout = async () => {
    try {
      // Gọi API logout
      const response = await baseUrl.post("/auth/logoutY");
      if (response.status === 200) {
        // Xóa dữ liệu từ localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("avatar");
        // localStorage.removeItem("token"); // Xóa luôn token nếu cần

        // Thông báo thành công
        message.success("Đăng xuất thành công!");

        // Điều hướng về trang login
        navigate("/login");
      } else {
        // Nếu API không trả về status 200, xử lý lỗi
        message.error("Đăng xuất thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      message.error("Đăng xuất thất bại. Vui lòng thử lại!");
    }
  };
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "360px",
        height: "460px",
        border: "1px solid #EEEEEE",
        borderRadius: 8,
        padding: "16px",
        background: "#fff",
        marginLeft: "30px",
        marginTop: "40px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "absolute",
        top: "20px",
        right: "55px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          width: "328px",
          height: "140px",
          border: "1px solid #EEEEEE", // Khung bao quanh
          borderRadius: 8, // Bo góc khung
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 28 }}
        >
          <Avatar size={50} src={avatar} style={{ marginRight: 12 }} />
          <Text strong style={{ fontSize: 16, fontWeight: 600 }}>
            {userName}
          </Text>
        </div>
        <div>
          <Button
            size="small"
            type="default"
            style={{
              width: "312px",
              height: "38px",
              marginTop: 4,
              display: "flex", // Sử dụng flexbox
              alignItems: "center",
              justifyContent: "center",
              gap: "8px", // Khoảng cách giữa icon và text
              borderRadius: 8,
              width: "100%",
              backgroundColor: "#DDDDDD",
            }}
            onClick={() => navigate(`/profile/${userId}`)} // Chuyển trang khi nhấn
          >
            <FontAwesomeIcon icon={faRepeat} />
            <Text strong style={{ fontWeight: 600 }}>
              Xem tất cả trang cá nhân
            </Text>
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      {/* Menu Items */}
      <div style={{ marginTop: "20px" }}>
        {/* Cài đặt */}
        <div
          className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/settings")}
        >
          <SettingOutlined />
          <Text>Cài đặt & quyền riêng tư</Text>
        </div>

        {/* Trợ giúp */}
        <div
          className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/help")}
        >
          <QuestionCircleOutlined />
          <Text>Trợ giúp & hỗ trợ</Text>
        </div>

        {/* Màn hình & trợ năng */}
        <div
          className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/accessibility")}
        >
          <EyeOutlined />
          <Text>Màn hình & trợ năng</Text>
        </div>

        {/* Đóng góp ý kiến */}
        <div
          className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/feedback")}
        >
          <BulbOutlined />
          <Text>Đóng góp ý kiến</Text>
        </div>

        {/* Đăng xuất */}
        <div
          className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => handleLogout()}
        >
          <LogoutOutlined />
          <Text>Đăng xuất</Text>
        </div>
      </div>
      {/* <List
        itemLayout="horizontal"
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={
                <Link to={item.link}>
                  <Text strong style={{ fontWeight: 400 }}>
                    {item.title}
                  </Text>
                </Link>
              }
            />
          </List.Item>
        )}
      /> */}

      {/* Footer Section */}
      <div style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
        Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie ·
        Xem thêm · Meta © 2024
      </div>
    </div>
  );
};

export default Setting;
