import React from "react";
import GroundHeader from "./GroupHeader";
import { FaSearch } from "react-icons/fa";
import myImage from "../../../assets/avartaMeo.jpg";
import { Button } from "antd";

export default function GroupAdmin() {
  return (
    <>
      <Navbar></Navbar>
      <GroundHeader />
      <div className="bg-gray-100 w-3/4 ml-auto  flex justify-center font-semibold">
        {/* Thẻ cha có chiều cao `h-screen` và căn giữa nội dung */}
        <div className="bg-white rounded-md  w-1/2 mt-5">
          {/* Thẻ con chiếm 1/2 chiều cao và căn giữa */}
          <div className="m-5 border-b-2 pb-4">
            <p className="text-[16px]">
              Mọi Người <span className="text-gray-400">2.201</span>
            </p>
            <p className="text-gray-400 text-[14px]">
              Người và Trang mới tham gia nhóm này sẽ hiển thị tại đây.
            </p>
            <div className="relative mt-4">
              {/* Search Input */}
              <input
                type="search"
                placeholder="メンバー検索"
                className="w-full px-10  border border-gray-300 rounded-full"
              />
              {/* Search Icon */}
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex  flex-col mx-5 pb-4 border-b-2 justify-between">
            <div>
              <p>Quản trị viên và người kiểm duyệt</p>
            </div>

            <div>
              <ul>
                <li className="flex border-b-2 justify-between  pb-4">
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
                      <h3 class="text-custom-gray text-sm">Nguyễn văn Mều</h3>
                      <p class="text-gray-500 text-[12px]">Bắc Ninh</p>
                    </div>
                  </div>
                  <Button className="border-none bg-gray-300">...</Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex  flex-col mx-5 pb-4 border-b-2 justify-between">
            <div>
              <p>Danh sách thành viên</p>
            </div>

            <div>
              <ul>
                <li className="flex border-b-2 justify-between  pb-4">
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
                      <h3 class="text-custom-gray text-sm">Nguyễn văn Mều</h3>
                      <p class="text-gray-500 text-[12px]">Bắc Ninh</p>
                    </div>
                  </div>
                  <Button className="border-none bg-gray-300 text-center">
                    ...
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
