import React, { useEffect, useState } from "react";
import { message } from "antd";
import baseUrl from "../../../../apis/instance";
import { useNavigate } from "react-router-dom";
import Sendered from "./Sendered";
import Hint from "./Hint";
import ListFriendNow from "./ListFriendNow";
import BlockedFriend from "./BlockedFriend";

export default function HomeFriend() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate(); // Hook để chuyển hướng3
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // State lưu danh sách gợi ý

  // const [refresh, setRefresh] = useState(false); // State để kiểm soát gọi lại API

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let response = await baseUrl.get("/user/friends/friendList"); // danh sách bạn bè
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
      setRequests(friends.filter((req) => req.id !== id)); // Cập nhật danh sách
    } catch (error) {
      message.error("Có lỗi xảy ra khi từ chối lời mời");
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`); // Chuyển hướng tới trang cá nhân
  };
  return (
    <>
      <Sendered />
      <Hint />
      <ListFriendNow />
      <BlockedFriend />
    </>
  );
}
