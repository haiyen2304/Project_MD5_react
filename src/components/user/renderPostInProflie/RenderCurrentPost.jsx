import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import {
  FaCamera,
  FaRegComment,
  FaSadTear,
  FaShare,
  FaHeart,
  FaSmile,
  FaGlobe,
  FaUserFriends,
  FaLock,
} from "react-icons/fa";
import RenderImages from "./RenderImages";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { HiMiniGif, HiPaperAirplane } from "react-icons/hi2";
import { FaFaceAngry } from "react-icons/fa6";
import baseUrl from "../../../apis/instance";
import { message } from "antd";
import EditPostBox from "../createPostBox/EditPostBox";
const avatar = localStorage.getItem("avatar");
export default function RenderCurrentPost({
  currentPost,
  showMenuPostId,
  userReactions,
  userReactionModal,
  handleCommentToggle,
  handleInputResize,
  ParentComment,
  handleMenuClick,
  currentUserId,
  handleDeletePost,
  sendReactionToPost,
  handleHiddenPost,
  handleShowModalReportPost,
  comments,
  comment,
  setComment,
  fetchComments,
  handleIconClick,
}) {
  // Khai báo state
  const [showLikeIcons, setShowLikeIcons] = useState(false);
  // const avatar = localStorage.get("avatar");
  const handleLikeHoverModal = () => {
    setShowLikeIcons(true);
  };

  const handleLikeLeaveModal = () => {
    setShowLikeIcons(false);
  };

  //-----------------  Gửi bình luận chính (comment cha)-----------------
  const handleSubmit = async (e, postId) => {
    e.preventDefault(); // Ngăn reload trang
    if (!comment.trim()) {
      message.error("Bình luận không được để trống! ");
      return;
    }
    try {
      const requestBody = {
        content: comment,
        postId: postId,
        parentId: null,
      };
      const response = await baseUrl.post(
        "/user/comments/createComment",
        requestBody
      );
      console.log("Bình luận mới:", response.data);
      message.success("comment đã được đăng thành công!");
      setComment(""); // Xóa nội dung đã nhập sau khi gửi
      fetchComments(postId); // Tải lại danh sách bình luận sau khi gửi
    } catch (error) {
      console.log("lỗi : " + error);
      message.error("Lỗi khi gửi bình luận:", error);
    }
  };

  // Hàm lấy text và icon dựa trên trạng thái
  const getPostPrivacyText = (privacy) => {
    switch (privacy) {
      case "PUBLIC":
        return {
          text: "Công khai",
          icon: <FaGlobe className="text-blue-500" />,
        }; // Icon quả địa cầu
      case "FRIENDS":
        return {
          text: "Bạn bè",
          icon: <FaUserFriends className="text-green-500" />,
        }; // Icon bạn bè
      case "ONLY_ME":
        return {
          text: "Chỉ mình tôi",
          icon: <FaLock className="text-red-500" />,
        }; // Icon khóa
      default:
        return { text: "Không xác định", icon: null }; // Trường hợp không khớp
    }
  };
  const { text, icon } = getPostPrivacyText(currentPost.privacy); // Gọi hàm để lấy text và icon

  return (
    <>
      {/* <EditPostBox /> */}
      <div className="max-w-[800px] w-full max-h-[80vh] min-h-[50vh] overflow-y-auto ">
        {/* Nội dung modal */}
        {/* User Info */}
        <div className="mt-3 flex items-center space-x-3">
          <div className="w-10 h-10">
            <img
              src={currentPost?.avatarUrl} // Ảnh đại diện người dùng
              className="rounded-full w-full h-full"
              alt={currentPost?.userName}
            />
          </div>
          <div className="flex justify-between w-full">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-200">
                {currentPost?.userName} {/* Tên đầy đủ của người đăng */}
              </p>
              {/* ID người đăng */}
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                {icon} {/* Hiển thị icon */}
                {text} {/* Hiển thị trạng thái */}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => handleMenuClick(currentPost?.id)}
                className="text-[20px] menu-container"
              >
                <MdOutlineMoreHoriz />
              </button>

              {console.log("currentUserId", currentUserId)}
              {console.log("currentUserId", +currentPost?.user?.id)}

              {showMenuPostId == currentPost?.id &&
                +currentUserId == +currentPost?.userId && (
                  <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-40 py-2 z-10">
                    <button
                      onClick={() => handleDeletePost(currentPost?.id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Xóa bài viết
                    </button>
                  </div>
                )}
              {/* {showMenuPostId == currentPost?.id &&
                currentUserId == currentPost?.userId && (
                  <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-40 py-2 z-10">
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                      Chỉnh sửa bài viết
                    </button>
                  </div>
                )} */}
              {showMenuPostId == currentPost?.id &&
                currentUserId != +currentPost?.user?.id && (
                  <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-40 py-2 z-10">
                    <button
                      onClick={() => handleShowModalReportPost(currentPost?.id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Báo cáo bài viết
                    </button>
                    <button
                      onClick={() => handleHiddenPost(currentPost?.id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Ẩn bài viết
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-3 mb-3 text-gray-800 dark:text-gray-300 ">
          <p>{currentPost?.content}</p> {/* Nội dung bài viết */}
        </div>
        {/* Post Images */}
        {currentPost?.images?.length > 0 && (
          <RenderImages images={currentPost?.images}></RenderImages>
        )}
        {/* Reaction and Stats */}
        <div className="relative mb-3 mt-3 flex justify-around items-center gap-10 text-[16px] border-t-2 py-1">
          {userReactions.find(
            (reaction) => reaction.postId === currentPost?.id
          ) ? (
            <button
              onMouseEnter={() => handleLikeHoverModal(currentPost.id)}
              onMouseLeave={handleLikeLeaveModal}
              onClick={(e) => {
                e.stopPropagation();
                handleIconClick(currentPost.id, 1);
              }}
              className="text-blue-500 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2"
            >
              {userReactionModal?.iconId === 1 && (
                <div className="flex items-center text-blue-500 gap-1">
                  <AiOutlineLike />
                  Thích
                </div>
              )}

              {userReactionModal?.iconId === 2 && (
                <div className="flex items-center text-pink-500 gap-1">
                  <FaHeart className="" />
                  Yêu thích
                </div>
              )}
              {userReactionModal?.iconId === 3 && (
                <div className="flex items-center text-yellow-500 gap-1">
                  <FaSmile className="" />
                  Haha
                </div>
              )}
              {userReactionModal?.iconId === 4 && (
                <div className="flex items-center text-yellow-500 gap-1">
                  <FaSadTear className="" />
                  Buồn
                </div>
              )}
              {userReactionModal?.iconId === 5 && (
                <div className="flex items-center text-orange-400 gap-1">
                  <FaFaceAngry className="" />
                  phẫn lộ
                </div>
              )}
            </button>
          ) : (
            <button
              onMouseEnter={() => handleLikeHoverModal(currentPost.id)}
              onMouseLeave={handleLikeLeaveModal}
              onClick={(e) => {
                e.stopPropagation();
                handleIconClick(currentPost.id, 1);
              }}
              className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2"
            >
              <AiOutlineLike />
              Thích
            </button>
          )}

          {showLikeIcons && (
            <div
              onMouseEnter={() => handleLikeHoverModal(currentPost?.id)}
              onMouseLeave={handleLikeLeaveModal}
              style={{ opacity: showLikeIcons ? 1 : 0 }}
              className="absolute mt-2 left-0 -top-10 space-x-2 flex items-center bg-white border rounded-lg shadow-lg px-3 py-2 transition-opacity duration-1000"
            >
              <AiOutlineLike
                onClick={(e) => {
                  e.stopPropagation();
                  sendReactionToPost(currentPost?.id, 1);
                }}
                className="text-blue-500 text-xl cursor-pointer"
              />
              <FaHeart
                onClick={(e) => {
                  e.stopPropagation();
                  sendReactionToPost(currentPost?.id, 2);
                }}
                className="text-red-400 text-xl cursor-pointer"
              />
              <FaSmile
                onClick={(e) => {
                  e.stopPropagation();
                  sendReactionToPost(currentPost?.id, 3);
                }}
                className="text-yellow-500 text-xl cursor-pointer"
              />
              <FaSadTear
                onClick={(e) => {
                  e.stopPropagation();
                  sendReactionToPost(currentPost?.id, 4);
                }}
                className="text-blue-500 text-xl cursor-pointer"
              />
              <FaFaceAngry
                onClick={(e) => {
                  e.stopPropagation();
                  sendReactionToPost(currentPost?.id, 5);
                }}
                className="text-orange-500 text-xl cursor-pointer"
              />
            </div>
          )}

          {/* Hiển thị danh sách biểu tượng khi hover */}
          <button
            onClick={handleCommentToggle}
            className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2"
          >
            <FaRegComment />
            {comments.length} Bình luận
          </button>
          <button className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2">
            <FaShare />
            Chia sẻ
          </button>
        </div>

        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <>
              <ParentComment
                comment={comment}
                currentPost={currentPost}
                handleInputResize={handleInputResize}
                handleSubmit={handleSubmit}
                fetchComments={() => fetchComments(currentPost?.id)}
              />
            </>
          ))
        ) : (
          <p>Chưa có bình luận nào.</p> // Hiển thị thông báo nếu không có bình luận
        )}

        {/* -------viết bình luận cha--------- */}
        <div className="flex items-start gap-2 mt-3">
          <img
            src={avatar} // Avatar người dùng
            alt="Avatar"
            height={40}
            width={40}
            className="rounded-full  size-10"
          />

          <form
            onSubmit={(event) => handleSubmit(event, currentPost.id)}
            className="flex flex-col space-y-2 w-full relative"
          >
            <textarea
              className="w-full px-2 border-0 rounded-2xl bg-gray-100 resize-none overflow-hidden focus:outline-none"
              placeholder="Viết bình luận..."
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onInput={handleInputResize}
            ></textarea>
            <button className="absolute right-2 bottom-3 text-[17px] text-gray-300 border-none">
              <HiPaperAirplane /> Gửi
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
