import React from "react";
import { Cookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export default function Authorization({ children, roleName }) {
  const isTrue = () => {
    const data = new Cookies().get("data") || null;
    console.log(data);
    if (data) {
      if (data.roles.includes(roleName)) {
        return true;
      }
      return false;
    }
    return false;
  };

  return <>{isTrue() ? children : <Navigate to={"/login"} />}</>;
}
