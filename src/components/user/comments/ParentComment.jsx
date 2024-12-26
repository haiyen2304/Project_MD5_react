import { CloseOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { HiPaperAirplane } from "react-icons/hi2";
import baseUrl from "../../../apis/instance";
import ChildrenComment from "./ChildrenComment";

export default function ParentComment(props) {
  const {
    comment,
    currentPost,
    handleInputResize,
    handleSubmit,
    fetchComments,
  } = props;

  // Các state quản lý
  const [isVisible, setIsVisible] = useState(true); // Kiểm soát hiển thị ô nhập liệu phản hồi
  const [replyCommentId, setReplyCommentId] = useState(null); // ID của comment cha cần phản hồi
  const [replyContent, setReplyContent] = useState(""); // Nội dung phản hồi
  const [replies, setReplies] = useState([]); // Danh sách bình luận con
  const [loadingReplies, setLoadingReplies] = useState(null); // Loading cho bình luận con

  const [editCommentId, setEditCommentId] = useState(null); // ID bình luận đang chỉnh sửa
  const [dropdownVisibleId, setDropdownVisibleId] = useState(null); // ID của dropdown đang mở

  const [parentDropdownVisibleId, setParentDropdownVisibleId] = useState(null); // Dropdown cho comment cha
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Trạng thái modal xác nhận xóa
  const [selectedComment, setSelectedComment] = useState(null); // Bình luận được chọn để xóa

  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editContent, setEditContent] = useState(comment.content); // Nội dung chỉnh sửa

  const currentUserId = localStorage.getItem("userId");

  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (comment) => {
    setSelectedComment(comment);
    setIsDeleteModalVisible(true);
  };

  // Xác nhận xóa bình luận cha
  const confirmDelete = async () => {
    if (!selectedComment || selectedComment.id !== comment.id) return; // Đảm bảo chỉ xóa bình luận cha
    try {
      await baseUrl.delete(`/user/comments/${selectedComment.id}`);
      message.success("Xóa bình luận thành công!");
      fetchComments(); // Tải lại danh sách bình luận
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi xóa bình luận!");
    }
  };
  // Toggle Dropdown cho comment cha
  const toggleParentDropdown = (id) => {
    setParentDropdownVisibleId(parentDropdownVisibleId === id ? null : id);
  };

  //)-----------------------Gửi phản hồi (comment con)-----------------------------
  const handleSubmitReply = async (e, postId, parentId) => {
    e.preventDefault(); // Ngăn reload trang
    if (!replyContent.trim()) {
      message.error("Bình luận không được để trống! ");
      return;
    }
    try {
      const requestBody = {
        content: replyContent,
        postId: postId,
        parentId: parentId,
      };
      const response = await baseUrl.post(
        "/user/comments/createComment",
        requestBody
      );
      console.log("Bình luận mới:", response.data);
      message.success("comment con đã được đăng thành công!");
      setReplyContent(""); // Reset nội dung phản hồi
      fetchReplies(parentId); // Reload danh sách phản hồi cho comment cha
      setIsVisible(!isVisible); // Ẩn textarea
    } catch (error) {
      console.log("lỗi : " + error);
      message.error("Lỗi khi gửi bình luận:", error);
    }
  };

  //---------- Tải danh sách bình luận con----------
  /**
   * [{parentId: 3. replies: []},{...}]
   * [[con1],[con2]]
   *
   */
  const fetchReplies = async (parentId) => {
    setLoadingReplies(parentId); // Hiển thị trạng thái loading cho comment cha
    try {
      const response = await baseUrl.get(`/user/comments/children/${parentId}`);
      setReplies((prevReplies) => {
        //
        const index = prevReplies.findIndex((r) => r.parentId === parentId);
        if (index !== -1) {
          // Nếu đã có bình luận con cho bình luận cha này, cập nhật danh sách
          prevReplies[index].replies = response.data; // Cập nhật phản hồi mới
          return [...prevReplies];
        } else {
          // Nếu chưa có bình luận con cho bình luận cha này, thêm mới
          return [...prevReplies, { parentId, replies: response.data }]; // Thêm phản hồi mới
        }
      });
    } catch (error) {
      console.log(error);
      message.error("Không thể tải phản hồi!");
    } finally {
      setLoadingReplies(null);
    }
  };

  // Hàm xử lý phản hồi
  const handleReply = (commentId) => {
    setReplyCommentId(commentId); // Đánh dấu comment cha cần phản hồi// Hiển thị ô phản hồi cho commentId cụ thể
    fetchReplies(commentId); // Tải các phản hồi liên quan
  };

  // Chuyển hướng tới trang cá nhân
  const handleProfileClick = (id) => {
    Navigate(`/profile/${id}`);
  };

  // Xử lý các hành động
  const handleAction = async (action, comment) => {
    // Kiểm tra nếu comment.status là false -> không thực hiện
    if (comment.status === false) return;
    try {
      if (action === "delete") {
        showDeleteModal(comment);
      } else if (action === "hide") {
        await baseUrl.put(
          `/user/comments/hide/${comment.id}/${comment.userId}`
        );
        message.success("Ẩn bình luận thành công!");
      } else if (action === "edit") {
        setIsEditing(true); // Bật chế độ chỉnh sửa
      }
    } catch (error) {
      message.error(`Lỗi khi thực hiện hành động ${action}`);
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
        `/user/comments/${comment.id}?newContent=${editContent}`,
        {}
      );

      message.success("Cập nhật bình luận thành công!");
      setIsEditing(false); // Tắt chế độ chỉnh sửa
      fetchComments(); // Reload bình luận
    } catch (error) {
      message.error("Lỗi khi cập nhật bình luận!");
    }
  };

  console.log("currentPost", currentPost);
  console.log("comment", comment);
  // Menu Dropdown cho cha
  const parentMenu = (
    <Menu>
      {/* Nút Ẩn: Chỉ chủ bài viết mới được ẩn và không thể ẩn comment của chính mình */}
      {currentPost.userId === +currentUserId &&
        comment.userId !== +currentUserId && (
          <Menu.Item
            key="hide"
            onClick={() => handleAction("hide", comment)}
            disabled={comment.status === false}
          >
            Ẩn bình luận
          </Menu.Item>
        )}

      {/* Nút Chỉnh sửa: Chỉ chủ comment mới được chỉnh sửa */}
      {comment.userId === +currentUserId && (
        <Menu.Item
          key="edit"
          onClick={() => handleAction("edit", comment)}
          disabled={comment.status === false}
        >
          Chỉnh sửa
        </Menu.Item>
      )}

      {/* Nút Xóa: Chỉ chủ comment hoặc chủ bài viết */}
      {(comment.userId === +currentUserId ||
        currentPost.userId === +currentUserId) && (
        <Menu.Item
          key="delete"
          onClick={() => showDeleteModal(comment)}
          disabled={comment.status === false}
        >
          Xóa bình luận
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div
      className={`flex justify-between ${
        comment.status === false ? "opacity-50" : "" // Làm nhạt bình luận nếu status === false
      }`}
    >
      <div key={comment.id} className="flex flex-1 items-start gap-2 mb-3">
        <img
          src={comment.avatarUrlUser || "/default-avatar.png"} // Đảm bảo có ảnh mặc định nếu không có avatar
          alt="Avatar"
          height={40}
          width={40}
          style={{
            cursor: comment.status === false ? "not-allowed" : "pointer", // Vô hiệu hóa cursor nếu status = false
            pointerEvents: comment.status === false ? "none" : "auto", // Ngăn mọi thao tác
          }}
          onClick={() => handleProfileClick(comment.userId)} // dùng navigate chuyển trang
        />

        <div className="w-full flex flex-col">
          {/* // Hiển thị nội dung bình luận */}
          {isEditing ? (
            <>
              <div>
                <textarea
                  className="w-full p-2 border rounded"
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
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-100 pl-4 rounded-lg">
                <p
                  className="font-semibold"
                  style={{
                    color: comment.status === false ? "gray" : "black", // Màu chữ nhạt khi status = false
                    cursor:
                      comment.status === false ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleProfileClick(comment.userId)} // dùng navigate chuyển trang
                >
                  {comment.userName}
                </p>
                <p className="mb-2">{comment.content}</p>
              </div>
            </>
          )}

          {/* Nội dung bình luận cha */}
          {/* Thời gian bình luận và các nút */}
          <div className="flex flex-col items-start gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {/* ngày hiện tại thì hiện giờ, còn trước ngày hôm nay thì hiển thị ngày tháng năm */}
              <span>{comment.createdAt || "Vừa xong"}</span>{" "}
              {/* Hiển thị thời gian */}
              <button
                className={`hover:text-blue-600 ${
                  comment.status === false ? "cursor-not-allowed" : ""
                }`}
                disabled={comment.status === false} // Vô hiệu hóa nút
              >
                Thích
              </button>
              <button
                className={`hover:text-blue-600 ${
                  comment.status === false ? "cursor-not-allowed" : ""
                }`}
                disabled={comment.status === false} // Vô hiệu hóa nút
                onClick={() => {
                  setIsVisible(true); //-----------------------------------------xxx
                  setReplyCommentId(comment.id); // Lưu ID của bình luận cha mà người dùng muốn phản hồi
                  fetchReplies(comment.id); // Tải danh sách phản hồi (bình luận con) thuộc bình luận cha này
                }} // Hiển thị ô nhập liệu
              >
                Phản hồi
              </button>
              {comment.childCommentCount > 0 && (
                <div className="text-sm text-blue-600 cursor-pointer mt-2">
                  <span>
                    {`Xem tất cả ${comment.childCommentCount} phản hồi`}
                  </span>
                  <button
                    className="ml-2 hover:underline"
                    onClick={() => fetchReplies(comment.id)}
                  >
                    {loadingReplies === comment.id
                      ? "Đang tải..."
                      : "Xem tất cả"}
                  </button>
                </div>
              )}
            </div>
            {/*---------------------Ô nhập liệu phản hồi (bình luận con)---------------- */}
            {console.log("replyId = ", replyCommentId)}
            {replyCommentId === comment.id && (
              <div className="w-full flex items-start gap-2 mt-3">
                {console.log("hiển thị form comment thứ ", replyCommentId)}
                <form
                  onSubmit={(event) => handleSubmit(event, currentPost.id)}
                  className="flex flex-col space-y-2 w-full relative"
                >
                  {isVisible && (
                    <>
                      <div className="flex justify-between">
                        <div className="relative w-[320px] flex items-start gap-2 ">
                          <img
                            src={currentPost?.avatarUrl} // Avatar người dùng
                            alt="Avatar"
                            height={40}
                            width={40}
                            className="rounded-full size-7  "
                          />
                          <textarea
                            className="w-full px-4 py-2 border-0 rounded-2xl bg-gray-100 resize-none overflow-hidden focus:outline-none"
                            placeholder="Viết bình luận phản hồi bình luận..."
                            rows="2"
                            value={replyContent} // Giá trị nội dung phản hồi
                            onChange={
                              (e) => setReplyContent(e.target.value) // Cập nhật nội dung phản hồi
                            }
                            onInput={handleInputResize}
                          ></textarea>

                          <button
                            onClick={(event) =>
                              handleSubmitReply(
                                // Gửi phản hồi
                                event,
                                comment.postId,
                                comment.id
                              )
                            }
                            className="absolute right-2 bottom-3 text-[17px] text-gray-600 border-none"
                          >
                            <HiPaperAirplane className="hover:text-blue-600 transition-all" />
                          </button>
                        </div>
                        {/* Nút Xóa */}
                        <button
                          onClick={(e) => {
                            setIsVisible(false);
                            e.preventDefault();
                            setReplyContent("");
                          }} // Xóa nội dung trong textarea
                          className="absolute right-[68px] text-gray-500 hover:text-red-600 transition-all"
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
            {/*----------HẾT----------- Ô nhập liệu phản hồi---con------------------ */}
            {/* Hiển thị danh sách phản hồi (bình luận con) thuộc bình luận cha này */}

            {replies
              .filter((r) => r.parentId === comment.id) // Lọc các bình luận con có parentId trùng với ID bình luận cha// Lọc phản hồi thuộc bình luận cha
              .flatMap((r) =>
                r.replies.map(
                  (
                    childComment // Lặp qua danh sách bình luận con
                  ) => (
                    <ChildrenComment
                      key={childComment.id}
                      childComment={childComment}
                      setEditContent={setEditContent}
                      editContent={editContent}
                      handleSaveEdit={handleSaveEdit}
                      editCommentId={editCommentId}
                      setIsDeleteModalVisible={setIsDeleteModalVisible}
                      isDeleteModalVisible
                      confirmDelete
                      currentPost={currentPost}
                      currentUserId={currentUserId}
                      fetchReplies={fetchReplies}
                    />
                  )
                )
              )}

            {/* ---------------------------- */}
          </div>
        </div>
      </div>
      {/*----------- nút chỉnh sửa-------------- */}
      <div className="relative inline-block text-left">
        {/* Nút ellipsis (ba chấm) */}
        <Dropdown overlay={parentMenu} trigger={["click"]}>
          <button
            className={`p-2 hover:bg-gray-200 rounded-full ${
              comment.status === false ? "cursor-not-allowed" : ""
            }`}
            disabled={comment.status === false} // Vô hiệu hóa dropdown
            onClick={() => toggleParentDropdown(comment.id)}
          >
            <FiMoreHorizontal size={20} />
          </button>
        </Dropdown>
      </div>
      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa bình luận"
        visible={isDeleteModalVisible && selectedComment?.id === comment.id} // Chỉ hiện modal của bình luận cha
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bình luận này không? Cha</p>
      </Modal>
    </div>
  );
}
