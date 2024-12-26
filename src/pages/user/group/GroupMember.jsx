import React, { useEffect, useState } from "react";
import GroundHeader from "./GroupHeader";
import { FaSearch } from "react-icons/fa";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";
import baseUrl from "../../../apis/instance";
import { MdOutlineMoreHoriz } from "react-icons/md";

export default function GroupdMember({
  countMember,
  groupId,
  currentUserId,
  headerSetRefresh,
}) {
  const [groupManagerMember, setGroupManagerMember] = useState([]); // Danh sách quản trị viên
  const [groupMember, setGroupMember] = useState([]); // danh sách thành vuên
  const [userData, setUserData] = useState();
  const [showMenuByUserId, setShowMenuByUserId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const fetchManagerMember = async () => {
    try {
      // Fetch danh sách quản trị viên
      const manage = await baseUrl.get(
        `user/groupDetail/managerMember/${groupId}`
      );
      setGroupManagerMember(manage.data);
      // Fetch danh sách thành viên
      const member = await baseUrl.get(`user/groupDetail/member/${groupId}`);
      setGroupMember(member.data);
      // Gửi yêu cầu API userRole để lấy thông tin role của người dùng
      const requestData = {
        userId: currentUserId,
        groupId: groupId,
      };
      const user = await baseUrl.put("user/groupDetail/member", requestData);
      // Đồng bộ hóa dữ liệu user trước khi cập nhật
      // const userDataFetched = user.data;
      setUserData(user.data); // Cập nhật state userData sau khi fetch thành công
    } catch (error) {
      console.error("Error fetching group manager member", error);
    }
  };
  useEffect(() => {
    fetchManagerMember();
  }, [groupId, refresh]);

  const handleMenuClick = (userId) => {
    console.log("showMenuByUserId", showMenuByUserId);
    console.log("userId", userId);
    if (showMenuByUserId === userId) {
      setShowMenuByUserId(null); // Ẩn menu khi đã chọn
    } else {
      setShowMenuByUserId(userId); // Hiển thị menu cho thành viên được chọn
    }
  };
  // Ẩn menu khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setShowMenuByUserId(null); // Ẩn menu
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDeleteMember = async (userId) => {
    const requestData = {
      memberId: userId,
      groupId: groupId,
    };
    try {
      const deleteMember = await baseUrl.post(
        "user/groupDetail/leave",
        requestData
      );
      console.log("Member deleted successfully", deleteMember);
      setRefresh(!refresh);
      headerSetRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleChangeRoleMember = async (userId, role) => {
    const requestData = {
      targetMemberId: userId,
      groupId: groupId,
      role: role,
    };
    try {
      const changeRole = await baseUrl.post(
        "user/groupDetail/changeRole",
        requestData
      );
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 w-full  flex justify-center pt-5  font-semibold">
        {/* Thẻ cha có chiều cao `h-screen` và căn giữa nội dung */}
        <div className="bg-white rounded-md w-[90%]  ">
          {/* Thẻ con chiếm 1/2 chiều cao và căn giữa */}
          <div className="m-5 border-b-2 pb-4">
            <p className="text-[14px]">
              thành viên <span className="text-gray-400">{countMember}</span>
            </p>
            <p className="text-gray-400 text-[14px]">
              Người và Trang mới tham gia nhóm này sẽ hiển thị tại đây.
            </p>
            <div className="relative mt-4">
              {/* Search Input */}
              <input
                type="search"
                placeholder="メンバー検索"
                className="w-full px-10 py-1 border border-gray-300 rounded-full"
              />
              {/* Search Icon */}
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex  flex-col mx-5 pb-4 border-b-2 justify-between">
            <div>
              <p>Quản trị viên và người kiểm duyệt</p>
            </div>
            {groupManagerMember.map((member, index) => (
              <div key={index}>
                <ul>
                  <li className="flex border-b-2 justify-between pb-4">
                    <div className="flex gap-3">
                      <div>
                        <img
                          src={myImage}
                          alt=""
                          height={50}
                          width={50}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        {currentUserId == member.member.id ? (
                          <h3 className="text-blue-500 text-sm">
                            {member.member.firstName + member.member.lastName}
                          </h3>
                        ) : (
                          <h3 className="text-custom-gray text-sm">
                            {member.member.firstName + member.member.lastName}
                          </h3>
                        )}

                        <p className="text-gray-500 text-[12px]">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <Button
                        onClick={() => handleMenuClick(member.member.id)}
                        className="border-none bg-gray-200 rounded-md menu-container"
                      >
                        <MdOutlineMoreHoriz />
                      </Button>

                      {currentUserId == member.member.id &&
                      showMenuByUserId === member.member.id ? (
                        <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-60 py-2 z-10">
                          <button
                            onClick={() => handleDeleteMember(member.member.id)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            rời khỏi nhóm
                          </button>
                        </div>
                      ) : (
                        userData?.role === "ADMINISTRATOR" &&
                        showMenuByUserId === member.member.id && (
                          <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-60 py-2 z-10">
                            <button
                              onClick={() =>
                                handleDeleteMember(member.member.id)
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              Xóa thành viên
                            </button>
                            <button
                              onClick={() =>
                                handleChangeRoleMember(
                                  member.member.id,
                                  "MEMBER"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              Phân Quyền Member
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <div className="flex  flex-col mx-5 pb-4 border-b-2 justify-between">
            <div>
              <p>Danh sách thành viên</p>
            </div>
            {groupMember.map((member, index) => (
              <div key={index}>
                <ul>
                  <li className="flex border-b-2 justify-between pb-4">
                    <div className="flex gap-3 ">
                      <div className="">
                        <img
                          src={myImage}
                          alt=""
                          height={50}
                          width={50}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        {currentUserId == member.member.id ? (
                          <h3 className="text-blue-500 text-sm">
                            {member.member.firstName + member.member.lastName}
                          </h3>
                        ) : (
                          <h3 className="text-custom-gray text-sm">
                            {member.member.firstName + member.member.lastName}
                          </h3>
                        )}
                        <p className="text-gray-500 text-[12px]">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <Button
                        onClick={() => handleMenuClick(member.member.id)}
                        className="border-none bg-gray-200 rounded-md menu-container"
                      >
                        <MdOutlineMoreHoriz />
                      </Button>
                      {currentUserId == member.member.id &&
                      showMenuByUserId === member.member.id ? (
                        <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-60 py-2 z-10">
                          <button
                            onClick={() => handleDeleteMember(member.member.id)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            rời khỏi nhóm
                          </button>
                        </div>
                      ) : (
                        (userData?.role === "ADMINISTRATOR" ||
                          userData?.role === "COLLABORATOR") &&
                        showMenuByUserId === member.member.id && (
                          <div className="absolute right-0 bg-white border shadow-lg rounded-lg w-60 py-2 z-10">
                            <button
                              onClick={() =>
                                handleDeleteMember(member.member.id)
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              Xóa thành viên
                            </button>
                            <button
                              onClick={() =>
                                handleChangeRoleMember(
                                  member.member.id,
                                  "COLLABORATOR"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              Phân Quyền COLLABORATOR
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
