import React from "react";
import {
  Input,
  Button,
  Form,
  DatePicker,
  Select,
  notification,
  message,
} from "antd";
import axios from "axios";
import baseUrl from "../../../apis/instance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
const { Option } = Select;

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // call API
  const onFinish = async (values) => {
    console.log("Received values: ", values);
    const { firstName, lastName, email, password, phone, birthDay, gender } =
      values;

    try {
      setLoading(true);
      const response = await baseUrl.post("auth/register", {
        // gửi dữ liệu lên API
        firstName,
        lastName,
        email,
        password,
        phone,
        birthDay: moment(birthDay).format("DD/MM/YYYY"),
        gender,
      });
      message.success("Đăng ký thành công. Vui lòng xác thực");
      form.resetFields();
      // chuyển sang trang nhập mã xác thực email
      setTimeout(() => {
        setLoading(false);
        navigate("/verify", { state: { email } });
      }, 1000);
    } catch (error) {
      setLoading(false);
      // Xử lý lỗi từ server
      if (error.response) {
        notification.error({
          message: "Đăng ký thất bại",
          description:
            error.response.data.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        });
      } else if (error.request) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối tới server. Vui lòng thử lại sau.",
        });
      } else {
        notification.error({
          message: "Lỗi hệ thống",
          description: error.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <>
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#e9eff1", // Màu nền nhẹ nhàng
          }}
        >
          {/* Container với 2 phần: Logo bên trái (Chữ Facebook) và form bên phải */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
              maxWidth: "1000px", // Giới hạn chiều rộng tối đa
              margin: "0 auto",
            }}
          >
            {/* Phần chữ Facebook lớn bên trái */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h1 className="text-7xl font-bold text-blue-600">Facebook</h1>
            </div>

            {/* Phần form đăng ký bên phải */}
            <div
              style={{
                flex: 1.5,
                backgroundColor: "#fff",
                padding: "40px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <h2 className="text-4xl font-bold text-blue-600 mb-6">Đăng Ký</h2>

              <Form form={form} onFinish={onFinish} layout="vertical">
                <div className="flex justify-between gap-5">
                  <Form.Item
                    name="firstName"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên của bạn!" },
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ của bạn!" },
                    ]}
                  >
                    <Input placeholder="Họ" />
                  </Form.Item>
                </div>

                <div className=" flex justify-between gap-5 mt-0 mb-0 ">
                  <Form.Item
                    className="mt-0 mb-0 w-full"
                    name="birthDay"
                    label="Ngày sinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh!" },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current && current > moment().startOf("day")
                      }
                      className="w-full "
                      placeholder=" DD-MM-YYYY"
                      format="DD-MM-YYYY"
                      // disabledDate={disableFutureDates}
                    />
                  </Form.Item>

                  <Form.Item
                    className="w-full "
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                  >
                    <Select placeholder="Giới tính" className="w-full">
                      <Option value="FEMALE">Nữ</Option>
                      <Option value="MALE">Nam</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  className="mt-0 mb-2 w-full"
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                  className="mt-0 mb-2 w-full"
                  label="NumberPhone"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    { type: "tel", message: "Số điện thoại không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Phone" />
                </Form.Item>

                <Form.Item
                  className="mt-0 mb-2 w-full"
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]} //nếu trường password thay đổi, sẽ kích hoạt lại việc kiểm tra của trường hiện tại là confirmPassword
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve(); //là một đối tượng đại diện cho kết quả của một tác vụ bất đồng bộ (asynchronous).
                        }
                        return Promise.reject("Mật khẩu không khớp!");
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item>
                  <Button
                    className="h-10 rounded-lg"
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    Đăng Ký
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ marginTop: "10px" }}>
                <p>
                  Bạn đã có tài khoản?{" "}
                  <a
                    onClick={() => navigate("/login")}
                    // href="/login"
                    style={{
                      color: "#1877f2",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Đăng nhập
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
