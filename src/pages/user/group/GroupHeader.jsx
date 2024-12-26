import React, { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Button, message } from "antd";
import { FaSearch } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import myImage from "../../../assets/avartaMeo.jpg";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { BiSolidDownArrow } from "react-icons/bi";
import { LiaUserSecretSolid } from "react-icons/lia";
import { FaImages } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import Navbar from "../../../layouts/user/navbar/Navbar";
import GroupList from "./GroupList";
import { useParams } from "react-router-dom";
import baseUrl from "../../../apis/instance";
import GroupPostList from "./GroupPostList";
import CreatePostBox from "../../../components/user/createPostBox/CreatePostBox";
import CreateGroupPostBox from "../../../components/user/createPostBox/CreateGroupPostBox";
import { set } from "lodash";
import GroupdMember from "./GroupMember";

export default function GroundHeader() {
  const { groupId } = useParams(); // Lấy groupId từ URL
  const [currentGroupData, setCurrentGroupData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu ID người dùng hiện tại
  const [userData, setuserData] = useState(); // lấy dữ liệu người đùng
  const [refresh, setRefresh] = useState(false); // State để theo dõi thay đổi
  const [countMember, setCouMember] = useState();
  const [groupPost, setGroupPost] = useState([]);
  const [groupAction, setGroupAction] = useState("groupDiscussion");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId); // Lưu ID vào state
    } else {
      message.error("Không tìm thấy userId trong localStorage.");
    }

    if (currentUserId) {
      // Kiểm tra currentUserId đã được cập nhật chưa
      console.log("currentUserId", currentUserId);
      console.log("groupId", groupId);

      fetchGroupData();
      fetchGroupPost();
      fetchCurrentUser(currentUserId);
    }
  }, [groupId, refresh, currentUserId]);

  const fetchGroupData = async () => {
    try {
      const response = await baseUrl.get(`/user/groups/${groupId}`);
      setCurrentGroupData(response.data);

      const groupDetail = await baseUrl.get(
        `/user/groupDetail/countMember/${groupId}`
      );
      setCouMember(groupDetail.data);
    } catch (err) {
      setError(err.message || "Lỗi khi lấy dữ liệu nhóm");
    }
  };

  const fetchGroupPost = async () => {
    try {
      const groupPostResponese = await baseUrl.get(
        `/user/groupPost/${groupId}`
      );
      setGroupPost(groupPostResponese.data);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu người dùng.");
    }
  };

  const fetchCurrentUser = async (userId) => {
    const userIdAsNumber = +userId; // lấy id từ localStorage String thành number

    try {
      const requestData = {
        userId: userIdAsNumber,
        groupId: groupId,
      };
      const user = await baseUrl.post("user/groupDetail/find", requestData);

      setuserData(user.data); // Cập nhật state userRole
      console.log("thong tin nguoi dung hien tai", user.data);
    } catch {
      message.error("Lỗi khi lấy dữ liệu người dùng.");
    }
  };

  const handleJoinGroup = async () => {
    const userIdAsNumber = +currentUserId; // lấy id từ localStorage String thành number

    try {
      const requestData = {
        userId: userIdAsNumber,
        groupId: groupId,
      };
      const user = await baseUrl.post("user/groupDetail/join", requestData);
      setRefresh((prev) => !prev);
    } catch {
      message.error("Lỗi khi lấy dữ liệu người dùng.");
    }
  };

  const triggerRefresh = () => {
    setRefresh((prev) => !prev); // Thay đổi trạng thái để kích hoạt useEffect
  };

  return (
    <>
      <header className="h-screen">
        <div className="flex flex-col lg:flex-row h-full font-semibold">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-white px-4 py-2 flex flex-col h-full border-r-2">
            <GroupList></GroupList>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 bg-white px-4 py-2 flex flex-col">
            <div>
              <img
                src={myImage}
                alt=""
                className="w-full h-[200px] lg:h-[350px] object-cover rounded-b-md"
              />
            </div>
            <h1 className="text-[24px] lg:text-[30px] mt-3">
              {currentGroupData?.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <FaEarthAmericas className="text-[12px]" />
              </div>
              <div className="flex gap-2">
                <p className="text-[12px] text-gray-500">nhóm công khai</p>
                <p className="text-[12px] text-gray-500">
                  {countMember} thành viên
                </p>
              </div>
            </div>

            <div className="flex mt-3 justify-between border-b-2 pb-2 flex-wrap">
              <div className="flex mt-3 items-center">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    src={myImage}
                    alt=""
                    height={30}
                    width={30}
                    className="rounded-full border border-white -ml-1"
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2 lg:mt-0">
                <Button className="text-[12px] bg-blue-500 text-white">
                  + Mời
                </Button>
                <Button className="text-[12px] bg-gray-300 flex items-center">
                  <FaShare className="mr-1" />
                  chia sẻ
                </Button>

                {userData ? (
                  <Button className="text-[12px] bg-gray-300 flex items-center">
                    Đã tham gia
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinGroup}
                    className="text-[12px] bg-gray-300 flex items-center"
                  >
                    Tham gia
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-5">
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "giới thiệu", action: "groupIntroduction" },
                  { text: "thảo luận", action: "groupDiscussion" },
                  { text: "đáng chú ý", action: "groupHighlights" },
                  { text: "mọi người", action: "groupMember" },
                  { text: "sự kiện", action: "groupEvents" },
                  { text: "File phương tiện", action: "groupMedia" },
                  { text: "File", action: "groupFiles" },
                ].map(({ text, action }) => (
                  <button
                    key={text}
                    className={`text-[14px] hover:bg-gray-200 p-1 rounded-md ${
                      groupAction === action ? "bg-gray-300" : ""
                    }`}
                    onClick={() => setGroupAction(action)}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full flex gap-3">
              <div className="w-2/3 ">
                {groupAction === "groupDiscussion" ? (
                  <div className="my-5 flex flex-col gap-3">
                    {userData && (
                      <CreateGroupPostBox
                        onPostCreated={triggerRefresh}
                        userData={userData}
                        groupId={groupId}
                      />
                    )}

                    <GroupPostList
                      currentUserId={currentUserId}
                      groupId={groupId}
                      groupPost={groupPost}
                    />
                  </div>
                ) : (
                  groupAction === "groupMember" && (
                    <GroupdMember
                      headerSetRefresh={setRefresh}
                      countMember={countMember}
                      groupId={groupId}
                      currentUserId={currentUserId}
                    ></GroupdMember>
                  )
                )}
              </div>

              <div className="w-1/3">
                <div className=" bg-white p-4 rounded-lg shadow-md  flex flex-col gap-4">
                  <h3 className="font-semibold text-gray-700">Giới Thiệu</h3>
                  <p>Cộng đồng {currentGroupData?.title}</p>
                  <div className="flex  gap-3 items-center">
                    <FaEarthAmericas />
                    <p>{currentGroupData?.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
