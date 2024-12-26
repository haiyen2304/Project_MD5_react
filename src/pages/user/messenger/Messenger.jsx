import React, { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { PiNotePencilFill } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { Button, message } from "antd";
import { FaPhone } from "react-icons/fa6";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

import myImage from "../../../assets/avartaMeo.jpg";
import { Outlet, useNavigate } from "react-router-dom";
import baseUrl from "../../../apis/instance";
import MessageComponent from "./MessageComponent";

export default function Messenger() {
  const [friends, setFriends] = useState([]); // State lưu danh sách bạn bè
  const [loading, setLoading] = useState(false); // State loading
  const [activeFriend, setActiveFriend] = useState(null); // Bạn bè đang nhắn tin
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Gọi API lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        const response = await baseUrl.get("/user/friends/friendList"); // API danh sách bạn bè
        const sortedFriends = response.data.sort((a, b) =>
          a.isLogin === "true" && b.isLogin === "false" ? -1 : 1
        );
        setFriends(sortedFriends); // Cập nhật danh sách bạn bè
      } catch (error) {
        message.error("Lỗi lấy danh sách bạn bè"); // Thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    fetchFriends();
  }, []);

  // Chuyển đến trang nhắn tin riêng
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const currentUserId = +localStorage.getItem("userId");

  const handleProfileClick = async (friend) => {
    console.log("bạn : ============", friend.id);
    const friendID = friend.id;

    try {
      // Gọi API lấy Room ID
      const response = await baseUrl.get(
        `/user/rooms/getRoomId?user1Id=${currentUserId}&user2Id=${friendID}`
      );
      console.log("data phòng: ", response);

      const roomId = response.data; // Lấy roomId từ phản hồi API
      console.log("phòng: ", roomId);

      if (roomId) {
        // Cập nhật trạng thái phòng chat hiện tại
        setCurrentRoomId(roomId);

        // Chuyển hướng đến trang nhắn tin riêng và truyền `roomId` vào state
        navigate(`/messenger/chat/${friend.id}`, {
          state: { friend, roomId },
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy Room ID:", error);

      // Hiển thị thông báo lỗi nếu cần
      alert("Không thể lấy Room ID. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="flex font-semibold h-[calc(100vh-4rem)]">
        {/* Sidebar Left */}
        <div className="w-1/4 #ffffff px-4 py-2 flex flex-col ">
          <div className="flex items-center justify-between mt-5">
            <h1 className="text-lg font-bold">Đoạn Chat</h1>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
                <SlOptions className="text-lg" />
              </div>
              <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
                <PiNotePencilFill className="text-lg" />
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            {/* Search Input */}
            <input
              type="search"
              placeholder="検索"
              className="w-full px-10 py-1 border border-gray-300 rounded-full"
            />
            {/* Search Icon */}
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="mt-2">
            <Button className="border-none rounded-full">Hộp Thư</Button>
            <Button className="border-none rounded-full">Cộng Đồng</Button>
          </div>

          <div className="overflow-auto">
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className={`flex gap-3 mt-3 hover:bg-gray-300 rounded-md cursor-pointer ${
                    friend.status === "online" ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleProfileClick(friend)} // Gọi hàm chuyển hướng
                >
                  <img
                    src={friend?.info?.avatar}
                    alt={friend?.username}
                    height={50}
                    width={50}
                    className="rounded-full size-[50px] object-cover"
                  />

                  <div className="flex flex-col justify-center ">
                    <h3 class="text-custom-gray text-sm">{friend?.username}</h3>
                    <div className="flex justify-start items-center gap-2">
                      <p className="text-sm text-gray-500  text-center">
                        {friend.info.user.login ? "Online" : "Offline"}
                      </p>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          friend.info.user.login ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Main nhắn tin */}
        <div className="w-3/4 bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}
