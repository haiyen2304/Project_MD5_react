import React, { useEffect, useState } from "react";
import { message, Skeleton } from "antd";
import baseUrl from "../../../../apis/instance";
import { useNavigate } from "react-router-dom";

export default function ListFriendNow() {
  const [friends, setFriends] = useState([]); // State lưu danh sách bạn bè
  const [loading, setLoading] = useState(false); // State loading
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Gọi API lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        const response = await baseUrl.get("/user/friends/friendList"); // API danh sách bạn bè
        setFriends(response.data); // Cập nhật danh sách bạn bè
      } catch (error) {
        message.error("Lỗi lấy danh sách bạn bè"); // Thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    fetchFriends();
  }, []);

  // Chuyển đến trang cá nhân
  const handleProfileClick = (id) => {
    navigate(`/friends/profile/${id}`);
  };

  // Chuyển đến trang nhắn tin
  const handleMessageClick = (id) => {
    navigate(`/messages/${id}`);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-gray-100 ">
        <div className="p-8  flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Danh sách bạn bè hiện tại</h1>
          <a href="">xem tất cả</a>
        </div>

        <ul className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto">
          {loading ? (
            <p>Đang tải danh sách...</p> // Hoặc dùng Ant Design Skeleton
          ) : (
            friends.map((req) => (
              <li
                key={req.id}
                className=" flex flex-col items-center bg-white rounded-lg shadow-md border  flex-[0_0_calc(25%-1.2rem)]"
              >
                <img
                  src={req.info.avatar}
                  alt="Avatar"
                  className="rounded-t w-full h-[200px] object-cover mb-1 hover:cursor-pointer"
                  onClick={() => handleProfileClick(req.id)} // Thêm sự kiện click vào avatar
                />
                <div className="flex flex-col items-center  w-full">
                  <p
                    className=" f text-gray-800 mb-1 font-bold text-[18px]  hover:cursor-pointer"
                    onClick={() => handleProfileClick(req.id)} // Thêm sự kiện click vào tên
                  >
                    {req.username}
                  </p>
                  <div className="mb-3 ml-6 mr-6 flex flex-col gap-2 w-full ">
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-sm text-gray-500  text-center">
                        {req.info.user.login ? "Online" : "Offline"}
                      </p>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          req.info.user.login ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                    </div>

                    <button
                      onClick={() => handleMessageClick(req.id)} // Chuyển đến trang nhắn tin
                      className="mx-3 py-2 text-sm font-medium bg-[#4568f5] text-white rounded-md hover:bg-blue-700"
                    >
                      Nhắn tin
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
