import React, { useEffect, useState } from "react";
import { message } from "antd";
import baseUrl from "../../../../apis/instance";
import { useNavigate } from "react-router-dom";

export default function Sendered() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate(); // Hook để chuyển hướng3
  const [loading, setLoading] = useState(false);
  // const [refresh, setRefresh] = useState(false); // State để kiểm soát gọi lại API

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await baseUrl.get("/user/friends/pending-friends");
        setFriends(response.data);
      } catch (error) {
        message.error("Lỗi lấy danh sách lời mời");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Hàm xử lý chấp nhận lời mời
  const handleAccept = async (id) => {
    try {
      await baseUrl.post(`/user/friends/accept-request/${id}`); // API chấp nhận lời mời
      message.success("Đã chấp nhận lời mời");
      setFriends(friends.filter((req) => req.id !== id)); // Cập nhật danh sách
    } catch (error) {
      message.error("Có lỗi xảy ra khi chấp nhận lời mời");
    }
  };

  // Hàm xử lý từ chối lời mời
  const handleReject = async (id) => {
    try {
      await baseUrl.delete(`/user/friends/decline-request/${id}`); // API từ chối lời mời
      message.success("Đã từ chối lời mời");
      setFriends(friends.filter((req) => req.id !== id)); // Cập nhật danh sách
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi từ chối lời mời");
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`); // Chuyển hướng tới trang cá nhân
  };
  return (
    <>
      <div className="w-full flex flex-col bg-gray-100 ">
        <div className="p-8  flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Lời mời kết bạn</h1>
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
                    className="f text-gray-800 mb-1 font-bold text-[18px]  hover:cursor-pointer"
                    onClick={() => handleProfileClick(req.id)} // Thêm sự kiện click vào tên
                  >
                    {req.username}
                  </p>
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <img
                      src="avatar-small.png"
                      alt="Mutual Friend"
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    {req.suggestedFriendDTO.commonFriendsCount}
                  </p>
                  <div className="mb-3 ml-6 mr-6 flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="mx-3 py-2 text-sm font-medium bg-[#4568f5] text-white rounded-md hover:bg-blue-700"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="mx-3 py-2 text-sm font-medium bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Từ chối
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
