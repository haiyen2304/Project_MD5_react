import React from "react";
import { IoMdSettings } from "react-icons/io";
import { Button } from "antd";
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

export default function Groups() {
  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/4 #ffffff px-4 py-2 flex flex-col ">
          <div className="flex justify-between items-center ">
            <h2 className="text-[24px] text-black">Nhóm</h2>
            <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
              <IoMdSettings className="text-lg" />
            </div>
          </div>
          <div className="relative mt-4">
            {/* Search Input */}
            <input
              type="search"
              placeholder="検索"
              className="w-full px-10  border border-gray-300 rounded-full"
            />
            {/* Search Icon */}
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-col gap-3 mt-3 overflow-auto">
            <div className="flex gap-5">
              <div className="flex items-center p-1 bg-gray-300 rounded-full">
                <FaNewspaper />
              </div>
              <p>bảng feed của bạn</p>
            </div>
            <div className="flex gap-5">
              <div className="flex items-center p-1 bg-gray-300 rounded-full">
                <RiCompassDiscoverFill />
              </div>
              <p>khám phá</p>
            </div>

            <div className="flex gap-5">
              <div className="flex items-center p-1 bg-gray-300 rounded-full">
                <MdGroups />
              </div>
              <p>nhóm</p>
            </div>
            <Button className="border-none bg-blue-200 text-blue-600">
              + tạo nhóm mới
            </Button>

            <div className="flex justify-between border-t-2 pt-2">
              <p className="text-[14px]">nhóm đã tham gia</p>
              <a href="" className="text-[14px] text-blue-400">
                xem tất cả
              </a>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>

            <div className="flex  gap-3">
              <div className="">
                <img
                  src={myImage}
                  alt=""
                  height={50}
                  width={50}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <p>cộng đồng cộng nghệ </p>
                <p className="text-[12px] text-gray-500">
                  lần hoạt động gần nhất 2 giờ trước
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4 #ffffff px-4 py-2 flex flex-col">
          <div>
            <img
              src={myImage}
              alt=""
              className="w-full h-[350px] object-cove rounded-b-md"
            />
          </div>
          <h1 className="text-[30px] mt-3">Cộng Đồng Công Nghệ Thông Tin</h1>
          <div className="flex items-center gap-3">
            <div>
              <FaEarthAmericas className="text-[12px]" />
            </div>
            <div className="flex gap-2">
              <p className="text-[12px] text-gray-500">nhóm công khai</p>
              <p className="text-[12px] text-gray-500">8,5k thành viên</p>
            </div>
          </div>

          <div className="flex mt-3 justify-between border-b-2 pb-2">
            <div className="flex mt-3 items-center">
              <img
                src={myImage}
                alt=""
                height={30}
                width={30}
                className="rounded-full border border-white -ml-1"
              />
              <img
                src={myImage}
                alt=""
                height={30}
                width={30}
                className="rounded-full border border-white -ml-1"
              />
              <img
                src={myImage}
                alt=""
                height={30}
                width={30}
                className="rounded-full border border-white -ml-1"
              />
              <img
                src={myImage}
                alt=""
                height={30}
                width={30}
                className="rounded-full border border-white -ml-1"
              />
              <img
                src={myImage}
                alt=""
                height={30}
                width={30}
                className="rounded-full border border-white -ml-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button className="text-[12px] bg-blue-500 text-white">
                + Mời
              </Button>
              <Button className="text-[12px] bg-gray-300">
                <FaShare />
                chia sẻ
              </Button>
              <Button className="text-[12px]  bg-gray-300">
                <MdGroups2 />
                Đã tham gia
                <BiSolidDownArrow />
              </Button>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex gap-3">
              <a
                className="text-[14px] hover:bg-gray-200 p-1  rounded-md"
                href=""
              >
                giới thiệu
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                thảo luận
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                đáng chú ý
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                mọi người
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                sự kiện
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                File phương tiện
              </a>
              <a
                className="text-[14px] hover:bg-gray-200 p-1 rounded-md"
                href=""
              >
                File
              </a>
            </div>
          </div>

          <div className="flex justify-center bg-gray-100 min-h-screen">
            {/* Container chính */}
            <div className="w-full max-w-4xl flex">
              {/* Nội dung chính (bên trái) */}
              <div className="w-3/4 bg-gray-100 mr-5">
                <div className="mt-5 ml-4 bg-white p-4  flex flex-col rounded-md">
                  {/* Đăng bài viết */}
                  <div className="flex items-center px-3 rounded-lg  ">
                    <img
                      src={myImage}
                      alt="Avatar"
                      height={30}
                      width={30}
                      className="rounded-full"
                    />
                    <Button className="ml-4 w-full rounded-full bg-gray-200 px-4 h-7 text-left text-gray-600 border-none">
                      Bạn viết gì đi...
                    </Button>
                  </div>
                  <div className="flex justify-around border-t-1 mt-2">
                    <Button className="text-gray-500 border-none">
                      <LiaUserSecretSolid className="text-blue-500" />
                      Bài viết ẩn danh
                    </Button>
                    <Button className="text-gray-500 border-none">
                      <FaImages className="text-green-500" />
                      Ảnh
                    </Button>
                    <Button className="text-gray-500 border-none">
                      <FiBarChart2 className="text-orange-500" />
                      Thăm dò ý kiến
                    </Button>
                  </div>
                </div>
                {/* Danh sách bài viết */}
                <div className="bg-white  rounded-lg shadow-sm mt-5 ml-5 ">
                  <div className="m-5">
                    <div className="flex items-start gap-3 ">
                      <img
                        src={myImage}
                        alt="Avatar"
                        className="rounded-full w-7 h-7"
                      />
                      <div className="flex flex-col flex-1">
                        <p className="font-medium text-gray-800">
                          Nguyễn Văn A
                        </p>
                        <p className="text-sm text-gray-500">2 giờ trước</p>
                      </div>
                      <Button className="text-gray-500 bg-transparent border-none">
                        ...
                      </Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700">Mèo mặt lợn</p>
                      <div className="flex justify-center mt-3">
                        <img
                          src={myImage}
                          alt="Hình ảnh bài viết"
                          className="rounded-lg w-[750px] h-[395px]"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <Button className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-500 rounded-md p-2">
                        <AiOutlineLike />
                        Thích
                      </Button>
                      <Button className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-500 rounded-md p-2">
                        <FaRegComment />
                        Bình luận
                      </Button>
                      <Button className="text-gray-600 flex items-center gap-1 border-none hover:bg-gray-500 rounded-md p-2">
                        <FaShare />
                        Chia sẻ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Nội dung bên phải */}
              <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-700">Giới Thiệu</h3>
                <p>Cộng đồng công nghệ thông tin</p>
                <div className="flex items-center">
                  <FaEarthAmericas />
                  <p>công khai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
