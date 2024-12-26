import React from "react";
import { IoMdSettings } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { PiUserListFill } from "react-icons/pi";
import { MdArrowForwardIos } from "react-icons/md";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function MainFriend() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex min-h-screen font-semibold h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className=" bg-white relative w-1/4 flex flex-col border-r-2 border-gray-300 shadow-full h-auto">
          {/* Header */}
          <div className="sticky top-[60px] bg-white">
            <header className=" flex justify-between p-3">
              <h1 className="text-[20px]">Bạn bè</h1>
              <IoMdSettings className="text-[20px]" />
            </header>

            {/* Menu Items */}
            <nav className="">
              {/* Trang Chủ */}
              <NavLink
                end
                to="/friends"
                className=" flex justify-between p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FaUserFriends className="icon-navlink text-[20px] bg-[#4568f5] w-8 h-8 flex items-center justify-center rounded-full p-2 text-white" />
                  <p className="hidden lg:block md:block">Trang Chủ</p>
                </div>
                <div className="hidden items-center md:flex lg:flex">
                  <MdArrowForwardIos />
                </div>
              </NavLink>

              {/* Lời mời kết bạn */}
              <NavLink
                to="/friends/sender"
                className="flex justify-between p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <IoMdPersonAdd className="icon-navlink text-[20px] bg-gray-300 w-8 h-8 flex items-center justify-center rounded-full p-2" />
                  <p className="hidden lg:block md:block">Lời mời kết bạn</p>
                </div>
                <div className="hidden items-center md:flex lg:flex">
                  <MdArrowForwardIos />
                </div>
              </NavLink>

              {/* Gợi ý */}
              <NavLink
                to="/friends/hint"
                className="flex justify-between p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <IoMdPersonAdd className="icon-navlink text-[20px] bg-gray-300 w-8 h-8 flex items-center justify-center rounded-full p-2" />
                  <p className="hidden lg:block md:block">Gợi ý</p>
                </div>
                <div className="hidden items-center md:flex lg:flex">
                  <MdArrowForwardIos />
                </div>
              </NavLink>

              {/* Danh sách bạn bè */}
              <NavLink
                to="/friends/listFriendNow"
                className="flex justify-between p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PiUserListFill className="icon-navlink text-[20px] bg-gray-300 w-8 h-8 flex items-center justify-center rounded-full p-2" />
                  <p className="hidden lg:block md:block">Danh sách bạn bè</p>
                </div>
                <div className="hidden items-center md:flex lg:flex">
                  <MdArrowForwardIos />
                </div>
              </NavLink>

              {/* Danh sách chặn*/}
              <NavLink
                to="/friends/block"
                className="flex justify-between p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PiUserListFill className="icon-navlink text-[20px] bg-gray-300 w-8 h-8 flex items-center justify-center rounded-full p-2" />
                  <p className="hidden lg:block md:block">Danh sách chặn</p>
                </div>
                <div className="hidden items-center md:flex lg:flex">
                  <MdArrowForwardIos />
                </div>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="w-3/4 ">
          <Outlet />
        </main>
      </div>
    </>
  );
}
