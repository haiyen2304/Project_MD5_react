import { Button, Dropdown, Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import myImage from "../../../assets/avartaMeo.jpg";
import { FaHouse } from "react-icons/fa6";
import { FaEllipsisH, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../../../apis/instance";
import { message } from "antd";
import {
  AiOutlineEdit,
  AiOutlineStar,
  AiOutlineStop,
  AiOutlineUserDelete,
} from "react-icons/ai";
import UserEditModal from "./UserEditModal";
import ProfileEdit from "./ProfileEdit";

export default function ProfileHeader({
  UserInfo,
  userData,
  isOwnProfile,
  userId,
  currentUserId,
  friendStatus,
  updateFriendStatus,
}) {
  const [postsView, setPostsView] = useState("listView");
  const [isShowModal, setIsShowModal] = useState(false);
  const navigate = useNavigate(); // Dùng để chuyển trang nhắn tin
  const [reportBtn, setReportBtn] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [showEditData, setShowEditData] = useState(false);
  const API_ENDPOINTS = {
    cancelRequest: `user/friends/cancel-request/${userId}`,
    acceptRequest: `user/friends/accept-request/${userId}`,
    declineRequest: `user/friends/decline-request/${userId}`,
    sendRequest: `user/friends/send-request/${userId}`,
    block: `user/friends/block/${userId}`,
  };

  useEffect(() => {
    console.log("userInfodata haha", UserInfo);
  });

  //===============================
  const handleShowModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };
  // ----------------Chuyển đến trang chủ----------------
  const handleGoToHomeNews = () => {
    navigate("/");
  };

  // ----------------Chuyển đến trang nhắn tin----------------
  const handleGoToMessages = () => {
    navigate(`/messages/${userId}`);
  };
  //---------------- Hủy lời mời kết bạn----------------đã check
  const handleCancelRequest = async () => {
    try {
      await baseUrl.delete(API_ENDPOINTS.cancelRequest);
      updateFriendStatus(0); // Cập nhật trạng thái về mặc định (không có quan hệ)
      message.success("Đã hủy lời mời kết bạn.");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi hủy lời mời kết bạn.");
    }
  };
  //---------------- Xác nhận lời mời kết bạn----------------đã check
  const handleAcceptRequest = async () => {
    try {
      await baseUrl.post(API_ENDPOINTS.acceptRequest);
      updateFriendStatus(3); // Cập nhật trạng thái thành bạn bè
      message.success("Đã chấp nhận lời mời kết bạn.");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi xác nhận lời mời.");
    }
  };

  //---------------- từ chối lời mời kết bạn----------------đã check
  const handleDeleteRequest = async () => {
    try {
      await baseUrl.delete(API_ENDPOINTS.declineRequest);
      updateFriendStatus(0); // Cập nhật trạng thái về mặc định
      message.success("Đã xóa lời mời kết bạn.");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi xóa lời mời.");
    }
  };

  //---------------- Gửi lời mời kết bạn----------------đã check
  const handleAddFriend = async () => {
    try {
      await baseUrl.post(API_ENDPOINTS.sendRequest);
      updateFriendStatus(1); // Cập nhật trạng thái đã gửi lời mời
      message.success("Đã gửi lời mời kết bạn.");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi gửi lời mời kết bạn.");
    }
  };
  //------------------------------------------------
  const handleMenuClick = async (e) => {
    if (e.key === "unfriend") {
      //-------- chưa làm--------
      try {
        await baseUrl.delete(`/user/friends/unfriend/${userId}`);
        message.success("Đã hủy kết bạn!");
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi hủy kết bạn!");
      }
    } else if (e.key === "block") {
      try {
        await baseUrl.post(API_ENDPOINTS.block);
        message.success("Đã chặn người dùng!");
        handleGoToHomeNews();
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi chặn người dùng!");
      }
    } else if (e.key === "unfollow") {
      //---- chưa làm-----
      try {
        await baseUrl.post(`/user/unfollow/${userId}`);
        message.success("Đã bỏ theo dõi!");
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi bỏ theo dõi!");
      }
    } else if (e.key === "favorite") {
      //-------- chưa làm--------
      message.success("Đã thêm vào danh sách yêu thích!");
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item disabled key="favorite" icon={<AiOutlineStar />}>
        Yêu thích
      </Menu.Item>
      <Menu.Item disabled key="editList" icon={<AiOutlineEdit />}>
        Chỉnh sửa danh sách bạn bè
      </Menu.Item>
      <Menu.Item disabled key="unfollow" icon={<AiOutlineStop />}>
        Bỏ theo dõi
      </Menu.Item>
      <Menu.Item disabled key="unfriend" icon={<AiOutlineUserDelete />}>
        Hủy kết bạn
      </Menu.Item>
      <Menu.Item key="block" icon={<AiOutlineStop />} danger>
        Chặn người dùng
      </Menu.Item>
    </Menu>
  );

  const handleShowReportUserBtn = () => {
    console.log("currentUserId", currentUserId);
    setReportBtn((prev) => !prev);
  };

  // Ẩn menu khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".report-menu")) {
        setReportBtn(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleReportReasonText = (event) => {
    setReportReason(event.target.value);
  };

  const handleCloseReportModal = () => {
    setReportReason("");
    setShowReportModal(false);
  };

  const handleReportUser = async (userId) => {
    if (reportReason === "") {
      alert("hãy nhập nội dung báo cáo!");
      return;
    }
    const reportData = {
      userId: userId,
      reason: reportReason,
    };
    await baseUrl
      .post("user/reportUser", reportData)
      .then(() => {
        // Xử lý sau khi gửi báo cáo thành công
        message.success("Đã report người dùng!");
        setReportReason("");
        setShowReportModal(false);
      })
      .catch((error) => {
        console.error("Lỗi khi báo cáo bài viết:", error);
      });
  };

  const handleEditUsesrData = () => {
    setShowEditData((prev) => !prev);
  };
  return (
    <>
      <Modal
        className="font-semibold !w-[700px]"
        title={"Chỉnh sửa trang cá nhân"}
        open={isShowModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <UserEditModal
          currentUserId={currentUserId}
          UserInfo={UserInfo}
        ></UserEditModal>
      </Modal>

      <div className="h-auto w-full bg-white shadow dark:bg-neutral-800">
        {/* phần đầu */}
        <div className="mx-auto h-full max-w-6xl rounded-md bg-white dark:bg-neutral-800">
          {/* ảnh bìa */}
          <div
            className="relative h-[28.75rem] max-h-[28.75rem] w-full rounded-lg"
            style={{
              backgroundImage: `url('https://random.imagecdn.app/1920/1080')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* nút edit ảnh bìa */}
            <div
              className="absolute flex w-full items-center justify-center"
              style={{ bottom: "-15px" }}
            >
              <div className="absolute bottom-[30px] right-[30px]">
                {isOwnProfile ? (
                  <>
                    <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 focus:outline-none">
                      <i className="fas fa-camera mr-2"></i>Edit Cover Photo
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto h-full px-10">
            {/* avarta + tên người dùng */}
            <div className=" flex items-end gap-5 border-b pb-5 dark:border-stone-700">
              {/* avarta */}
              <div className="z-10 -mt-8 h-[8rem] w-[8rem] sm:h-[9rem] sm:w-[9rem] md:h-[10rem] md:w-[10rem] lg:h-[10.25rem] lg:w-[10.25rem]">
                <img
                  className="h-full w-full rounded-full border-4 border-primary"
                  src={UserInfo?.avatar}
                  alt="dp"
                />
              </div>
              {/* tên người dùnng */}
              <div className="flex-1 flex-col pb-2">
                <p className="text-[2rem] font-bold text-black dark:text-gray-200">
                  {userData?.firstName + " " + userData?.lastName}
                </p>
                <a className="cursor-pointer text-sm font-semibold text-gray-600 hover:underline dark:text-gray-300">
                  528 friends
                </a>

                <div className="flex w-full items-center justify-between">
                  {/*Start ảnh những người bạn đã kết bạn */}
                  <div className="mt-2 flex items-center">
                    {/* Ảnh đầu tiên luôn hiển thị */}
                    <img
                      className="cursor-pointer rounded-full border-2 border-white dark:border-neutral-600"
                      alt="friend"
                      src="https://random.imagecdn.app/32/32"
                    />
                    {/* Ẩn ảnh này trên màn hình nhỏ hơn sm */}
                    <img
                      className="-translate-x-2 cursor-pointer rounded-full border-2 border-white dark:border-neutral-600 hidden sm:inline"
                      alt="friend"
                      src="https://random.imagecdn.app/32/32"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {/*Start phần thêm bạn bè chỉnh sửa info dành cho trang người dùng */}
                    {isOwnProfile ? (
                      <>
                        <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none">
                          <i className="fas fa-plus-circle mr-2"></i>Add to
                          Story
                        </button>
                        <button
                          onClick={handleShowModal}
                          className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                        >
                          <i className="fas fa-pen mr-2"></i>Edit Profile
                        </button>
                        <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <>
                          {/* Khi trạng thái là "1" (Người dùng hiện tại đã gửi lời mời) */}
                          {friendStatus === 1 && (
                            <>
                              <button
                                onClick={handleCancelRequest}
                                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                              >
                                <i className="fas fa-user-times mr-2"></i>Hủy
                                lời mời
                                {/* khi ấn xong gọi API đổi thành =>Thêm bạn bè  */}
                              </button>
                              <button
                                onClick={handleGoToMessages}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                              >
                                <i className="fas fa-comment-dots mr-2"></i>Nhắn
                                tin
                              </button>
                            </>
                          )}
                          {/* Khi trạng thái là "2" (Người khác gửi lời mời) */}
                          {friendStatus === 2 && (
                            <>
                              <button
                                onClick={handleAcceptRequest}
                                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                              >
                                <i className="fas fa-user-check mr-2"></i>Xác
                                nhận
                              </button>
                              <button
                                onClick={handleDeleteRequest}
                                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                              >
                                <i className="fas fa-user-times mr-2"></i>từ
                                chối lời mời
                              </button>
                              <button
                                onClick={handleGoToMessages}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                              >
                                <i className="fas fa-comment-dots mr-2"></i>Nhắn
                                tin
                              </button>
                            </>
                          )}
                          {/* Khi trạng thái là "3" (Hai người là bạn bè) */}
                          {friendStatus === 3 && (
                            <>
                              <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600">
                                <i className="fas fa-user-check mr-2"></i>Bạn bè
                              </button>
                              <button
                                onClick={handleGoToMessages}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                              >
                                <i className="fas fa-comment-dots mr-2"></i>Nhắn
                                tin
                              </button>
                            </>
                          )}

                          {/* Khi không có mối quan hệ */}
                          {/* Khi trạng thái là "4" (Đã từ chối) */}
                          {(friendStatus === 0 || friendStatus === 4) && (
                            <>
                              <button
                                onClick={handleAddFriend}
                                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                              >
                                <i className="fas fa-user-plus mr-2"></i>Thêm
                                bạn bè
                              </button>
                              <button
                                onClick={handleGoToMessages}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                              >
                                <i className="fas fa-comment-dots mr-2"></i>Nhắn
                                tin
                              </button>
                            </>
                          )}
                        </>
                        <Dropdown overlay={menu} trigger={["click"]}>
                          <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600">
                            <FaEllipsisH />
                          </button>
                        </Dropdown>
                      </>
                    )}

                    {/*Start phần thêm bạn bè chỉnh sửa info dành cho trang người lạ */}
                  </div>

                  {/*End phần thêm bạn bè chỉnh sửa info */}
                </div>
                {/*End ảnh những người bạn đã kết bạn */}
              </div>
            </div>
            {/*Start Posts About Friends Photos Story Archrive Videos ========*/}
            <div className="mt-1 flex items-center justify-between relative">
              <div className="mb-2 flex items-center space-x-2">
                <button className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                  Posts
                </button>

                <button
                  onClick={handleEditUsesrData}
                  className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700"
                >
                  About
                </button>

                <button className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                  Friends
                </button>
                <button className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                  Photos
                </button>
                <button className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                  Story Archrive
                </button>
                <button className="rounded-md px-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-neutral-700">
                  Videos
                </button>
              </div>
              <button
                onClick={handleShowReportUserBtn}
                className="rounded-md report-menu bg-gray-100 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
              >
                <i className="fas fa-ellipsis-h"></i>
              </button>
              {currentUserId != userId && reportBtn && (
                <div className="absolute  right-0 top-10 bg-white border shadow-lg rounded-lg w-40 py-2 z-10">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Báo cáo người dùng
                  </button>
                </div>
              )}
            </div>
            <Modal
              open={showReportModal}
              onCancel={handleCloseReportModal}
              onOk={() => handleReportUser(userId)}
            >
              <div className="flex flex-col">
                <label htmlFor="">Báo cáo</label>
                <textarea
                  name=""
                  id=""
                  value={reportReason}
                  placeholder="nhập nội dung báo cáo!"
                  className="resize-none"
                  onChange={handleReportReasonText}
                ></textarea>
              </div>
            </Modal>
            {showEditData && <ProfileEdit userId={userId}></ProfileEdit>}
            {/*End Posts About Friends Photos Story Archrive Videos ========*/}
          </div>
        </div>
      </div>
    </>
  );
}
