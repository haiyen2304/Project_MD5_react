import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const LoginLogoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("avatar");

    // Xóa cookies
    const cookies = new Cookies();
    cookies.remove("data", { path: "/" });

    // Chuyển hướng về trang login
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100); // Đợi 100ms trước khi chuyển hướng
  }, [navigate]);

  return <div>Đang đăng xuất...</div>;
};

export default LoginLogoutHandler;
