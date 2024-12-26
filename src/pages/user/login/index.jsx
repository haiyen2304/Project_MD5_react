import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Để chuyển hướng sau khi đăng nhập thành công
import { Form, Input, Button, message } from "antd";
import baseUrl from "../../../apis/instance";
import { Cookies } from "react-cookie";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // // Khi truy cập vào `/login`, xóa dữ liệu đăng nhập
  // useEffect(() => {
  //   const cookies = new Cookies();
  //   cookies.remove("data", { path: "/" }); // Xóa cookie lưu token
  //   localStorage.removeItem("userId");
  //   localStorage.removeItem("userName");
  //   localStorage.removeItem("avatar");
  //   console.log("Đã xóa thông tin đăng nhập.");
  // }, []);

  /**Hải yến
   * hàm xử lý đăng nhập handleLogin
   * 9/12/2024
   */
  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      // gửi y/c đăng nhập tới API
      const response = await baseUrl.post("/auth/login", { email, password });

      console.log("Response Data: ", response.data);
      // Nếu đăng nhập thành công, lưu token vào cookie
      // const token = response.data.token;
      new Cookies().set("data", response.data, {
        path: "/",
        expires: new Date(Date.now() + 3600 * 1000 * 24),
      });

      // -----------------N start --------------------------
      // Kiểm tra quyền và điều hướng phù hợp
      const roles = response.data.roles;
      if (roles.includes("ROLE_SUPER_ADMIN")) {
        navigate("/superAdmin", { state: { email } });
      } else if (roles.includes("ROLE_USER")) {
        navigate("/", { state: { email } });
      } else {
        message.error("Quyền không hợp lệ.");
        return;
      }
      // -----------------N end ----------------------------

      message.success("Đăng nhập thành công");
      form.resetFields;
      setTimeout(() => {
        setLoading(false);
        // navigate("/", { state: { email } });
      }, 1000);
    } catch (error) {
      console.log("lỗi gì :" + error);

      message.error(
        error?.response?.data?.message ||
          "Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu."
      );
    } finally {
      setLoading(false); // kết thúc đăng nhập
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md p-8 rounded-md flex items-center justify-between w-full max-w-4xl">
          {/* Left Section */}
          <div className="text-gray-800 w-1/2 pr-8">
            <h1 className="text-7xl font-bold text-blue-600">Facebook</h1>
            <p className="mt-4 text-lg">
              Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
              của bạn.
            </p>
          </div>
          {/* Right Section */}
          <div className="bg-gray-50 p-6 rounded-md shadow-md w-1/2">
            <Form
              name="login_form"
              onFinish={handleLogin} // Khi form submit thành công sẽ gọi handleLogin
              initialValues={{
                remember: true,
              }}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                ]}
              >
                <Input type="email" placeholder="Email hoặc số điện thoại" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>

              {/* Hiển thị thông báo lỗi nếu có */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading} // Hiển thị loading khi đang đăng nhập
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <a
                href="#"
                className="block text-center text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </a>

              <hr className="my-4" />
            </Form>

            <button
              onClick={() => navigate("/register")}
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Tạo tài khoản mới
            </button>
            <p className="mt-4 text-sm text-center text-gray-500">
              Tạo Trang dành cho người nổi tiếng, thương hiệu hoặc doanh nghiệp.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
