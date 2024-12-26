import React from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import axios from "../utils/baseUrl"; // Import instance axios đã có
import baseUrl from "../../apis/instance";

const LogoutButton = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Lấy token từ cookie
      const tokenData = cookies.get("data");
      if (tokenData && tokenData.accessToken) {
        // Gọi API logout để vô hiệu hóa token
        await baseUrl.post("/auth/logout", {}, {
          headers: {
            Authorization: `${tokenData.typeToken} ${tokenData.accessToken}`,
          },
        });

        // Xóa cookie lưu token
        cookies.remove("data", { path: "/" });

        // Xóa thông tin userId khỏi localStorage
        localStorage.removeItem("userId");

        // Chuyển hướng về trang đăng nhập
        navigate("/login");
      } else {
        console.warn("Không tìm thấy token. Có thể người dùng đã đăng xuất.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-danger px-4 py-2 text-white rounded-md hover:bg-red-600"
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
