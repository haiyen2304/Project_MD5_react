import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
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
import { Link } from "react-router-dom";
import baseUrl from "../../../apis/instance";
import GroupList from "./GroupList";
import GroupBlogList from "./GroupBlogPost";

export default function GroupsBlog() {
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu ID người dùng hiện tại
  const [groupBlogs, setGroupBlogs] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId); // Lưu ID vào state
    } else {
      message.error("Không tìm thấy userId trong localStorage.");
    }
    console.log(currentUserId);
  }, []);

  useEffect(() => {
    if (currentUserId) {
      console.log("nguoi dung hien tai", currentUserId);
      fetchGroupPost(); // Chỉ gọi khi currentUserId đã được cập nhật
    }
  }, [currentUserId]);

  const fetchGroupPost = async () => {
    try {
      const groupPostResponese = await baseUrl.get(
        `user/groupPost/blog/${currentUserId}`
      );
      setGroupBlogs(groupPostResponese.data);
      console.log(groupPostResponese.data);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu người dùng.");
    }
  };

  return (
    <>
      <div className="flex h-auto font-semibold ">
        <div className="w-1/4 #ffffff px-4 py-2 flex flex-col  bg-white">
          <GroupList></GroupList>
        </div>
        <div className="w-3/4 #ffffff px-4 py-2 flex flex-col mt-5">
          <GroupBlogList
            groupBlogs={groupBlogs}
            currentUserId={currentUserId}
          ></GroupBlogList>
        </div>
      </div>
    </>
  );
}
