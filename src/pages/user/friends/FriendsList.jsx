import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FriendsList() {
  return (
    <>
      <div className="flex min-h-screen font-semibold mt-10">
        <div className="w-1/4 flex flex-col border-r-2  shadow-full h-auto  bg-white ">
          <div className="flex items-center gap-5 m-5">
            <Link
              to={"/friends"}
              className="text-[30px] text-gray-500 hover:bg-gray-300 rounded-full "
            >
              <IoIosArrowRoundBack />
            </Link>
            <div>
              <a href="" className="text-gray-500">
                Bạn bè
              </a>
              <h1 className="text-[20px]">Tất cả bạn bè</h1>
            </div>
          </div>
          <div className="relative  mx-5 border-b-2 border-gray-200 pb-3">
            {/* Search Input */}
            <input
              type="search"
              placeholder="検索"
              className="w-full px-10 py-1  border border-gray-300 rounded-full"
            />
            {/* Search Icon */}
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="mx-5 flex flex-col ">
            <ul>
              <li className="flex items-center mt-5 gap-4 p-4 hover:bg-gray-100 rounded-md hover:cursor-pointer">
                <img
                  height={60}
                  width={60}
                  src={myImage}
                  alt="Avatar"
                  className="rounded-full"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <p className=" text-sm">Nguyễn Văn Mều</p>
                </div>
                <button class="w-10 h-10 flex items-center justify-cente  rounded-full text-gray-800  focus:outline-none">
                  <span class="text-2xl">...</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-3/4 flex items-center justify-center">
          <div className="flex items-center flex-col gap-3">
            <CgProfile className="text-[30px]" />
            <p className="text-[24px] text-gray-500">
              Chọn tên của người mà bạn muốn xem trước trang cá nhân.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
