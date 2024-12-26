import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userId"); // Kiểm tra token hoặc userId

  if (!token) {
    // Nếu không có token, chuyển hướng đến trang login
    return <Navigate to="/login" />;
  }

  return children; // Nếu hợp lệ, hiển thị component con
};

export default PrivateRoute;
