import React from "react";
import { Card, Avatar, Row, Col, Typography } from "antd";
import {
  CloseCircleFilled,
  SettingFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

const { Text } = Typography;

const FormPost = () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const avatar = localStorage.getItem("avatar");
  return (
    <div
      style={{
        background: "#f0f2f5",
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      {/* Avatar và phần tên người dùng */}
      <div style={{ height: "100vh", width: "30vw" }}>
        <div
          style={{
            height: "10vh",
            display: "flex",
            alignItems: "center",
            marginLeft: 20,
            gap: 10,
          }}
        >
          <CloseCircleFilled style={{ fontSize: "40px" }} />
          <Link to="/">
            <FaFacebook
              className="text-primary text-3xl"
              style={{ color: "#4568f5", fontSize: "40px" }}
            />
          </Link>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ fontSize: "32px" }}>Tin của bạn</h3>
            <SettingFilled style={{ fontSize: "36px" }} />
          </div>
          <Row>
            <Col span={24}>
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                }}
              >
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  style={{ marginRight: "16px" }}
                />
                <Text strong style={{ fontSize: "18px" }}>
                  {userName}
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
        <div style={{ height: "60vh" }}></div>
      </div>
      {/* Các nút tạo tin */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            style={{
              height: "150px",
              borderRadius: "12px",
              background: "linear-gradient(to top, #6a11cb, #2575fc)",
              color: "#fff",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Text strong style={{ fontSize: "16px", color: "#fff" }}>
              Tạo tin dạng ảnh
            </Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              height: "150px",
              borderRadius: "12px",
              background: "linear-gradient(to top, #ff758c, #ff7eb3)",
              color: "#fff",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Text strong style={{ fontSize: "16px", color: "#fff" }}>
              Tạo tin dạng văn bản
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FormPost;
