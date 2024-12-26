import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import baseUrl from "../../../../apis/instance";
import { useNavigate } from "react-router-dom";

export default function BlockedFriends() {
  const [blockedFriends, setBlockedFriends] = useState([]); // Danh sách người bị chặn
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Gọi API để lấy danh sách bạn bè bị chặn
  useEffect(() => {
    const fetchBlockedFriends = async () => {
      setLoading(true);
      try {
        const response = await baseUrl.get("/user/friends/blocked-friends");
        setBlockedFriends(response.data); // Cập nhật danh sách
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi lấy danh sách bạn bè bị chặn.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedFriends();
  }, []);

  // Hàm bỏ chặn người dùng
  const handleUnblock = async (id) => {
    try {
      await baseUrl.post(`/user/friends/unblock/${id}`); // Gọi API bỏ chặn
      message.success("Đã bỏ chặn người dùng.");
      setBlockedFriends(blockedFriends.filter((friend) => friend.id !== id)); // Xóa người đó khỏi danh sách
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi bỏ chặn người dùng.");
    }
  };

  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-screen">
      <div className="p-8 flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách người đã bị chặn</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : blockedFriends.length > 0 ? (
        <ul className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blockedFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex flex-col items-center bg-white rounded-lg shadow-md border"
            >
              <img
                src={friend.info.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="rounded-t w-full h-[200px] object-cover mb-2"
              />
              <div className="flex flex-col items-center w-full px-4">
                <p className="text-gray-800 font-bold text-lg">
                  {friend.username}
                </p>
                <p className="text-sm text-gray-500 mb-4">Đã bị chặn</p>
                <button
                  onClick={() => handleUnblock(friend.id)}
                  className="mb-4 w-full py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Bỏ chặn
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          Không có người nào bị chặn.
        </div>
      )}
    </div>
  );
}
