import React from "react";
import { IoMdSettings } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { PiUserListFill } from "react-icons/pi";
import { MdArrowForwardIos } from "react-icons/md";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";
import { Link } from "react-router-dom";

export default function Friends() {
  return (
    //yến làm phần này
    <>
      <div className="w-3/4 flex flex-col bg-gray-100 mt-10">
        <div className="p-8  flex justify-between">
          <h1 className="text-[20px]">Lời mời kết bạn</h1>
          <a href="">xem tất cả</a>
        </div>

        <ul className="px-8 flex flex-wrap gap-6 h-auto">
          <li className="flex flex-col items-center bg-white rounded-lg shadow-md border  flex-[0_0_calc(25%-1.2rem)]">
            <img
              src={myImage}
              alt="Avatar"
              className="rounded-t w-full h-[200px] object-cover mb-1"
            />
            <div className="flex flex-col items-center  w-full">
              <p className="f text-gray-800 mb-1 font-bold">Hà Vy</p>
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <img
                  src="avatar-small.png"
                  alt="Mutual Friend"
                  className="w-5 h-5 rounded-full mr-2"
                />
                27 bạn chung
              </p>
              <div className="mb-3 ml-6 mr-6 flex flex-col gap-2 w-full">
                <button className="mx-3 py-2 text-sm font-medium bg-[#4568f5] text-white rounded-md hover:bg-blue-700">
                  Xác nhận
                </button>
                <button className="mx-3 py-2 text-sm font-medium bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Xóa
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
