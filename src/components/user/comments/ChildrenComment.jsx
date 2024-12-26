import { Dropdown, Menu, message, Modal } from "antd";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import baseUrl from "../../../apis/instance";

export default function ChildrenComment({
  childComment,

  editCommentId,
  currentPost,
  currentUserId,
  fetchReplies,
}) {
  const [childDropdownVisibleId, setChildDropdownVisibleId] = useState(null); // Dropdown cho comment con
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editContent, setEditContent] = useState(childComment.content); // Nội dung chỉnh sửa

  const [isDeleteModalVisibleChild, setIsDeleteModalVisibleChild] =
    useState(false); // Modal xác nhận xóa
  const [selectedComment, setSelectedComment] = useState(null);
  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (comment) => {
    setSelectedComment(comment);
    setIsDeleteModalVisibleChild(true);
  };
  // Toggle Dropdown cho comment con
  const toggleChildDropdown = (id) => {
    setChildDropdownVisibleId(childDropdownVisibleId === id ? null : id);
  };

  // Xác nhận xóa bình luận con
  const confirmDelete = async () => {
    if (!selectedComment || selectedComment.id !== childComment.id) return; // Đảm bảo chỉ xóa bình luận con
    try {
      await handleAction("delete", selectedComment); // Gọi hàm xử lý xóa
      setIsDeleteModalVisibleChild(false);
    } catch (error) {
      message.error("Lỗi khi xóa bình luận!");
    }
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      message.error("Nội dung chỉnh sửa không được để trống!");
      return;
    }
    try {
      await baseUrl.put(
        `/user/comments/${childComment.id}?newContent=${editContent}`,
        {}
      );

      message.success("Cập nhật bình luận thành công!");
      setIsEditing(false); // Tắt chế độ chỉnh sửa
      fetchReplies(childComment.parentId); // Reload bình luận
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi cập nhật bình luận!");
    }
  };

  const handleAction = async (action, comment) => {
    try {
      if (action === "delete") {
        if (comment.parentId) {
          // Xóa bình luận con
          await baseUrl.delete(`/user/comments/${comment.id}`);
          message.success("Xóa bình luận thành công!");
          await fetchReplies(comment.parentId); // Tải lại danh sách bình luận con
        } else {
          // Xóa bình luận cha
          showDeleteModal(comment); // Gọi modal xác nhận xóa
        }
      } else if (action === "hide") {
        await baseUrl.put(
          `/user/comments/hide/${comment.id}/${comment.userId}`
        );
        message.success("Ẩn bình luận thành công!");
      } else if (action === "edit") {
        setSelectedComment(comment);
        setIsEditing(true); // Bật chế độ chỉnh sửa
      }
    } catch (error) {
      console.log(error);
      message.error(`Lỗi khi thực hiện hành động ${action}`);
    }
  };

  // Menu Dropdown cho comment con
  const childMenu = (
    <Menu>
      {/* Nút Ẩn: Chỉ chủ bài viết mới được ẩn và không thể ẩn comment của chính mình */}
      {currentPost.userId === +currentUserId &&
        childComment.userId !== +currentUserId && (
          <Menu.Item
            key="hide"
            onClick={() => handleAction("hide", childComment)}
            disabled={childComment.status === false}
          >
            Ẩn bình luận
          </Menu.Item>
        )}

      {/* Nút Chỉnh sửa: Chỉ chủ comment mới được chỉnh sửa */}
      {childComment.userId === +currentUserId && (
        <Menu.Item
          key="edit"
          onClick={() => handleAction("edit", childComment)}
          disabled={childComment.status === false}
        >
          Chỉnh sửa
        </Menu.Item>
      )}

      {/* Nút Xóa: Chỉ chủ comment hoặc chủ bài viết */}
      {(childComment.userId === +currentUserId ||
        currentPost.userId === +currentUserId) && (
        <Menu.Item
          key="delete"
          onClick={() => showDeleteModal(childComment)}
          disabled={childComment.status === false}
        >
          Xóa bình luận
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <div
      key={childComment.id}
      className={`flex items-start w-full gap-2 px-4 mt-2 ${
        childComment.status === false ? "opacity-50" : ""
      }`}
    >
      <img
        src={childComment.avatarUrlUser || "/default-avatar.png"}
        alt="Avatar"
        height={30}
        width={30}
        className="rounded-full object-cover"
      />

      {isEditing ? (
        <>
          <textarea
            className="w-full px-4 py-2 border rounded-lg"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          ></textarea>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={handleSaveEdit}
            >
              Lưu
            </button>
            <button
              className="border px-3 py-1 rounded "
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1">
            <p
              className={`font-semibold ${
                childComment.status === false ? "text-gray-500" : "text-black"
              }`}
            >
              {childComment.userName}
            </p>
            <p>{childComment.content}</p>
            {/* Nội dung bình luận con */}
          </div>
        </>
      )}

      {/*----------- nút chỉnh sửa-------------- */}

      <div className="relative inline-block text-left">
        {/* Nút ellipsis (ba chấm) */}
        <Dropdown overlay={childMenu} trigger={["click"]}>
          <button
            className={`p-2 hover:bg-gray-200 rounded-full ${
              childComment.status === false ? "cursor-not-allowed" : ""
            }`}
            disabled={childComment.status === false} // Vô hiệu hóa dropdown
            onClick={() => toggleChildDropdown(childComment.id)}
          >
            <FiMoreHorizontal size={20} />
          </button>
        </Dropdown>
      </div>
      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa bình luận con"
        visible={
          isDeleteModalVisibleChild && selectedComment?.id === childComment.id // Chỉ hiện modal của bình luận con
        }
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisibleChild(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bình luận này không? Con</p>
      </Modal>
    </div>
  );
}
