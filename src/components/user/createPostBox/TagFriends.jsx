import React, { useEffect, useState } from "react";
import baseUrl from "../../../apis/instance";
import { Avatar, Input, List, message, Button } from "antd";

export default function TagFriends({
  isTagModalOpen,
  closeTagModal,
  taggedFriends,
  setTaggedFriends,
}) {
  /**quản lý Modal Gắn thẻ */
  const [friendListShow, setFriendListShow] = useState([]); // Danh sách bạn bè hiển thị
  const [search, setSearch] = useState(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  /**--- Gọi API lấy danh sách bạn bè khi mở modal "Gắn thẻ"-----
   * bước 1: chỉ gọi API khi Modal được mở
   * bước 2 : khi API đang gọi thì cho loading
   * bước 3: gọi API hiển thị danh sách bạn bè
   *  * hiển thị toàn bộ nếu không nhập
   * Lọc lại khi danh sách hoặc từ khóa tìm kiếm thay đổi
   */

  const [reload, setreload] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!isTagModalOpen) {
        return;
      }
      setLoading(true);
      try {
        let response = null;
        if (!search.trim()) {
          response = await baseUrl.get("/user/friends/friendList");
        } else {
          response = await baseUrl.get(`/user/friends/searchFriend`, {
            params: { search },
          });
        }
        // Kiểm tra nếu danh sách bạn bè trống
        if (response.data && response.data.length === 0) {
          setFriendListShow([]);
          message.info("Danh sách bạn bè trống!");
        } else {
          const friends = response.data || [];
          // Lọc những người đã được gắn thẻ
          const filteredFriends = friends.filter(
            (friend) => !taggedFriends.some((tagged) => tagged.id === friend.id)
          );
          //   const limitedFriends = filteredFriends.slice(0, 10); // Lấy tối đa 10 người
          setFriendListShow(filteredFriends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error); // Log lỗi chi tiết
        message.error("Lỗi khi tải danh sách bạn bè!");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [isTagModalOpen, search, reload]);

  /** Xử lý thêm bạn bè vào danh sách tag */
  const handleTagFriend = (friend) => {
    if (!taggedFriends.some((f) => f.id === friend.id)) {
      setTaggedFriends([...taggedFriends, friend]); // Thêm vào danh sách tag
      message.success(`Đã tag ${friend.username}`);
      setreload(!reload);
    }
  };

  /** Xử lý xóa bạn bè khỏi danh sách tag */
  const handleUntagFriend = (friendId) => {
    setTaggedFriends(taggedFriends.filter((friend) => friend.id !== friendId)); // Xóa khỏi danh sách tag
    message.info("Đã xóa tag");
    setreload(!reload);
  };

  /** Xử lý danh sách bạn bè đã chọn ở đây */
  const handleConfirmSelection = () => {
    message.success("Đã xác nhận danh sách bạn bè đã chọn!");
    closeTagModal(); // Đóng modal sau khi xác nhận
  };

  return (
    <>
      <Input
        placeholder="Tìm kiếm bạn bè"
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Cập nhật từ khóa tìm kiếm
      />

      {loading ? (
        <p>Đang tải danh sách bạn bè...</p>
      ) : (
        <List
          className="overflow-y-auto has-[200px]:"
          dataSource={friendListShow}
          renderItem={(friend) => (
            <List.Item onClick={() => handleTagFriend(friend)}>
              <List.Item.Meta
                avatar={<Avatar src={friend?.info.avatar} />} // Hiển thị avatar
                title={friend.username}
              />
            </List.Item>
          )}
        />
      )}

      {taggedFriends.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">Đã gắn thẻ:</p>
          <div className="flex flex-wrap gap-2">
            {taggedFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
              >
                {console.log(friend)}
                <Avatar src={friend?.info.avatar} size="small" />
                <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
                  {friend.username}
                </span>
                <button
                  className="text-red-500"
                  onClick={() => handleUntagFriend(friend.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Nút OK để xác nhận danh sách bạn bè đã chọn */}
      <div className="flex justify-between items-center mt-4">
        <div></div> {/* Phần tử trống để đẩy nút sang bên phải */}
        <Button type="primary" onClick={handleConfirmSelection}>
          OK
        </Button>
      </div>
    </>
  );
}
