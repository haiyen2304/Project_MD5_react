import React, { useEffect, useState } from "react";
import { message } from "antd";
import baseUrl from "../../../../apis/instance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Hint() {
  const [suggestions, setSuggestions] = useState([]); // State lưu danh sách gợi ý
  const navigate = useNavigate(); // Hook để chuyển hướng
  const [loading, setLoading] = useState(false);

  console.log("Log: ", Cookies.get("removedSuggestions"));
  //-------------------------Hàm tải danh sách gợi ý-------------------------------------------
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await baseUrl.get(
        "/user/friends/suggestions/common-friends"
      );
      // Lấy danh sách bị gỡ từ cookie
      const removedSuggestions = JSON.parse(
        Cookies.get("removedSuggestions") || "[]"
      );

      // Lọc danh sách, loại bỏ những người đã bị gỡ trong vòng 2 tháng
      const validSuggestions = response.data.filter((suggestion) => {
        const removed = removedSuggestions.find(
          (item) => item.id === suggestion.id
        );
        if (!removed) return true; // Nếu không bị gỡ, giữ lại
        // Nếu bị gỡ, kiểm tra thời hạn 2 tháng
        const removedDate = new Date(removed.removedAt);
        const now = new Date();
        const diffInDays = Math.ceil(
          (now - removedDate) / (1000 * 60 * 60 * 24)
        );
        return diffInDays >= 60; // Giữ lại nếu đã quá 2 tháng
      });
      setSuggestions(validSuggestions); // Cập nhật danh sách gợi ý hợp lệ
    } catch (error) {
      message.error("Lỗi lấy danh sách gợi ý");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []); // Gọi lại mỗi khi `refresh` thay đổi

  //----------------- Gửi lời mời kết bạn-----------------
  const handleSendRequest = async (id) => {
    // Loại ngay khỏi danh sách cục bộ để giao diện phản hồi nhanh
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== id)
    );
    try {
      await baseUrl.post(`/user/friends/send-request/${id}`);
      message.success("Đã gửi lời mời kết bạn");
      handleProfileClick(id); // chuyển đến trang cá nhân người vừa gửi lời mời
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi lời mời");
    }
  };

  //----------------- Gỡ bỏ gợi ý-----------------
  const handleRemove = (id) => {
    // Lấy danh sách gỡ từ cookie (nếu không tồn tại thì mặc định là mảng rỗng)
    const removedSuggestions = JSON.parse(
      Cookies.get("removedSuggestions") || "[]"
    );

    // Thêm ID và thời gian gỡ mới vào danh sách
    const updatedSuggestions = [
      ...removedSuggestions,
      { id, removedAt: new Date().toISOString() },
    ];

    // Lưu danh sách cập nhật vào cookie với thời hạn 2 tháng
    Cookies.set("removedSuggestions", JSON.stringify(updatedSuggestions), {
      expires: 60,
    });

    // Loại bỏ người dùng khỏi danh sách hiển thị
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== id)
    );

    message.success("Đã gỡ khỏi danh sách gợi ý");
  };

  //----------------- Chuyển đến trang cá nhân-----------------
  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <>
      <>
        <div className="w-full flex flex-col bg-gray-100">
          <div className="p-8  flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Gợi ý bạn bè</h1>
            <button onClick={() => navigate("/friends/suggestions")}>
              Xem tất cả
            </button>
          </div>

          {!suggestions.length ? (
            <p className="text-center text-gray-500">
              Không có gợi ý bạn bè nào
            </p>
          ) : (
            <ul className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto">
              {suggestions.map((req) => (
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
                        onClick={() => handleSendRequest(req.id)} // Gửi lời mời kết bạn
                        className="mx-3 py-2 text-sm font-medium bg-[#4568f5] text-white rounded-md hover:bg-blue-700"
                      >
                        Gửi lời mời
                      </button>
                      <button
                        onClick={() => handleRemove(req.id)} // Gỡ khỏi danh sách
                        className="mx-3 py-2 text-sm font-medium bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Gỡ
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    </>
  );
}
