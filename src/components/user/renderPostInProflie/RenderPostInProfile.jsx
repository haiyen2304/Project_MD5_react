import React, { useEffect, useState } from "react";
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
import { FaFaceAngry } from "react-icons/fa6";
import { HiMiniGif, HiPaperAirplane } from "react-icons/hi2";
import baseUrl from "../../../apis/instance";
import { message, Modal } from "antd";
import RenderImages from "./RenderImages";
import { CloseOutlined, MoreOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { eachRight } from "lodash";
import { FiMoreHorizontal } from "react-icons/fi";
import { CiFaceSmile } from "react-icons/ci";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { use } from "react";
import ParentComment from "../comments/ParentComment";
import RenderCurrentPost from "./RenderCurrentPost";
// import PhotoGallery from "./PhotoGallery";
export default function RenderPostInProfile({
  onFetchData,
  posts,
  currentUserId,
}) {
  const [currentPost, setCurrentPost] = useState(); // Bài viết hiện tại
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý modal
  const [showCommentBox, setShowCommentBox] = useState(false); // State điều khiển hiển thị hộp bình luận
  const [showLikeIcons, setShowLikeIcons] = useState(false); // State quản lý hiển thị các biểu tượng thích
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [showMenuPostId, setShowMenuPostId] = useState(null); // Quản lý menu xóa
  const [postList, setPostList] = useState(posts);
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [showModalReportPost, setShowModalReportPost] = useState(false);
  const [postId, setPostId] = useState();
  const [userReactions, setUserReactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [reportPostId, setReportPostId] = useState();
  const [userReactionModal, setUserReactionModal] = useState(null);
  const [comments, setComments] = useState([]); // Danh sách bình luận cha
  const [comment, setComment] = useState([]);

  console.log("danh sách posts : ", posts);

  useEffect(() => {
    setPostList(posts);
  }, [posts]);

  // hiển thị tương tác bài viết
  useEffect(() => {
    baseUrl
      .get("/user/reactionPost/status")
      .then((response) => {
        const userReactions = response.data.map((reaction) => ({
          postId: reaction.post.id,
          iconId: reaction.icon.id,
        }));

        setUserReactions(userReactions); // Lưu vào state
      })
      .catch((error) => {
        console.error("Error fetching reactions count:", error);
      });

    postList.forEach((post) => {
      // Gọi API để lấy số lượng reactions cho từng bài viết

      baseUrl.get(`/user/reactionPost/count/${post.id}`).then((response) => {
        setReactionCounts((prevCounts) => ({
          ...prevCounts,
          [post.id]: response.data,
        }));
      });
      // Gọi API lấy danh sách bài viết người dùng đã thả cảm xúc
    });
  }, [posts, refresh]);

  const sendReactionToPost = async (postId, iconId) => {
    try {
      const reactionData = {
        postId: postId,
        iconId: iconId, // iconId từ 1 đến 5
      };

      // Gửi reaction
      const postResponse = await baseUrl.post(
        "user/reactionPost",
        reactionData
      );

      // Cập nhật số lượng reaction
      const countResponse = await baseUrl.get(
        `/user/reactionPost/count/${postId}`
      );

      setReactionCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: countResponse.data,
      }));

      // Cập nhật bài viết hiện tại
      // const postDetailResponse = await baseUrl.get(`/user/posts/${postId}`);
      // setCurrentPost(postDetailResponse.data);

      // Cập nhật lại reaction trên modal
      setUserReactionModal(reactionData);

      // Cập nhật trạng thái refresh
      setRefresh((prevRefresh) => !prevRefresh);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  // cái call api reaction api ở đâu đấy

  const handleIconClick = (postId, iconId) => {
    setSelectedIconId(iconId);

    const userReaction = userReactions.some(
      (reaction) => reaction.postId == postId
    );

    if (userReaction) {
      // Nếu đã thích, xóa reaction
      handleDeleteReaction(postId);
    } else {
      // Nếu chưa thích, thêm reaction
      sendReactionToPost(postId, iconId);
    }
  };
  // Toggle hiển thị các biểu tượng like khi hover vào nút like
  const handleLikeHover = (postId) => {
    setPostId(postId);
    setShowLikeIcons(true);
  };

  const handleLikeLeave = () => {
    setShowLikeIcons(false);
  };

  // Tự động thay đổi chiều cao của textarea khi người dùng nhập
  const handleInputResize = (e) => {
    const textarea = e.target;
    e.target.style.height = "auto"; // Đặt lại chiều cao về auto để tính lại chiều cao
    textarea.style.height = `${textarea.scrollHeight + 4}px`;
  };

  const handleDeletePost = (postId) => {
    baseUrl
      .delete(`/user/posts/${postId}`) // API xóa bài viếts
      .then(() => {
        message.success("Bài viết đã được xóa!");
        // Cập nhật postList bằng cách loại bỏ bài viết bị xóa
        // setPostList((prevPostList) =>
        //   prevPostList.filter((post) => post.id !== postId)
        // );

        onFetchData();

        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        message.error("Không thể xóa bài viết!");
      });
  };

  const handleMenuClick = (postId) => {
    console.log("currentUserId", currentUserId);
    console.log("PostId", postId);
    if (showMenuPostId === postId) {
      setShowMenuPostId(null); // Ẩn menu nếu đã hiển thị
    } else {
      setShowMenuPostId(postId); // Hiển thị menu
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".menu-container")) {
      setShowMenuPostId(null); // Ẩn menu nếu nhấn ra ngoài
    }
  };

  // Ẩn menu khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setShowMenuPostId(null); // Ẩn menu
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Hàm gọi API để ẩn bài viết by hùng
  const handleHiddenPost = async (postId) => {
    try {
      // Gọi API ẩn bài viết
      await baseUrl.post(`user/hiddenPost/${postId}`);

      // Cập nhật lại danh sách bài viết sau khi ẩn
      setPostList((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi ẩn bài viết:", error);
    }
  };

  const handleShowModalReportPost = (postId) => {
    setReportPostId(postId);
    setShowModalReportPost(true);
  };

  // Hàm gọi API báo cáo bài viết by hùng
  const handleReportPost = async (postId) => {
    // Gửi yêu cầu API nếu muốn (dữ liệu báo cáo)
    if (!reportReason) {
      message.error("report thất bại!");
      return;
    }
    const reportData = {
      postId: postId,
      reason: reportReason,
    };
    await baseUrl
      .post("user/reportPost", reportData)
      .then(() => {
        // Xử lý sau khi gửi báo cáo thành công
        message.success("Đã report bài viết!");
        setShowModalReportPost(false);
        setReportReason("");
        setReportPostId(null);
        // Gọi API ẩn bài viết
        baseUrl.post(`user/hiddenPost/${postId}`);

        // Cập nhật lại danh sách bài viết sau khi ẩn
        setPostList((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Lỗi khi báo cáo bài viết:", error);
      });
  };

  const handleReportReasonText = (event) => {
    setReportReason(event.target.value);
  };

  const handleCloseReportModal = () => {
    setReportReason("");
    setShowModalReportPost(false);
  };
  // Hàm xóa reaction
  const handleDeleteReaction = async (postId) => {
    console.log("deletePostId", postId);
    try {
      // Gửi yêu cầu DELETE để xóa phản ứng
      const response = await baseUrl.delete(`user/reactionPost/${postId}`);
      console.log("Xóa phản ứng thành công", response);

      // Cập nhật lại userReactions sau khi xóa
      setUserReactions((prevReactions) =>
        prevReactions.filter((id) => id !== postId)
      );

      baseUrl
        .get(`/user/reactionPost/count/${postId}`)
        .then((response) => {
          setReactionCounts((prevCounts) => ({
            ...prevCounts,
            [postId]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching updated reactions count:", error);
        });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Lỗi khi xóa phản ứng:", error);
    }
  };

  // Toggle hiển thị hộp bình luận
  const handleCommentToggle = () => {
    setShowCommentBox(!showCommentBox);
    setIsVisible(!isVisible);
  };

  //------------ Tải danh sách bình luận cha----------
  const fetchComments = async (postId) => {
    try {
      const response = await baseUrl.get(`/user/comments/parents/${postId}`);
      setComments(response.data); // Lưu danh sách bình luận vào state
      console.log(comment);
    } catch (error) {
      console.log("Lỗi khi tải bình luận:", error);
      message.error("Không thể tải bình luận.");
    }
  };

  //---------- Hiển thị modal bài viết----------
  const showModal = (post, userReaction) => {
    setCurrentPost(post);
    setIsModalOpen(true);
    setUserReactionModal(userReaction);
    fetchComments(post.id); // Tải danh sách bình luận cha
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  return (
    <div className="space-y-4">
      <Modal
        open={showModalReportPost}
        onCancel={handleCloseReportModal}
        onOk={() => handleReportPost(reportPostId)}
      >
        <div className="flex flex-col">
          <label htmlFor="">Báo cáo</label>
          <textarea
            name=""
            id=""
            placeholder="nhập nội dung báo cáo!"
            className="resize-none"
            onChange={handleReportReasonText}
            value={reportReason}
          ></textarea>
        </div>
      </Modal>
      {/* ----------------------------------------HẢI YE------------------------------------------------------- */}
      {postList.map((post) => {
        const { text, icon } = getPostPrivacyText(post.privacy); // Lấy text và icon cho mỗi bài viết
        const userReaction = userReactions.find(
          (reaction) => reaction.postId === post.id
        );
        return (
          <>
            <div
              onClick={() => {
                showModal(post, userReaction); // Mở modal và chọn bài viết
                fetchComments(post.id); // Tải bình luận cho bài viết
              }}
              key={post.id}
              className="bg-white px-4 py-1 h-auto rounded-lg shadow-md dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 hover:cursor-pointer"
            >
              {/* User Info */}
              <div className="mt-3 flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img
                    src={post.avatarUrl} // Ảnh đại diện người dùng
                    className="rounded-full w-full h-full"
                    // Tên người dùngalt={post.userName}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-5">
                    <p className="font-semibold text-gray-900 dark:text-gray-200">
                      {post.userName} {/* Tên đầy đủ của người đăng */}
                    </p>
                    {/* ID người đăng */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {icon} {/* Hiển thị icon */}
                      {text} {/* Hiển thị trạng thái */}
                    </p>
                  </div>
                  {/* Danh sách người được tag */}
                  {post.taggedUsers?.length > 0 && (
                    <p className="text-sm text-gray-800 dark:text-gray-400">
                      Được gắn thẻ:{" "}
                      {post.taggedUsers
                        .map((user) => user.name) // Lấy ra tên của mỗi người dùng được tag
                        .join(", ")}{" "}
                      {/* Gộp danh sách tên thành một chuỗi, cách nhau bởi dấu phẩy */}
                    </p>
                  )}
                </div>
              </div>
              {/* Post Content */}
              <div className="mt-3 mb-3 text-gray-800 dark:text-gray-300 ">
                <p>{post?.content}</p> {/* Nội dung bài viết */}
              </div>

              {/* Post Images */}

              {post?.images.length > 0 && (
                <RenderImages images={post?.images}></RenderImages>
              )}

              {/* Reaction and Stats */}
              <div className="mb-3 mt-3 flex justify-between text-sm text-gray-500 ">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <span className="ml-1">
                      {reactionCounts[post.id]} thích
                    </span>
                  </div>
                </div>
                {console.log("commentCount:  == ", post.commentCount)}
                <div className="flex space-x-6 text-[15px]">
                  <p>{post.commentCount} bình luận</p>
                  <p>{post.shareCount || 0} chia sẻ</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="relative mb-3 mt-3 flex justify-around items-center gap-10 text-[16px] border-t-2 py-1">
                {userReactions.find(
                  (reaction) => reaction.postId === post.id
                ) ? (
                  <button
                    onMouseEnter={() => handleLikeHover(post.id)}
                    onMouseLeave={handleLikeLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIconClick(post.id, 1);
                    }}
                    className="text-blue-500 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2"
                  >
                    {userReaction.iconId === 1 && (
                      <div className="flex items-center text-blue-500 gap-1">
                        <AiOutlineLike />
                        Thích
                      </div>
                    )}

                    {userReaction.iconId === 2 && (
                      <div className="flex items-center text-pink-500 gap-1">
                        <FaHeart className="" />
                        Yêu thích
                      </div>
                    )}
                    {userReaction.iconId === 3 && (
                      <div className="flex items-center text-yellow-500 gap-1">
                        <FaSmile className="" />
                        Haha
                      </div>
                    )}
                    {userReaction.iconId === 4 && (
                      <div className="flex items-center text-yellow-500 gap-1">
                        <FaSadTear className="" />
                        Buồn
                      </div>
                    )}
                    {userReaction.iconId === 5 && (
                      <div className="flex items-center text-orange-400 gap-1">
                        <FaFaceAngry className="" />
                        phẫn lộ
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onMouseEnter={() => handleLikeHover(post.id)}
                    onMouseLeave={handleLikeLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIconClick(post.id, 1);
                    }}
                    className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2"
                  >
                    <AiOutlineLike />
                    Thích
                  </button>
                )}

                {showLikeIcons && postId == post.id && (
                  <div
                    onMouseEnter={() => handleLikeHover(post.id)}
                    onMouseLeave={handleLikeLeave}
                    style={{ opacity: showLikeIcons ? 1 : 0 }}
                    className="absolute mt-2 left-0 -top-10 space-x-2 flex items-center bg-white border rounded-lg shadow-lg px-3 py-2 transition-opacity duration-1000"
                  >
                    <AiOutlineLike
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReactionToPost(post.id, 1);
                      }}
                      className="text-blue-500 text-xl cursor-pointer"
                    />
                    <FaHeart
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReactionToPost(post.id, 2);
                      }}
                      className="text-red-400 text-xl cursor-pointer"
                    />
                    <FaSmile
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReactionToPost(post.id, 3);
                      }}
                      className="text-yellow-500 text-xl cursor-pointer"
                    />
                    <FaSadTear
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReactionToPost(post.id, 4);
                      }}
                      className="text-blue-500 text-xl cursor-pointer"
                    />
                    <FaFaceAngry
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReactionToPost(post.id, 5);
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
                  Bình luận
                </button>
                <button className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-200 rounded-md px-2">
                  <FaShare />
                  Chia sẻ
                </button>
              </div>
              {/* Action Buttons */}
            </div>
            {/* Comment Box */}
          </>
        );
      })}

      <Modal
        closeIcon={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <RenderCurrentPost
          currentPost={currentPost}
          showMenuPostId={showMenuPostId}
          userReactions={userReactions}
          userReactionModal={userReactionModal}
          showLikeIcons
          handleLikeHover={handleLikeHover}
          postId={postId}
          handleCommentToggle={handleCommentToggle}
          handleInputResize={handleInputResize}
          ParentComment={ParentComment}
          handleMenuClick={handleMenuClick}
          currentUserId={currentUserId}
          handleDeletePost={handleDeletePost}
          sendReactionToPost={sendReactionToPost}
          handleHiddenPost={handleHiddenPost}
          handleShowModalReportPost={handleShowModalReportPost}
          comment={comment}
          setComment={setComment}
          fetchComments={fetchComments}
          comments={comments}
          handleIconClick={handleIconClick}
        ></RenderCurrentPost>
      </Modal>
    </div>
  );
}
