import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";
import { CgProfile } from "react-icons/cg";
import Navbar from "../../../layouts/user/navbar/Navbar";
import { Link } from "react-router-dom";

export default function FriendInvitation() {
  return (
    <>
      <div className="flex min-h-screen font-semibold mt-10">
        <div className="w-1/4 flex flex-col border-r-2 border-gray-300 shadow-full h-auto ">
          <div className="flex items-center gap-5 m-5 border-b-2 pb-3">
            <Link to={"/friends"}>
              <IoIosArrowRoundBack className="text-[30px] text-gray-500" />
            </Link>
            <div>
              <a href="" className="text-gray-500">
                Bạn bè
              </a>
              <h1 className="text-[20px]">Lời mời kết bạn</h1>
            </div>
          </div>
          <div className="mx-5 flex flex-col ">
            <p>299 lời mời kết bạn</p>
            <ul>
              <li className="flex items-center mt-5 gap-4 p-4 bg-white hover:bg-gray-100 rounded-md">
                <img
                  height={60}
                  width={60}
                  src={myImage}
                  alt="Avatar"
                  className="rounded-full"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <p className=" text-sm">Nguyễn Văn Mều</p>
                  <div className="flex gap-3">
                    <Button className="w-20 h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Xác Nhận
                    </Button>
                    <Button className="w-20 h-10 bg-gray-400  rounded-md hover:bg-red-600">
                      Xóa
                    </Button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">5 ngày</p>
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
