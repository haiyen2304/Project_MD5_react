import React, { useEffect, useState } from "react";
import baseUrl, { formUrl } from "../../../apis/instance";
import ProfileHeader from "./ProfileHeader";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

export default function ProfileEdit({ userId }) {
  // const userId = useParams();
  const [currentUserId, setCurrentUserId] = useState();
  const [userInfo, setUserInfo] = useState({
    id: 0,
    phone: "",
    address: "",
    gender: true,
    dateOfBirth: "",
  });

  useEffect(() => {
    console.log(userId);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId); // Lưu ID vào state
      fetchUserInfo(); // Gọi luôn hàm fetch với storedUserId
    } else {
      message.error("Không tìm thấy userId trong localStorage.");
    }
  }, []);

  // Định nghĩa hàm fetchUserInfo bên ngoài useEffect
  const fetchUserInfo = async () => {
    try {
      const response = await baseUrl.get(`/userInfo/${userId}`);
      setUserInfo(response.data);
      console.log("Dữ liệu user:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();

    try {
      const response = await baseUrl.post(`/userInfo/edit`, userInfo);

      if (response.status === 200) {
        message.success("Cập nhật thông tin thành công!");

        // Chuyển trang sau khi hiển thị thông báo
        setTimeout(() => {
          navigate(`/profile/${currentUserId}`);
        }, 1500); // 1.5 giây
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật thông tin!");
      console.error("Error updating user info:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gender") {
      // Chuyển đổi "Male" thành true và "Female" thành false
      const genderValue = value === "Male" ? true : false;
      setUserInfo((prev) => ({ ...prev, [name]: genderValue }));
    } else {
      setUserInfo((prev) => ({ ...prev, [name]: value }));
    }
  };
  return (
    <>
      <ProfileHeader />
      {currentUserId === userId.userId ? (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            Chỉnh sửa thông tin cá nhân
          </h1>
          <form
            onSubmit={handleUpdateUserInfo}
            className="bg-white p-6 rounded shadow"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Giới tính
              </label>
              <select
                name="gender"
                value={
                  userInfo.gender === true
                    ? "Male"
                    : userInfo.gender === false
                    ? "Female"
                    : ""
                }
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Lựa chọn</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Thay đổi
            </button>
          </form>
        </div>
      ) : (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex items-center p-6 border-b">
              <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {userInfo.name || "Tên người dùng"}
                </h1>
                <p className="text-gray-600">
                  Cập nhật thông tin cá nhân của bạn
                </p>
              </div>
            </div>
            {/* Main Info */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Thông tin cơ bản
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-1/3 text-gray-600 font-medium">
                    Số điện thoại
                  </span>
                  <span className="w-2/3 text-gray-800">
                    {userInfo.phone || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 text-gray-600 font-medium">
                    Địa chỉ
                  </span>
                  <span className="w-2/3 text-gray-800">
                    {userInfo.address || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 text-gray-600 font-medium">
                    Giới tính
                  </span>
                  <span className="w-2/3 text-gray-800">
                    {userInfo.gender ? "Nam" : "Nữ" || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 text-gray-600 font-medium">
                    Ngày sinh
                  </span>
                  <span className="w-2/3 text-gray-800">
                    {userInfo.dateOfBirth || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
