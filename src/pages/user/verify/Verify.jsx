import React, { useEffect, useState } from "react";
import { Input, Button, Form, message, notification } from "antd";
import { FaFacebook } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import baseUrl from "../../../apis/instance";

const { Search } = Input;
export default function Verify() {
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Lấy state từ navigate
  const navigate = useNavigate();
  // Lấy email từ state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      message.error("Không tìm thấy email. Vui lòng đăng ký lại.");
      navigate("/register"); // Quay lại trang đăng ký nếu không có email
    }
  }, [location.state, navigate]);
  // nhập mã xác thực
  const handleVerify = async () => {
    if (!verifyCode) {
      message.error("Vui lòng nhập mã xác nhận!");
      return;
    }
    setLoading(true);

    try {
      const response = await baseUrl.post("auth/verify", {
        // gửi dữ liệu lên API
        email,
        verifyCode,
      });

      if (response.status === 200) {
        message.success("Mã xác thực đúng, bạn sẽ được chuyển tới trang chủ.");
        navigate("/login"); // Nếu mã đúng, chuyển tới trang chủ
      } else {
        message.error({
          description: "Mã xác thực không đúng. Vui lòng thử lại.",
        });
        setCode("");
      }
    } catch (error) {
      console.log("Error: ", error);

      message.error({
        description:
          error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setLoading(false);
      message.success("Mã xác nhận đúng!");
    }, 2000);
  };

  // gửi lại mã xác thực
  console.log(email + "  email gửi lại mã xác thực:");
  const handleResendCode = async () => {
    //   try {
    //     const response = await baseUrl.post(
    //       `/auth/resend-verification?email=${encodeURIComponent(email)}`
    //     );
    //     message.success("Gửi lại mã xác thực thành công, vui lòng check email:", 2);
    //   } catch (error) {
    //     message.error(
    //       "Lỗi khi gửi lại mã xác thực:",
    //       error.response?.data || error.message || "Có lỗi xảy ra khi gửi lại mã."
    //     );
    //   }
    // };

    try {
      const response = await baseUrl.post(
        `/auth/resend-verification?email=${encodeURIComponent(email)}`
      );
      if (response.status === 200) {
        notification.success({
          message: "Mã đã được gửi",
          description: `Mã xác thực mới đã được gửi tới email: ${email}`,
        });
      }
    } catch (error) {
      console.log("lỗi gửi lại mã :" + error.message);

      notification.error({
        message: "Lỗi",
        description:
          error.response?.data?.message || "Có lỗi xảy ra khi gửi lại mã.",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-6">
        <div className=" max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-start gap-16">
            <FaFacebook
              className="text-primary text-3xl"
              style={{ color: "#4568f5", fontSize: "48px" }}
            />
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Xác Nhận Email
            </h2>
          </div>

          <p className="text-sm text-gray-500 text-center mt-2 mb-6">
            Để đảm bảo đây là email của bạn, hãy nhập mã chúng tôi đã gửi đến{" "}
            <span className="font-semibold">{email || "email của bạn"}</span>.
          </p>
          <Form
            layout="vertical"
            name="email-verification"
            initialValues={{ email }}
            onFinish={handleVerify}
          >
            <Form.Item
              label="Mã xác nhận"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác nhận!" },
              ]}
            >
              <Input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Nhập mã xác nhận"
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                Xác nhận
              </Button>

              <Button
                type="link"
                className="text-sm text-blue-600"
                onClick={handleResendCode}
              >
                Gửi lại mã
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
